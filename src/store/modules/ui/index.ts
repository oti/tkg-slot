import { RootState, StateCreator } from '@/store/models'
import { getters } from '@/store/modules/ui/getters'
import { UiState } from '@/store/modules/ui/models'
import { mutations } from '@/store/modules/ui/mutations'
import { Module } from 'vuex'

export const state: StateCreator<UiState> = () => ({
  globalLadingQueue: 0
})

export const module: Module<UiState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations
}
