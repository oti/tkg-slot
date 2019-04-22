import { RootState } from '@/store/models'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { module as ui } from '@/store/modules/ui'

export const storeOptions: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV === 'development',
  state: {},
  modules: {
    ui
  },
  plugins: []
}

/**
 * プラグインを引き当てる
 */
export function useVuex(ctx = Vue) {
  return ctx.use(Vuex)
}

/**
 * ストアを生成する
 * @param options
 * @param init
 * @param ctx
 */
export default function createStore(
  options = storeOptions,
  init = true,
  ctx = Vue
) {
  if (init) {
    useVuex(ctx)
  }

  return new Vuex.Store(options)
}
