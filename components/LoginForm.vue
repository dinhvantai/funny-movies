<template>
  <v-form v-model="valid">
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
          class="w-100"
          :loading="isSubmit"
          :disabled="!valid"
          color="default"
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
}
</script>
