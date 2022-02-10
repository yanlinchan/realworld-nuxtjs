<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li
                :key="index"
                v-for="(message, index) in messages"
              >{{ field }}{{ message }}</li>
            </template>
          </ul>
          <form @submit.prevent="publishArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  type="text"
                  minlength="1"
                  required
                  v-model="title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  placeholder="What's this article about?"
                  type="text"
                  minlength="1"
                  required
                  v-model="description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  placeholder="Write your article (in markdown)"
                  rows="8"
                  minlength="1"
                  required
                  v-model="body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  placeholder="Enter tags"
                  type="text"
                  v-model="tagStr"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                :disabled="publishDisabled"
                class="btn btn-lg pull-xs-right btn-primary"
              >Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, addArticle, updateArticle } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'EditorIndex',
  middleware: 'authenticated',

  data() {
    return {
      publishDisabled: false,
      article: null,
      title: '',
      tagStr: '',
      description: '',
      body: '',
      errors: {}
    }
  },

  computed: {
    ...mapState(['user']),
    tagList () {
      if (this.tagStr.length) {
        return this.tagStr.split(/[,\sv]/g)
      }
      return []
    }
  },

  methods: {
    async publishArticle () {
      this.publishDisabled = true
      console.log('1');
      const param = {
        slug: null,
        article: {
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tagList
        }
      }
      try {
        if (this.$route.params.slug) {
          param.slug = this.$route.params.slug
          await updateArticle(param)
        } else {
          const res = await addArticle(param)
          if (res.status === 200) {
            param.slug = res.data.article.slug
          }
        }
        if (param.slug) {
          this.$router.push({ name: 'article', params: { slug: param.slug } })
        }
      } catch (err) {
        this.errors = err.response.data.errors
      } finally {
        this.publishDisabled = false
      }
    }
  },

  async mounted() {
    if (this.$route.params.slug) {
      try {
        const { data } = await getArticle(this.$route.params.slug)
        if (data.article.author.username !== this.user.username) {
          this.$router.push('/')
          return
        }
        this.article = data.article
        this.title = this.article.title
        this.tagStr = this.article.tagList.join(',')
        this.description = this.article.description
        this.body = this.article.body
      } catch (error) {
        this.$router.push('/')
      }
    }
  },
}
</script>

<style scoped>
</style>