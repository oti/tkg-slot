<template>
  <VApp>
    <VSheet class="p-headerSheet" color="primary" />

    <RouterView role="main" @change:status="handleChangeStatus" />

    <VFooter role="contentinfo" dark height="auto">
      <p class="mx-a mb-0"></p>
    </VFooter>

    <BaseGlobalLoading v-if="ui.hasGlobalLoadingQueue" />
  </VApp>
</template>

<script lang="ts">
import { UiGetters } from '@/store/modules/ui/models'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component({
  components: {}
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
