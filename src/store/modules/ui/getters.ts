import { RootState } from '@/store/models'
import { UiGetters, UiState } from '@/store/modules/ui/models'
import { GetterTree } from 'vuex'

export const getters: GetterTree<UiState, RootState> = {
  /**
   * グローバルのローディングキューがあるか否かを返す
   * @param globalLadingQueue
   */
  hasGlobalLoadingQueue: ({ globalLadingQueue }) => globalLadingQueue > 0,

  /**
   * @param globalLadingQueue
   * @param hasGlobalLoadingQueue
   */
  viewModel: ({ globalLadingQueue }, { hasGlobalLoadingQueue }: UiGetters) => ({
    globalLadingQueue,
    hasGlobalLoadingQueue
  })
}
