<template>
  <VContent>
    <VContainer fluid grid-list-lg>
      <VLayout justify-center>
        <VFlex xs12 md8>
          <VCard class="p-contentCard">
            <VToolbar card dark color="primary" class="darken-3">
              <VToolbarTitle>
                <h1 class="__title">
                  TKGスロット
                </h1>
              </VToolbarTitle>
            </VToolbar>

            <VCardText>
              <p>TKGを揃えて今日１日をハッピーに過ごそう！</p>

              <h2 class="subhead">遊び方</h2>
              <ul>
                <li>「START」をクリックでTKG写真のシャッフルスタート！</li>
                <li>シャッフルしたらもう一度クリックしてストップ！</li>
                <li>写真がそろったらラッキー！ツイートして自慢しよう！</li>
                <li>
                  写真がそろわない悲しみもツイートしてTLのみんなの射幸心を煽ろう！
                </li>
              </ul>
            </VCardText>

            <VDivider />

            <VCardText>
              <VLayout>
                <VFlex>
                  <VResponsive :aspect-ratio="1 / 1">
                    <CompositeReel
                      :reel-id="0"
                      :image-list="imageList"
                      @changeReel="changeReelHandler"
                    />
                  </VResponsive>
                </VFlex>
                <VFlex>
                  <VResponsive :aspect-ratio="1 / 1">
                    <CompositeReel
                      :reel-id="1"
                      :image-list="imageList"
                      @changeReel="changeReelHandler"
                    />
                  </VResponsive>
                </VFlex>
                <VFlex>
                  <VResponsive :aspect-ratio="1 / 1">
                    <CompositeReel
                      :reel-id="2"
                      :image-list="imageList"
                      @changeReel="changeReelHandler"
                    />
                  </VResponsive>
                </VFlex>
              </VLayout>
              <VLayout justify-center>
                <p class="subheading font-weight-bold mb-0">{{ message }}</p>
              </VLayout>
            </VCardText>

            <VDivider />

            <VCardText>
              <VCardActions>
                <VLayout row wrap justify-center align-content>
                  <VBtn large color="primary">悲しみのツイートをする</VBtn>
                </VLayout>
              </VCardActions>
            </VCardText>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </VContent>
</template>

<script lang="ts">
import { sum } from '@maboroshi/math-utils'
import { TKGS } from '@/configs/tkgs'
import { READY, RUNNING, WIN, LOSE } from '@/configs/messages'
import CompositeReel from '@/components/composites/CompositeReel.vue'
import { Reel } from '@/models/Reel'
import { SlotStatus } from '@/models/SlotStatus'
import { UiMutations } from '@/store/modules/ui/models'
import { createReelModel } from '@/utilities/createReelModel'
import { Action, Getter, Mutation } from 'vuex-class'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    CompositeReel
  }
})
export default class Home extends Vue {
  // mutation を引き当てる
  @Mutation('ui/INCREMENT_GLOBAL_LOADING_QUEUE')
  incrementGlobalLoadingQueue!: UiMutations['INCREMENT_GLOBAL_LOADING_QUEUE']
  @Mutation('ui/DECREMENT_GLOBAL_LOADING_QUEUE')
  decrementGlobalLoadingQueue!: UiMutations['DECREMENT_GLOBAL_LOADING_QUEUE']

  /**
   * 内部ステートを定義する
   */
  imageList = TKGS
  reel: Reel[] = [
    createReelModel(0, this.imageList),
    createReelModel(1, this.imageList),
    createReelModel(2, this.imageList)
  ]
  total: number = 0
  status: SlotStatus = 'ready'

  changeReelHandler(model: Reel) {
    // リールのモデルを更新する
    this.reel[model.id] = model

    this.updateTotal()
    this.updateStatus()
    this.judgement()
  }

  // スロットの情報を更新する
  updateTotal() {
    this.total = sum(...this.reel.map(reel => reel.count))
  }

  // スロットのステータスを更新する
  updateStatus() {
    const status = this.reel.map(reel => reel.status)
    this.status = (() => {
      if (status.every((val: string) => val === 'ready')) {
        // 初期表示時
        return 'ready'
      } else if (status.every((val: string) => val === 'pause')) {
        // 全てを一回以上回してから止めると`pause`になり、判定を始められる
        return 'pause'
      } else {
        // それ以外は`running`か`ready`が含まれている
        return 'running'
      }
    })()
  }

  // スロットが揃ったか判定する
  judgement() {
    if (this.status === 'pause') {
      const idx = this.reel.map(reel => reel.idx)
      idx.every((val: number) => val === idx[0]) ? this.win() : this.lose()
    }
  }

  win() {
    this.status = 'repdigit'
  }

  lose() {
  }

  get message() {
    if (this.status === 'ready') {
      return READY
    } else if (this.status === 'pause') {
      return LOSE[Math.floor(Math.random() * LOSE.length)]
    } else if (this.status === 'repdigit') {
      return WIN[Math.floor(Math.random() * WIN.length)]
    } else {
      return RUNNING
    }
  }

  /**
   * @lifecycles
   */
  created() {}

  /**
   * @lifecycles
   */
  mounted() {
    this.decrementGlobalLoadingQueue(Infinity)
  }
}
</script>
<style lang="stylus" scoped>
.p-contentCard
  margin-top -88px

  .__title
    font-size 34px
</style>
