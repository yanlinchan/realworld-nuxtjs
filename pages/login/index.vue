<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href>Have an account?</a> -->
            <nuxt-link
              to="/register"
              v-if="isLogin"
            >Need an account?</nuxt-link>
            <nuxt-link
              to="/login"
              v-else
            >Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li
                :key="index"
                v-for="(message, index) in messages"
              >{{ field }}{{ message }}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset
              class="form-group"
              v-if="!isLogin"
            >
              <input
                class="form-control form-control-lg"
                placeholder="Your Name"
                type="text"
                v-model="user.username"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                placeholder="Email"
                required
                type="email"
                v-model="user.email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                minlength="8"
                placeholder="Password"
                required
                type="password"
                v-model="user.password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">{{ isLogin ? 'Sign in' : 'Sign up'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'

// 仅在客户端加载 js-cookie
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'LoginIndex',
  middleware: 'notAuthenticated',
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    }
  },

  data() {
    return {
      user: {
        username: '陈延林',
        email: 'cyl468520253@gmail.com',
        password: 'CYi864565'
      },
      errors: {}
    }
  },

  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin ?
          await login({
            user: this.user
          }) :
          await register({
            user: this.user
          })

        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user, { expires: 7 })
        this.$router.push('/')
      } catch (err) {
        this.errors = err.response.data.errors
      }

    }
  },
}
</script>

<style scoped>
</style>