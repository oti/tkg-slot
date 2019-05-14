<template>
  <VApp>
    <VSheet class="p-headerSheet" color="primary" />

    <RouterView role="main" class="mb-4" />

    <VFooter role="contentinfo" absolute dark height="auto" class="px-3">
      <p class="mb-0">
        このウェブアプリは<a
          href="https://twitter.com/otiext"
          target="_blank"
          rel="noopener"
          >越智</a
        >が作りました。
      </p>
      <VSpacer />
      <p class="mb-0">
        <a
          href="https://github.com/oti/tkg-slot/"
          target="_blank"
          rel="noopener"
          >GitHub</a
        >, CC0 license.
      </p>
    </VFooter>

    <BaseGlobalLoading v-if="ui.hasGlobalLoadingQueue" />
  </VApp>
</template>

<script lang="ts">
import BaseGlobalLoading from '@/components/bases/BaseGlobalLoading.vue'
import { UiGetters } from '@/store/modules/ui/models'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component({
  components: {
    BaseGlobalLoading
  }
})
export default class App extends Vue {
  // viewModel を引き当てる
  @Getter('ui/viewModel') ui!: UiGetters['viewModel']

  /**
   * ドキュメントタイトルを更新する
   * @param title
   */
  static updatePageTitle(title?: string) {}

  /**
   * @lifecycles
   */
  created() {
    // ルーターのグローバルガードを設定する
    this.$router.onReady(() => App.updatePageTitle(this.$route.meta.title))
    this.$router.afterEach(to => App.updatePageTitle(to.meta.title))
  }
}
</script>
<style lang="stylus" scoped>
.p-headerSheet
  height 72px
  @media screen and (min-width: 960px)
    height 96px
</style>
