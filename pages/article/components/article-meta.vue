<template>
  <div>
    <div class="article-meta">
      <a href>
        <img :src="article.author.image" />
      </a>
      <div class="info">
        <a
          class="author"
          href
        >{{ article.author.username }}</a>
        <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
      <button
        :class="{ active: article.author.following }"
        class="btn btn-sm btn-outline-secondary"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        Follow {{ article.author.username }}
        <span
          class="counter"
        >({{ article.author.followedBy.length }})</span>
      </button>
      &nbsp;&nbsp;
      <button
        :class="{
          active: article.favorited
        }"
        class="btn btn-sm btn-outline-primary"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </div>
  </div>
</template>

<script>
import {
  deleteFavorite,
  addFavorite
} from '@/api/article'
export default {
  name: 'ArticleMeta',
  props: ['article'],
  methods: {
    async onFavorite(article) {
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

<style scoped>
</style>