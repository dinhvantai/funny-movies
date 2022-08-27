<template>
  <v-row>
    <v-col class="d-flex justify-end">
      <div>
        Welcome: <strong class="title text-uppercase">{{ user.username }}</strong>
      </div>
      <div class="ml-6">
        <v-btn
          class="w-100"
          color="primary"
          @click="shareOpening = true"
        >
          <v-icon>mdi-share</v-icon>
          <span class="ml-2">Share a movie</span>
        </v-btn>
      </div>
      <div class="ml-16">
        <v-btn
          class="w-100"
          color="secondary"
          @click="onLogout"
        >
          Logout
        </v-btn>
      </div>
    </v-col>

    <v-dialog
      v-model="shareOpening"
      transition="dialog-top-transition"
      max-width="600"
    >
      <template #default="dialog">
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >
            Sharing a scary video to everyone in the world...
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isValid" @submit.prevent>
              <v-row class="mt-2">
                <v-col cols="12">
                  <v-text-field
                    v-model="url"
                    :rules="urlRules"
                    label="Input sharing URL"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end p-5">
            <v-btn @click="dialog.value = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!isValid"
              @click="onShareMovie"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
</template>

<script>
import TokenService from '@/services/TokenService'

export default {
  name: 'LoggedInformation',
  data: () => ({
    shareOpening: false,
    isValid: false,
    url: '',
    urlRules: [
      v => !!v || 'Url is required',
    ],
  }),
  computed: {
    user () {
      return this.$store.getters['profile/getUser']
    },
  },
  methods: {
    async onLogout () {
      TokenService.saveToken('')
      await this.$store.dispatch('profile/doSetUser', {})
      await this.$store.dispatch('sharedMovies/doFetchMovies')
    },
    async onShareMovie () {
      try {
        const res = await this.$axios.post('movies', { url: this.url })
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: res.data.message,
        })

        await this.$store.dispatch('sharedMovies/doFetchMovies')
        this.shareOpening = false
        this.url = ''
      } catch (e) {
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: e.response?.data?.message || e.message,
          color: 'red accent-2',
        })
      }
    },
  },
}
</script>
