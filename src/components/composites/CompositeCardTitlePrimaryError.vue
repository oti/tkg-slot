<template>
  <BaseCardTitlePrimary class="--error">
    <VIcon color="error" class="mr-3">error</VIcon>
    <BaseSubHeading><slot /></BaseSubHeading>
  </BaseCardTitlePrimary>
</template>

<script lang="ts">
import BaseCardTitlePrimary from '@/components/bases/BaseCardTitlePrimary.vue'
import BaseSubHeading from '@/components/bases/BaseSubHeading.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BaseCardTitlePrimary,
    BaseSubHeading
  }
})
export default class CompositeCardTitlePrimaryError extends Vue {}
</script>
