<template>
  <div class="profile-page" v-if="profile">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              :src="profile.image"
              class="user-img"
            />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <nuxt-link
              :to="{ name: 'settings' }"
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="user.username === profile.username"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              :disabled="followDisabled"
              @click="onFollow"
              class="btn btn-sm btn-outline-secondary action-btn"
              v-else
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              &nbsp;
              {{
              (profile.following ? 'Unfollow ' : 'Follow ') + profile.username
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  :to="{ 
                    name: 'profile', 
                    params: { username: profile.username }
                  }"
                  class="nav-link"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  :to="{ 
                    name: 'profile-favorites', 
                    params: { username: profile.username }
                  }"
                  class="nav-link"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            :key="article.slug"
            class="article-preview"
            v-for="article in articles"
          >
            <div class="article-meta">
              <nuxt-link :to="{ name: 'profile', params: { username: profile.username }}">
                <img :src="profile.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{ name: 'profile', params: { username: profile.username }}"
                  class="author"
                >{{ profile.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                v-if="routeName !== 'profile'"
                :class="{
                  active: article.favorited
                }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
                class="btn btn-outline-primary btn-sm pull-xs-right"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                :class="{
                  active: item === page
                }"
                :key="item"
                class="page-item"
                v-for="item in totalPage"
              >
                <nuxt-link
                  :to="{
                    name: routeName,
                    params: {
                      username: profile.username,
                      page: item,
                    }
                  }"
                  class="page-link"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, followUser, unfollowUser } from '@/api/profile'
import {
  getArticles,
  deleteFavorite,
  addFavorite
} from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'ProfileIndex',
  middleware: 'authenticated',
  data() {
    return {
      followDisabled: false
    }
  },
  async asyncData({ params, store, route }) {
    const page = Number.parseInt(params.page || 1)
    const limit = 1
    const username = params.username
    try {
      const param = {
        limit,
        offset: (page - 1) * limit,
      }
      let _data
      if (route.name === 'profile') {
        // 获取用户点赞的文章
        param.author = username
        const { data } = await getArticles(param)
        _data = data
      } else {
        // 获取用户写的文章
        param.favorited = username
        const { data } = await getArticles(param)
        _data = data
      }

      const { data } = await getProfile(username)
      return {
        profile: data.profile,
        articles: _data.articles,
        articlesCount: _data.articlesCount,
        limit,
        page,
        routeName: route.name
      }
    } catch (error) {
    }
  },

  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow() {
      this.followDisabled = true
      if (this.profile.following) {
        await unfollowUser(this.profile.username)
        this.profile.following = false
      } else {
        await followUser(this.profile.username)
        this.profile.following = true
      }
      this.followDisabled = false
    },
  },
}
</script>

<style scoped>
</style>