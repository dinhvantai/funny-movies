<template>
  <v-card class="logo py-2 px-4 d-flex justify-center">
    <v-row>
      <v-col cols="5" class="d-flex align-center">
        <iframe
          :src="`https://www.youtube.com/embed/${movie.video_id}`"
          frameborder="0"
          allow="autoplay; encrypted-media"
          title="video"
        />
      </v-col>
      <v-col cols="7">
        <v-card-title class="text--primary py-0">Video {{ movie.id }}</v-card-title>
        <v-card-text>
          <div class="text-subtitle-1">
            Shared by:
            <v-chip
              color="orange"
              label
              outlined
              class="m-0"
            >
              {{ movie.user.username }}
            </v-chip>
          </div>
          <v-row
            align="center"
            class="mx-0 my-1"
          >
            <span color="gray" class="mr-1">{{ likeData.length }}</span>
            <v-icon
              :color="`${isLiked ? 'blue lighten-3' : ''}`"
              small
              :disabled="!user?.id"
              @click="doLikeAction"
            >
              mdi-thumb-up
            </v-icon>
            <span class="ml-4 mr-1">{{ dislikeData.length }}</span>
            <v-icon
              :color="`${isDisliked ? 'deep-orange darken-1' : ''}`"
              small
              :disabled="!user?.id"
              @click="doDislikeAction"
            >
              mdi-thumb-down
            </v-icon>
          </v-row>
          <div class="text-subtitle-1">
            <strong>Description:</strong>
          </div>
          <div>
            [{{ movie.id }}] Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { DISLIKE_ACTION_VALUE, LIKE_ACTION_VALUE } from '@/configs/configs'

export default {
  name: 'YoutubePlayer',
  props: {
    movie: {
      type: Object,
      required: true,
      default: {},
    },
  },
  computed: {
    user () {
      return this.$store.getters['profile/getUser']
    },
    likeData () {
      return (this.movie?.actions || []).filter(item => item.action === LIKE_ACTION_VALUE)
    },
    dislikeData () {
      return (this.movie?.actions || []).filter(item => item.action === DISLIKE_ACTION_VALUE)
    },
    isLiked () {
      return !!this.likeData.find(item => item.user_id === this.user.id)
    },
    isDisliked () {
      return !!this.dislikeData.find(item => item.user_id === this.user.id)
    },
  },
  methods: {
    async doLikeAction () {
      await this.doAction(LIKE_ACTION_VALUE)
    },
    async doDislikeAction () {
      await this.doAction(DISLIKE_ACTION_VALUE)
    },
    async doAction (action) {
      try {
        const res = await this.$axios.post('actions', {
          movieId: this.movie.id,
          action,
        })
        await this.$store.dispatch('snackbar/doSetSnackbar', {
          value: true,
          content: res.data.message,
        })
        await this.$store.dispatch('sharedMovies/doFetchMovies', res.data.user)
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
