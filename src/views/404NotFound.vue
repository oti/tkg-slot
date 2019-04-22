<template>
  <VContainer fluid> <CompositeHttpErrorCard404 /> </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CompositeHttpErrorCard404 from '@/components/composites/CompositeHttpErrorCard404.vue'

@Component({
  components: {
    CompositeHttpErrorCard404
  }
})
export default class NotFound extends Vue {}
</script>
