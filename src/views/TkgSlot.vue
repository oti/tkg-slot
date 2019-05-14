<template>
  <VContent>
    <VContainer fluid grid-list-lg>
      <VLayout justify-center>
        <VFlex xs12 md8>
          <VCard class="ContentCard">
            <VToolbar card dark color="accent" class="darken-1">
              <VToolbarTitle>
                <h1 class="__title">
                  TKGスロット
                </h1>
              </VToolbarTitle>
            </VToolbar>

            <VCardText>
              <p>TKGを揃えて今日１日をハッピーに過ごそう！</p>

              <h2 class="mb-2">遊び方</h2>
              <ul>
                <li>
                  「シャッフル」を押してTKG写真をシャッフルスタート！
                </li>
                <li>
                  「ストップ」を押してシャッフルをストップ！
                </li>
                <li>
                  TKGをクリックすると一枚ずつシャッフルしたりストップしたりもできるよ！
                </li>
                <li>
                  TKGがそろったら今日はラッキー！ ツイートして自慢しよう！
                </li>
                <li>
                  TKGがそろわない悲しみもツイートしてTLのみんなの射幸心を煽ろう！
                </li>
                <li>
                  シャッフルカウントは写真ごとに数えているので「3回」が最短だよ！
                </li>
              </ul>
            </VCardText>

            <VDivider />

            <VCardText>
              <VLayout row wrap justify-center>
                <VFlex shrink>
                  <VBtn
                    depressed
                    color="accent"
                    class="darken-1"
                    @click="shuffleButtonClickHandler"
                    >シャッフル</VBtn
                  >
                  <VBtn
                    outline
                    color="accent"
                    class="darken-4"
                    @click="stopButtonClickHandler"
                    >ストップ</VBtn
                  >
                </VFlex>
              </VLayout>

              <VLayout>
                <VFlex class="SlotCol px-1">
                  <CompositeReel
                    ref="reel_1"
                    :reel-id="0"
                    :image-list="imageList"
                    @changeReel="changeReelHandler"
                  />
                </VFlex>
                <VFlex class="SlotCol px-1">
                  <CompositeReel
                    ref="reel_2"
                    :reel-id="1"
                    :image-list="imageList"
                    @changeReel="changeReelHandler"
                  />
                </VFlex>
                <VFlex class="SlotCol px-1">
                  <CompositeReel
                    ref="reel_3"
                    :reel-id="2"
                    :image-list="imageList"
                    @changeReel="changeReelHandler"
                  />
                </VFlex>
              </VLayout>
              <p
                :class="[
                  'Message',
                  'font-weight-bold',
                  'text-xs-center',
                  {
                    subheading: status === 'ready',
                    'display-1': status === 'pause',
                    'display-1 -repdigit': status === 'repdigit'
                  }
                ]"
              >
                {{ pageMessage }}
              </p>
              <VTextarea
                :value="tweetFullText"
                box
                readonly
                rows="4"
                label="テキストエリアからコピペする"
              />

              <VLayout row wrap justify-center class="pb-3">
                <VBtn
                  depressed
                  color="accent"
                  class="darken-1"
                  @click="tweetButtonClickHandler"
                >
                  {{ tweetButtonText }}
                </VBtn>
              </VLayout>
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
import { NullableString } from '@/models/NullableString'
import { Reel } from '@/models/Reel'
import { SlotStatus } from '@/models/SlotStatus'
import { UiMutations } from '@/store/modules/ui/models'
import { createReelModel } from '@/utilities/createReelModel'
import { imageLoader } from '@/utilities/imageLoader'
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
  imageList: string[] = TKGS
  reelModel: Reel[] = [
    createReelModel(0, this.imageList),
    createReelModel(1, this.imageList),
    createReelModel(2, this.imageList)
  ]
  reelRefs: string[] = ['reel_1', 'reel_2', 'reel_3']
  total: number = 0
  status: SlotStatus = 'ready'
  hashtag: string = 'tkgslot'
  url: string = window.location.origin + window.location.pathname

  async preload() {
    return Promise.all(TKGS.map(src => imageLoader(src)))
  }

  changeReelHandler(model: Reel) {
    // リールのモデルを更新する
    this.reelModel[model.id] = model

    this.updateTotal()
    this.updateStatus()
    this.judgement()
  }

  // スロットの情報を更新する
  updateTotal() {
    this.total = sum(...this.reelModel.map(reel => reel.count))
  }

  // スロットのステータスを更新する
  updateStatus() {
    const status = this.reelModel.map(reel => reel.status)
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
      const idx = this.reelModel.map(reel => reel.idx)
      idx.every((val: number) => val === idx[0]) ? this.win() : this.lose()
    }
  }

  win() {
    this.status = 'repdigit'
  }

  lose() {}

  shuffleButtonClickHandler() {
    this.reelRefs.forEach((reel, i) => {
      if (this.reelModel[i].status !== 'running') {
        const child = (this.$refs as any)[reel]
        child.runReel()
        child.emitModelToParent()
      }
    })
  }

  stopButtonClickHandler() {
    this.reelRefs.forEach((reel, i) => {
      if (this.reelModel[i].status === 'running') {
        const child = (this.$refs as any)[reel]
        child.pauseReel()
        child.incrementCount()
        child.emitModelToParent()
      }
    })
  }

  tweetButtonClickHandler() {
    window.open(
      this.tweetLink,
      'share_twitter_window',
      'width=450, height=258, menubar=no, toolbar=no, scrollbars=yes'
    )
  }

  get pageMessage() {
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

  get repdigitImagePath() {
    return `${this.url}${TKGS[this.reelModel[0].idx].replace('./', '')}`
  }

  get tweetLink() {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      this.tweetMessage
    )}&amp;url=${encodeURIComponent(this.url)}&amp;hashtags=${this.hashtag}`
  }

  get tweetFullText() {
    return `${this.tweetMessage} ${this.url} #${this.hashtag}`
  }

  get tweetMessage() {
    if (this.status === 'pause') {
      return `TKGスロットを${
        this.total
      }回トライしたけどそろえられませんでした……。`
    } else if (this.status === 'repdigit') {
      return `TKGスロットをそろえました！そろえるまでに${
        this.total
      }回トライしました！ ${this.repdigitImagePath}`
    } else {
      return 'TKGスロットで今日の運試し！'
    }
  }

  get tweetButtonText() {
    if (this.status === 'pause') {
      return 'そろわない悲しみをツイートする……'
    } else if (this.status === 'repdigit') {
      return 'そろった喜びをツイートする！'
    } else {
      return 'ツイッターでシェアする'
    }
  }

  /**
   * @lifecycles
   */
  created() {
    this.incrementGlobalLoadingQueue(1)
  }

  /**
   * @lifecycles
   */
  mounted() {
    this.preload()
      .then(() => {
        this.decrementGlobalLoadingQueue(Infinity)
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style lang="stylus" scoped>
.ContentCard
  margin-top -72px
  @media screen and (min-width: 795px)
    margin-top -64px
  @media screen and (min-width: 960px)
    margin-top -88px

.SlotCol
  flex 0 0 auto
  width calc(100% / 3)
  min-width calc(100% / 3)

.Message
  &.-repdigit
    color #E65100
</style>
