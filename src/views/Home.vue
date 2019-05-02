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
                    />
                  </VResponsive>
                </VFlex>
                <VFlex>
                  <VResponsive :aspect-ratio="1 / 1"> </VResponsive>
                </VFlex>
                <VFlex>
                  <VResponsive :aspect-ratio="1 / 1"> </VResponsive>
                </VFlex>
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
import { TKGS } from '@/configs/tkgs'
import CompositeReel from '@/components/composites/CompositeReel.vue'
import { Reel } from '@/models/Reel'
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
