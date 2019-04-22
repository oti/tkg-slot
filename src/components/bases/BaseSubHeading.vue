<template>
  <Component :is="heading" class="c-subheading"><slot /></Component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseSubHeading extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop({ default: 'h2' })
  heading!: string
}
</script>

<style scoped lang="stylus">
@import '~vuetify/src/stylus/settings/_variables'

.c-subheading {
  font-size: 1.1485rem
  font-weight: $font-weights.regular
}
</style>
