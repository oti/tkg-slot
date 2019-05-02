<template>
  <div class="Reel">
    <div
      class="Reel__image"
      :style="{ 'background-image': 'url(' + path + ')' }"
      @click="reelClickHandler"
    />
    <p class="Reel__count mb-0">{{ model.count }}</p>
  </div>
</template>

<script lang="ts">
import { Reel } from '@/models/Reel'
import { Component, Prop, Vue } from 'vue-property-decorator'

type ModelCreator = (imageList: string[]) => Reel

const defaultModel: ModelCreator = imageList => ({
  idx: 0,
  intervalId: 0,
  intervalTime: 10,
  count: 0,
  length: imageList.length,
  status: 'ready'
})

@Component({
  components: {}
})
export default class CompositeReel extends Vue {
  /**
   * Propsを定義する
   */
  @Prop({ required: true }) imageList!: string[]

  /**
   * 内部ステートを定義する
   */
  model = defaultModel(this.imageList)

  // 0〜imageList.lengthの間のランダムな整数を返す
  random() {
    return Math.floor(Math.random() * this.model.length)
  }

  // 回した回数に1足す
  incrementCount() {
    this.model.count++
  }

  // リールを回す
  startReel() {
    this.model.status = 'rolling'
    this.model.intervalId = window.setInterval(() => {
      this.model.idx = this.random()
    }, this.model.intervalTime)
  }

  stopReel() {
    this.model.status = 'stopped'
    if (this.model.intervalId) {
      clearInterval(this.model.intervalId)
    }
  }

  /**
   * 算出プロパティを定義する
   */

  // 画像パスを返す
  get path() {
    return this.imageList[this.model.idx]
  }

  /**
   * イベントハンドラを定義する
   */
  reelClickHandler() {
    if (this.model.status === 'rolling') {
      this.stopReel()
      this.incrementCount()
    } else {
      this.startReel()
    }
  }
}
</script>

<style scoped lang="stylus">
.Reel__image
  cursor pointer
  padding-top 100%
  border 2px solid #000
  width 100%
  background-position center center
  background-color gold
  background-size 100% auto

.Reel__count
  text-align center
</style>
