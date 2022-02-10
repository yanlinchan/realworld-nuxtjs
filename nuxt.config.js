module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes (routes, resolve) {
      routes.splice(0)

      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/profile/:username/:page?',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/profile/favorites/:username/:page?',
              name: 'profile-favorites',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: '/editor/:slug?',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            },
          ]
        },
        {
          path: '*', // 默认子路由
          name: '404',
          component: resolve(__dirname, 'pages/layout/error.vue')
        },
      ])
    }
  },
  server: {
    host:'0.0.0.0',
    port: 3000
  },
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
}