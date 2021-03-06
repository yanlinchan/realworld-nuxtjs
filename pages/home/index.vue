<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  class="nav-link"
                  exact
                  v-if="user"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  class="nav-link"
                  exact
                >Global Feed</nuxt-link>
              </li>

              <li
                class="nav-item"
                v-if="tag"
              >
                <nuxt-link
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                  class="nav-link"
                >{{ '#' + tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            :key="article.slug"
            class="article-preview"
            v-for="article in articles"
          >
            <div class="article-meta">
              <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{ name: 'profile', params: { username: article.author.username }}"
                  class="author"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                :class="{
                  active: article.favorited
                }"
                :disabled="article.favoriteDisabled"
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="onFavorite(article)"
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
                    name: 'home',
                    query: {
                      page: item,
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                  class="page-link"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item,
                  }
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getYourFeedArticles,
  deleteFavorite,
  addFavorite
} from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 1
    const tag = query.tag
    const tab = query.tab || 'global_feed'

    const _getArticles = tab === 'your_feed' ?
      getYourFeedArticles : getArticles

    const [articleRes, tagRes] = await Promise.all([
      _getArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    articles.forEach(article => {
      article.favoriteDisabled = false
    })

    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tab,
      tag,
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
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
    }
  },
}
</script>

<style>
</style>
