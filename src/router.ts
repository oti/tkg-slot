import NotFound from '@/views/404NotFound.vue'
import TkgSlot from '@/views/TkgSlot.vue'
import Vue from 'vue'
import Router, { RouterOptions } from 'vue-router'

/**
 * ルート
 */
export const routes: RouterOptions['routes'] = [
  // ホーム
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'TKGスロット'
    },
    component: TkgSlot,
    props: route => ({ redirect: route.query.redirect })
  },

  // 404 Not Found - 全てのルートに適合しない場合の catch-all ルートなので一番最後に定義する必要がある
  {
    path: '*',
    name: '404',
    meta: {
      title: 'お探しのページは見つかりませんでした'
    },
    component: NotFound
  }
]

export const routerOptions: RouterOptions = {
  mode: 'history',
  base: process.env.BASE_URL,
  routes
}

/**
 * プラグインを引き当てる
 */
export function useRouter(ctx = Vue) {
  return ctx.use(Router)
}

/**
 * ルーターを生成する
 * @param options
 * @param ctx
 */
export default function createRouter(options = routerOptions, ctx = Vue) {
  useRouter(ctx)
  return new Router(options)
}
