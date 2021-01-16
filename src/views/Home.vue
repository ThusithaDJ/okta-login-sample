<template>
  <div id="home">
    <div v-if="!this.$parent.authenticated">
      <button v-on:click="login()">Login</button>
    </div>
    <div v-else>
      <p>Hi {{claims.name}}</p>
      <button v-on:click="logout()">
      Logout
    </button>
    </div>
  </div>
</template>

<script>

const PATH_TO_PROTECTED_ROUTE = '/private'
const POST_LOGOUT_REDIRECT_URI = 'http://localhost:8081/logged_out'
const ISSUER = 'https://dev-9970099.okta.com/oauth2/default'

export default {
  name: 'home',
  data: function() {
    return {
      claims: '',
    }
  },
  created(){this.setup()},
  methods: {
    async setup() {
      this.claims = await this.$auth.getUser()
      console.log('token '+await this.$auth.getAccessToken())
    },
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    login() {
      this.$auth.loginRedirect(PATH_TO_PROTECTED_ROUTE)
    },
    async logout() {
      // Read idToken before local session is cleared
      const idToken = await this.$auth.getIdToken()
      // Clear local session
      await this.$auth.logout()
      // Clear remote session
      window.location.href = `${ISSUER}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`
    }
  }
}
</script>