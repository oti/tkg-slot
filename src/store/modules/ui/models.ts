import { VuexMutationPayloads, VuexMutations } from '@/store/models'
import {
  DECREMENT_GLOBAL_LOADING_QUEUE,
  INCREMENT_GLOBAL_LOADING_QUEUE
} from '@/store/modules/ui/mutation-types'

export interface UiState {
  globalLadingQueue: number
}

export interface UiViewModel extends UiState {
  hasGlobalLoadingQueue: UiGetters['hasGlobalLoadingQueue']
}

export interface UiGetters {
  hasGlobalLoadingQueue: boolean
  viewModel: UiViewModel
}

export type UiMutationPayloads = VuexMutationPayloads<{
  [INCREMENT_GLOBAL_LOADING_QUEUE]: number | undefined
  [DECREMENT_GLOBAL_LOADING_QUEUE]: number | undefined
}>

export type UiMutations = VuexMutations<UiMutationPayloads>
