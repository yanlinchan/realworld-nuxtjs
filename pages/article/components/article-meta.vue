<template>
  <div>
    <div class="article-meta">
      <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }">
        <img :src="article.author.image" />
      </nuxt-link>
      <div class="info">
        <nuxt-link
          class="author"
          :to="{ name: 'profile', params: { username: article.author.username } }"
        >{{ article.author.username }}</nuxt-link>
        <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
      <template v-if="createdByCurrentUser">
        <nuxt-link
          :to="{ name: 'editor', params: { slug: article.slug } }"
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>
        <button
          :disabled="deleteDisabled"
          @click="deleteArticle"
          class="btn btn-outline-danger btn-sm"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </template>
      <template v-else>
        <button
          :class="{ active: article.author.following }"
          :disabled="followDisabled"
          class="btn btn-sm btn-outline-secondary"
          @click="onFollow"
        >
          <i class="ion-plus-round"></i>
          &nbsp;
          {{
          (article.author.following ? 'Unfollow ' : 'Follow ') + article.author.username
          }}
          <span
            class="counter"
          >({{ article.author.followedBy.length }})</span>
        </button>
        &nbsp;&nbsp;
        <button
          :class="{
            active: article.favorited
          }"
          :disabled="favoriteDisabled"
          @click="onFavorite()"
          class="btn btn-sm btn-outline-primary"
        >
          <i class="ion-heart"></i>
          &nbsp;
          Favorite Post
          <span class="counter">({{ article.favoritesCount }})</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import {
  deleteFavorite,
  addFavorite,
  deleteArticle,
} from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: ['article'],
  data() {
    return {
      deleteDisabled: false,
      favoriteDisabled: false,
      followDisabled: false,
    }
  },
  computed: {
    ...mapState(['user']),
    createdByCurrentUser() {
      if (this.user.username === this.article.author.username) {
        return true
      }
      return false
    }
  },
  methods: {
    async onFavorite() {
      this.favoriteDisabled = true
      if (this.article.favorited) {
        await deleteFavorite(this.article.slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
      } else {
        await addFavorite(this.article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
      this.favoriteDisabled = false
    },

    async onFollow() {
      this.followDisabled = true
      if (this.article.author.following) {
        await unfollowUser(this.article.author.username)
        this.article.author.following = false
        this.article.author.followedBy.pop()
      } else {
        await followUser(this.article.author.username)
        this.article.author.following = true
        this.article.author.followedBy.push(this.user)
      }
      this.followDisabled = false
    },

    async deleteArticle() {
      this.deleteDisabled = true
      try {
        await deleteArticle(this.article.slug)
      } catch (error) {
      } finally {
        this.deleteDisabled = false
        this.$router.push('/')
      }
    }
  },

}
</script>

<style scoped>
</style>