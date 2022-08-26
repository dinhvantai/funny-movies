<template>
  <v-row justify="center" align="center" class="mt-2">
    <v-col v-for="movie in movies" :key="movie.id" sm="10" cols="12">
      <YoutubePlayer :video-id="movie.video_id"/>
    </v-col>
    <v-col cols="12">
      <div class="text-center">
        <v-pagination
          :value="pagination.page"
          :length="Math.ceil(pagination.total / pagination.perPage)"
          :total-visible="9"
          circle
          @input="changePage"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import YoutubePlayer from '~/components/YoutubePlayer'

export default {
  name: 'IndexPage',
  components: { YoutubePlayer },
  head () {
    return {
      title: 'Funny Movies',
    }
  },
  computed: {
    user () {
      return this.$store.getters['profile/getUser']
    },
    pagination () {
      return this.$store.getters['sharedMovies/getPagination']
    },
    movies () {
      return this.$store.getters['sharedMovies/getMovies']
    },
  },
  methods: {
    async changePage (page) {
      await this.$store.dispatch('sharedMovies/doSetPagination', { page })
      await this.$store.dispatch('sharedMovies/doFetchMovies')
    },
  },
}
</script>
