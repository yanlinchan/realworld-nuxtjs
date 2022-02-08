<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form">
          <div class="card-block">
            <textarea
              class="form-control"
              placeholder="Write a comment..."
              rows="3"
            ></textarea>
          </div>
          <div class="card-footer">
            <img
              :src="user.image"
              class="comment-author-img"
            />
            <button class="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>

        <div
          :key="comment.id"
          class="card"
          v-for="comment in comments"
        >
          <div class="card-block">
            <p
              class="card-text"
              v-html="comment.body"
            ></p>
          </div>
          <div class="card-footer">
            <nuxt-link
              :to="{ name: 'profile', params: { username: comment.author.username } }"
              class="comment-author"
            >
              <img
                :src="comment.author.image"
                class="comment-author-img"
              />
            </nuxt-link>&nbsp;
            <nuxt-link
              :to="{ name: 'profile', params: { username: comment.author.username } }"
              class="comment-author"
            >{{ comment.author.username }}</nuxt-link>
            <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
            <span
              class="mod-options"
              v-if="user.username === article.author.username"
            >
              <!-- <i class="ion-edit"></i> -->
              <i class="ion-trash-a"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api/article'
import { mapState } from 'vuex'
import Markdownit from 'markdown-it'
export default {
  name: 'ArticleComment',
  props: {
    article: {
      type: Object
    }
  },
  data() {
    return {
      comments: []
    }
  },

  computed: {
    ...mapState(['user'])
  },

  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
    const md = new Markdownit()
    this.comments.forEach(comment => {
      comment.body = md.render(comment.body)
    })
  },
}
</script>

<style scoped>
</style>