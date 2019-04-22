import { ApiErrorResponse } from '@/models/ApiErrorResponse'
import { HttpServiceResponse } from '@/services/HttpService'
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

  // ログイン済であるか否か
  authorized = false

  /**
   * 認証完了時のコールバックを登録する
   * @param func
   */
  addAuthorizedHandler(func: (authorized?: boolean) => any) {
    const promise = new Promise<boolean>(resolve => {
      if (this.authorized) {
        resolve()
        return
      }

      const unwatch = this.$watch('authorized', (authorized: boolean) => {
        if (authorized) {
          unwatch()
          resolve(authorized)
        }
      })
    })

    return promise.then(func)
  }

  /**
   * 認証情報が必要なAPIにリクエストする
   * @param request
   */
  async restrictedRequest(request: Promise<any>) {
    const res = await request

    if (res.error) {
      const { data, status } = res as HttpServiceResponse

      if (
        status === 401 ||
        (status === 403 &&
          (data as ApiErrorResponse).errors.some(({ code }) => code === 30))
      ) {
        this.$router.replace({
          name: 'home',
          query: {
            redirect: this.$route.fullPath
          }
        })
      }
    }

    return res
  }
}
