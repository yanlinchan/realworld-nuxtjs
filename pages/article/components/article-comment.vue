<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form @submit.prevent="postComment" class="card comment-form">
          <div class="card-block">
            <textarea
              class="form-control"
              placeholder="Write a comment..."
              rows="3"
              v-model="writingComment"
            ></textarea>
          </div>
          <div class="card-footer">
            <img
              :src="user.image"
              class="comment-author-img"
            />
            <button
              :disabled="postDisabled"
              class="btn btn-sm btn-primary"
            >Post Comment</button>
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
              v-if="user.username === comment.author.username"
            >
              <!-- <i class="ion-edit"></i> -->
              <i class="ion-trash-a" @click="deleteComment(comment.id)"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, postComment, deleteComment } from '@/api/article'
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
      comments: [],
      writingComment: '',
      postDisabled: false
    }
  },

  computed: {
    ...mapState(['user']),
  },

  methods: {
    async postComment () {
      if (this.writingComment.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
        return
      }
      this.postDisabled = true
      const { data } = await postComment({
        slug: this.article.slug,
        comment: {
          body: this.writingComment
        }
      })

      if (data.comment) {
        const comment = data.comment
        const md = new Markdownit()
        comment.body = md.render(comment.body)
        this.comments.push(comment)
      }
      this.writingComment = ''
      this.postDisabled = false
    },

    async deleteComment (id) {
      await deleteComment({
        slug: this.article.slug,
        id
      })
      this.comments = this.comments.filter(comment => comment.id !== id)
    }
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