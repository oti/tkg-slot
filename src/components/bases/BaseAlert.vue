<template>
  <VAlert v-bind="$attrs" :value="value" :type="type" class="c-alert">
    <slot />
  </VAlert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseAlert extends Vue {
  @Prop({ default: false })
  value!: boolean
  @Prop() type!: string
}
</script>
