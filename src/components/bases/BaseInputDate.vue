<template>
  <VTextField
    v-model="value_"
    v-bind="$attrs"
    type="date"
    @input="value_ = $event"
  />
</template>

<script lang="ts">
import { NullableString } from '@/models/NullableString'
import { isStringOfNotEmpty } from '@/utilities/isString'
import dayjs from 'dayjs'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseInputDate extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop({ required: true })
  value!: NullableString

  /**
   * 算出プロパティを定義する
   */
  get value_() {
    return this.value
  }
  set value_(val: NullableString) {
    let res: NullableString = val

    // 日付のフォーマットをISO8601形式に整形する
    if (isStringOfNotEmpty(val) && val.length === 10) {
      const day = dayjs(val)
      if (day.isValid()) {
        res = day.format('YYYY-MM-DD')
      }
    }

    this.$emit('input', res)
  }
}
</script>
