<template>
  <VCard class="p-http-error-card">
    <CompositeCardTitlePrimaryError>{{ title }}</CompositeCardTitlePrimaryError>
    <VDivider />
    <VCardText class="__summary">
      <p class="ma-0"><slot /></p>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import CompositeCardTitlePrimaryError from '@/components/composites/CompositeCardTitlePrimaryError.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    CompositeCardTitlePrimaryError
  }
})
export default class CompositeHttpErrorCard extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop() status!: number
  @Prop({ required: true })
  statusText!: string

  /**
   * 算出プロパティを定義する
   */
  get title() {
    if (Number.isFinite(this.status)) {
      return `${this.status} ${this.statusText}`
    }

    return this.statusText
  }
}
</script>
