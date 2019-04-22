<template>
  <div class="c-global-loading">
    <div class="__inner">
      <VProgressCircular indeterminate color="primary" size="50" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BaseGlobalLoading extends Vue {}
</script>

<style scoped lang="stylus">
@import '~vuetify/src/stylus/settings/_variables'

.c-global-loading {
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 1
  background-color: $body-bg-light

  .__inner {
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    display: flex
    justify-content: center
    align-items: center
  }
}
</style>
