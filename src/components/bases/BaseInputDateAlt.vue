<template>
  <VLayout row class="c-input-date-alt">
    <VFlex xs5>
      <VTextField
        v-model.number="year"
        type="number"
        name="year"
        :label="label"
        :placeholder="parsedPlaceholder[0]"
        suffix="年"
        :error="error"
        :single-line="singleLine"
      />
    </VFlex>

    <VFlex xs3>
      <VTextField
        v-model.number="month"
        type="number"
        name="month"
        :placeholder="parsedPlaceholder[1]"
        min="1"
        max="12"
        suffix="月"
        single-line
        :error="error"
      />
    </VFlex>

    <VFlex xs3>
      <VTextField
        v-model.number="date"
        type="number"
        name="date"
        :placeholder="parsedPlaceholder[2]"
        min="1"
        :max="maxDate"
        suffix="日"
        single-line
        :error="error"
      />
    </VFlex>

    <div v-if="error" class="__errors">
      <VFlex xs12>
        <div class="v-text-field__details">
          <div class="v-messages theme--light error--text">
            <div class="v-messages__wrapper">
              <div class="v-messages__message">{{ firstErrorMessage }}</div>
            </div>
          </div>
        </div>
      </VFlex>
    </div>
  </VLayout>
</template>

<script lang="ts">
import { Nullable } from '@/models/Nullable'
import { NullableString } from '@/models/NullableString'
import { replaceArray } from '@/utilities/array'
import { isStringOfNotEmpty } from '@/utilities/isString'
import { clamp } from '@maboroshi/math-utils'
import dayjs from 'dayjs'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseInputDateAlt extends Vue {
  /**
   * 入力プロパティを定義する
   */
  @Prop({ required: true })
  value!: NullableString
  @Prop() label!: string
  @Prop() placeholder!: string
  @Prop() errorMessages!: string | string[]
  @Prop() singleLine!: boolean

  // 整形値
  get parsedValue() {
    const { value } = this
    const res = [null, null, null]

    if (isStringOfNotEmpty(value)) {
      const [y, m, d] = value.split('-').map(v => parseInt(v, 10))
      replaceArray(res, ...[y || res[0], m || res[1]], d || res[2])
    }

    return res
  }

  // 年
  get year() {
    return this.parsedValue[0]
  }
  set year(val: Nullable<number>) {
    const [, m, d] = this.parsedValue
    this.emitInput(val, m, d)
  }

  // 月
  get month() {
    return this.parsedValue[1]
  }
  set month(val: Nullable<number>) {
    const [y, , d] = this.parsedValue
    this.emitInput(
      y,
      val !== null && String(val) !== '' ? clamp(val, 1, 12) : val,
      d
    )
  }

  // 日
  get date() {
    return this.parsedValue[2]
  }
  set date(val: Nullable<number>) {
    const [y, m] = this.parsedValue
    this.emitInput(
      y,
      m,
      val !== null && String(val) !== '' ? clamp(val, 1, this.maxDate) : val
    )
  }

  // プレースホルダ
  get parsedPlaceholder() {
    return this.placeholder.split('-').map(v => String(parseInt(v, 10)))
  }

  // 日の最大値
  get maxDate() {
    const { year, month } = this

    if (year !== null && month !== null) {
      return dayjs()
        .set('date', 1)
        .set('month', month - 1)
        .set('year', year)
        .endOf('month')
        .date()
    }

    return 31
  }

  // エラーか否か
  get error() {
    const { errorMessages } = this
    return Array.isArray(errorMessages)
      ? errorMessages.length > 0
      : isStringOfNotEmpty(errorMessages)
  }

  // 最初のエラーメッセージ
  get firstErrorMessage() {
    const { errorMessages } = this
    return Array.isArray(errorMessages) ? errorMessages[0] : errorMessages
  }

  /**
   * input イベントを emit する
   * @param y
   * @param m
   * @param d
   */
  emitInput(
    y: Nullable<number> | string,
    m: Nullable<number> | string,
    d: Nullable<number> | string
  ) {
    let payload: NullableString = null

    if (y !== null && y !== '') {
      payload = `${y}`
      if (m !== null && m !== '') {
        payload = `${payload}-${String(m).padStart(2, '0')}`
        if (d !== null && d !== '') {
          payload = `${payload}-${String(d).padStart(2, '0')}`
        }
      }
    }

    this.$emit('input', payload)
  }
}
</script>

<style scoped lang="stylus">
.c-input-date-alt {
  position: relative

  .__errors {
    position: absolute
    bottom: 0
    left: 0
    right: 0
  }
}
</style>
