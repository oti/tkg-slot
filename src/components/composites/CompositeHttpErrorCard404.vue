<template>
  <CompositeHttpErrorCard :status="404" status-text="Not Found" class="--404">
    指定のページは見つかりませんでした。
  </CompositeHttpErrorCard>
</template>

<script lang="ts">
import CompositeHttpErrorCard from '@/components/composites/CompositeHttpErrorCard.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    CompositeHttpErrorCard
  }
})
export default class CompositeHttpErrorCard404 extends Vue {}
</script>
