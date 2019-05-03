<template>
  <div class="Reel">
    <button
      class="Reel__image"
      :style="{ 'background-image': 'url(' + path + ')' }"
      @click="reelClickHandler"
    />
    <p class="Reel__count mb-0">{{ model.count }}</p>
  </div>
</template>

<script lang="ts">
import { createReelModel } from '@/utilities/createReelModel'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class CompositeReel extends Vue {
  /**
   * Propsを定義する
   */
  @Prop({ required: true }) reelId!: number
  @Prop({ required: true }) imageList!: string[]

  /**
   * 内部ステートを定義する
   */
  model = createReelModel(this.reelId, this.imageList)

  // 0〜imageList.lengthの間のランダムな整数を返す
  random() {
    return Math.floor(Math.random() * this.model.length)
  }

  // 回した数をインクリメントする
  incrementCount() {
    this.model.count++
  }

  // リールを回す
  runReel() {
    this.model.status = 'running'
    this.model.intervalId = window.setInterval(() => {
      this.model.idx = this.random()
    }, this.model.intervalTime)
  }

  // リールを止める
  pauseReel() {
    this.model.status = 'pause'
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
    if (this.model.status === 'running') {
      this.pauseReel()
      this.incrementCount()
    } else {
      this.runReel()
    }
    this.$emit('changeReel', this.model)
  }
}
</script>

<style scoped lang="stylus">
.Reel__image
  padding-top 100%
  border 2px solid #000
  width 100%
  background-position center center
  background-color gold
  background-size cover

.Reel__count
  text-align center
</style>
