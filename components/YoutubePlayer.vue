<template>
  <v-card class="logo py-2 px-4 d-flex justify-center">
    <v-row>
      <v-col cols="5" class="d-flex align-center">
        <iframe
          :src="`https://www.youtube.com/embed/${videoId}`"
          frameborder="0"
          allow="autoplay; encrypted-media"
          title="video"
        />
      </v-col>
      <v-col cols="7">
        <v-card-title class="text--primary py-0">Cafe Badilico</v-card-title>
        <v-card-text>
          <div class="text-subtitle-1">
            Shared by:
            <v-chip
              color="orange"
              label
              outlined
              class="m-0"
            >
              taiDV
            </v-chip>
          </div>
          <v-row
            align="center"
            class="mx-0 my-1"
          >
            <span color="gray" class="mr-1">1</span>
            <v-icon color="blue lighten-3" small class="cursor-pointer">mdi-thumb-up</v-icon>
            <span class="ml-4 mr-1">1</span>
            <v-icon color="deep-orange darken-1" small class="cursor-pointer">mdi-thumb-down</v-icon>
          </v-row>
          <div class="text-subtitle-1">
            <strong>Description:</strong>
          </div>
          <div>
            [26] Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'YoutubePlayer',
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
}
</script>
