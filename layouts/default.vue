<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      height="84"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title class="d-flex align-center">
        <v-icon class="mx-2">mdi-home</v-icon>
        {{ title }}
      </v-toolbar-title>
      <div class="d-flex align-center">
        <v-switch
          class="mt-5 ml-4"
          :input-value="!pagination.isPrivate"
          :disabled="!user.id"
          :label="`${pagination.isPrivate ? 'Private' : 'Public'}`"
          @change="changeVisible"
        />
      </div>

      <v-spacer/>
      <LoginForm v-if="!user.id"/>
      <LoggedInformation v-if="user.id"/>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
      class="d-flex justify-center"
    >
      <span>Funny movies &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-snackbar
      dark
      right
      :timeout="snackbar.timeout"
      :value="snackbar.value"
      :color="snackbar.color"
      rounded="pill"
      @input="onChangeSnackbar"
    >
      {{ snackbar.content }}
      <template #action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="() => onChangeSnackbar(false)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import LoginForm from '~/components/LoginForm'
import LoggedInformation from '~/components/LoggedInformation'

export default {
  name: 'DefaultLayout',
  components: {
    LoginForm,
    LoggedInformation,
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Homepage',
          to: '/',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Funny Movies',
    }
  },
  computed: {
    snackbar () {
      return this.$store.getters['snackbar/getSnackbar']
    },
    user () {
      return this.$store.getters['profile/getUser']
    },
    pagination () {
      return this.$store.getters['sharedMovies/getPagination']
    },
  },
  async mounted () {
    try {
      await this.$store.dispatch('sharedMovies/doFetchMovies')
    } catch (e) {
    }
  },
  methods: {
    onChangeSnackbar (value) {
      this.$store.dispatch('snackbar/doSetSnackbar', { value })
    },
    async changeVisible () {
      await this.$store.dispatch('sharedMovies/doSetPagination', { isPrivate: !this.pagination.isPrivate })
      await this.$store.dispatch('sharedMovies/doFetchMovies')
    },
  },
}
</script>
