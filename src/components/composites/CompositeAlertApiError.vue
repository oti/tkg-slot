<template>
  <BaseAlertInfo :value="items.length > 0" :type="type" class="--api-error">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <div class="__message" v-html="item.message" />
        <small>（コード: {{ item.code }}）</small>
      </li>
    </ul>
  </BaseAlertInfo>
</template>

<script lang="ts">
import BaseAlertInfo from '@/components/bases/BaseAlert.vue'
import { ApiError } from '@/models/ApiErrorResponse'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BaseAlertInfo
  }
})
export default class CompositeAlertApiError extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop({ default: () => [] })
  items!: ApiError[]
  @Prop({ default: 'error' })
  type!: string
}
</script>

<style scoped lang="stylus">
.--api-error {
  .__message {
    display: inline-block
  }
}
</style>
