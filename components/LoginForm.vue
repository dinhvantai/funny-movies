<template>
  <v-form v-model="valid" @submit.prevent="onLogin">
    <v-row>
      <v-col>
        <v-text-field
          v-model="username"
          :rules="emailRules"
          label="Username"
          required
        />
      </v-col>

      <v-col>
        <v-text-field
          v-model="password"
          type="password"
          :rules="passwordRules"
          label="Password"
          required
        />
      </v-col>
      <v-col>
        <v-btn
          type="submit"
          class="w-100"
          :loading="isSubmit"
          :disabled="!valid"
          color="default"
          @click="onLogin"
        >
          Login
          <template #loader>
            <span>Login...</span>
          </template>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          class="w-100"
          :loading="isSubmit"
          :disabled="!valid"
          color="primary"
          @click="onRegister"
        >
          Register
          <template #loader>
            <span>Register...</span>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import TokenService from '@/services/TokenService'

export default {
  name: 'LoginForm',
  data: () => ({
    isSubmit: false,
    valid: false,
    username: '',
    password: '',
    emailRules: [
      v => !!v || 'Username is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),
  methods: {
    async onRegister () {
      try {
        const res = await this.$axios.post('register', {
          username: this.username,
          password: this.password,
        })
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: res.data.message,
        })
      } catch (e) {
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: e.response?.data?.message || e.message,
          color: 'red accent-2',
        })
      }
    },
    async onLogin () {
      try {
        const res = await this.$axios.post('login', {
          username: this.username,
          password: this.password,
        })
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: res.data.message,
        })
        await this.$store.dispatch('profile/doSetUser', res.data.user)
        TokenService.saveToken(res.data.token)
      } catch (e) {
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: e.response?.data?.message || e.message,
          color: 'red accent-2',
        })
        await this.$store.dispatch('profile/doSetUser', {})
        TokenService.saveToken('')
      }
    },
  },
}
</script>
