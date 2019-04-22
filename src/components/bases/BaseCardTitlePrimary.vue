<template>
  <VCardTitle primary-title class="c-card-title-primary"> <slot /> </VCardTitle>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BaseCardTitlePrimary extends Vue {}
</script>
