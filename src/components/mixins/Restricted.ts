import { UiMutations } from '@/store/modules/ui/models'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component
export class MixinRestricted extends Vue {
  // mutation を引き当てる
  @Mutation('ui/INCREMENT_GLOBAL_LOADING_QUEUE')
  incrementGlobalLoadingQueue!: UiMutations['INCREMENT_GLOBAL_LOADING_QUEUE']
  @Mutation('ui/DECREMENT_GLOBAL_LOADING_QUEUE')
  decrementGlobalLoadingQueue!: UiMutations['DECREMENT_GLOBAL_LOADING_QUEUE']
}
