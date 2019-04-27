<template>
  <VImg :src="path" @click="imgClickHandler" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class CompositeReel extends Vue {
  /**
   * Propsを定義する
   */
  @Prop({ required: true }) imageList!: string[]

  idx: number = 0
  cnt: number = 0

  /**
   * 算出プロパティを定義する
   */
  get path() {
    return this.imageList[this.idx]
  }

  /**
   * イベントハンドラを定義する
   */
  imgClickHandler() {}
}
</script>

<style scoped lang="stylus"></style>
