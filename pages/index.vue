<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="d-flex justify-center align-center">
      <v-switch
        v-model="isPublic"
        :disabled="!user.id"
        :label="`${isPublic ? 'Public' : 'Private'}`"
      />
    </v-col>
    <v-col v-for="i in [1,2,3,4,5,6,7,8,9,10,11]" :key="i" sm="10" cols="12">
      <YoutubePlayer video-id="LjhCEhWiKXk"/>
    </v-col>
    <v-col>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="60"
          :total-visible="9"
          circle
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
  data: () => ({
    page: 1,
    isPublic: true,
  }),
  computed: {
    user () {
      return this.$store.getters['profile/getUser']
    },
  },
}
</script>
