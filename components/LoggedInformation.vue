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
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >
            Sharing a scary video to everyone in the world...
          </v-toolbar>
          <v-card-text>
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
          </v-card-text>
          <v-card-actions class="justify-end p-5">
            <v-btn @click="dialog.value = false">
              Cancel
            </v-btn>
            <v-btn color="primary">
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
    onLogout () {
      TokenService.saveToken('')
      this.$store.dispatch('profile/doSetUser', {})
    },
  },
}
</script>
