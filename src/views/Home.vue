<template>
  <VContent>
    <VContainer fluid grid-list-lg>
      <VLayout justify-center>
        <VFlex xs12 md8>
          <VCard class="p-contentCard">
            <VToolbar card dark color="primary" class="darken-3">
              <VToolbarTitle>
                <h2 class="p-pageTitle">
                  TKGスロット
                </h2>
              </VToolbarTitle>
            </VToolbar>

            <VDivider />

            <VCardActions>
              <VLayout row wrap justify-center align-content> </VLayout>
            </VCardActions>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </VContent>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { UiMutations } from '@/store/modules/ui/models'
import { Action, Getter, Mutation } from 'vuex-class'

@Component({
  components: {}
})
export default class Home extends Vue {
  // mutation を引き当てる
  @Mutation('ui/INCREMENT_GLOBAL_LOADING_QUEUE')
  incrementGlobalLoadingQueue!: UiMutations['INCREMENT_GLOBAL_LOADING_QUEUE']
  @Mutation('ui/DECREMENT_GLOBAL_LOADING_QUEUE')
  decrementGlobalLoadingQueue!: UiMutations['DECREMENT_GLOBAL_LOADING_QUEUE']

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
</style>
