<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="submitForm">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  placeholder="URL of profile picture"
                  required
                  type="url"
                  v-model="formData.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  placeholder="Your Name"
                  required
                  type="text"
                  v-model="formData.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  placeholder="Short bio about you"
                  rows="8"
                  v-model="formData.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  placeholder="Email"
                  required
                  type="email"
                  v-model="formData.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  minlength="8"
                  placeholder="New Password"
                  type="password"
                  v-model="formData.password"
                />
              </fieldset>
              <button
                :disabled="submitDisabled"
                class="btn btn-lg btn-primary pull-xs-right"
              >Update Settings</button>
            </fieldset>
          </form>
          <hr />
          <button
            @click="logout"
            class="btn btn-outline-danger"
          >Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { update } from '@/api/user'
import { mapMutations, mapState } from 'vuex'
// 仅在客户端加载 js-cookie
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'SettingsIndex',
  middleware: 'authenticated',
  data() {
    return {
      formData: {
        bio: '',
        email: '',
        image: '',
        username: '',
        password: ''
      },
      errors: {},
      submitDisabled: false,
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations(['setUserNull']),
    logout() {
      this.setUserNull()
      Cookie.set('user', null)
      this.$router.push('/')
    },
    async submitForm() {
      try {
        this.submitDisabled = true
        const updatedUser = {
          ...this.formData,
          token: this.user.token
        }
        const { data } = await update({ user: updatedUser })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
      } catch (err) {
        this.errors = err.response.data.errors
      } finally {
        this.submitDisabled = false
        this.$router.push('/')
      }
    }
  },

  mounted() {
    this.formData = {
      bio: this.user.bio,
      email: this.user.email,
      image: this.user.image,
      username: this.user.username,
      password: ''
    }
  },
}
</script>

<style scoped>
</style>