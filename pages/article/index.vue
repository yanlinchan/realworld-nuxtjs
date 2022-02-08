<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div
          class="col-md-12"
          v-html="article.body"
        ></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <article-comment :article="article"></article-comment>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import Markdownit from "markdown-it"
import ArticleMeta from './components/article-meta.vue'
import ArticleComment from './components/article-comment.vue'
export default {
  name: 'ArticleIndex',
  components: {
    ArticleMeta,
    ArticleComment,
  },
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new Markdownit()
    article.body = md.render(article.body)
    return {
      article: article
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWord`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description }
      ]
    }
  }
}
</script>

<style scoped>
</style>