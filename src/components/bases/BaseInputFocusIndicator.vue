<template>
  <div :class="['c-inputFocusIndicator', error ? 'error' : 'primary']" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class BaseInputFocusIndicator extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop({ default: false })
  error!: boolean
}
</script>
<style lang="stylus" scoped>
.c-inputFocusIndicator
  border-color currentColor
  border-style solid
  border-width thin 0 thin 0
  width 100%
  transition 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
  transform scaleX(0)
</style>
