import { ApiErrorResponse } from '@/models/ApiErrorResponse'
import { Nullable } from '@/models/Nullable'
import {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig
} from 'axios'

export interface HttpServiceResponse<T = ApiErrorResponse> {
  data?: T | string
  status: Nullable<number>
  statusText?: string
  headers?: any
  config: AxiosRequestConfig
  request?: any
  error?: AxiosError
}

/**
 * HTTPリクエストを取り扱うクラス
 */
export class HttpService {
  /**
   * リクエストエラーハンドラー
   * @param error
   */
  private static handleError<T>(error: AxiosError) {
    let res: HttpServiceResponse = {
      data: undefined,
      status: null,
      statusText: undefined,
      headers: undefined,
      config: error.config,
      request: undefined,
      error: error
    }

    if (error.response) {
      // Axios エラーだった場合はレスポンスを取りまとめる
      const { data, status, statusText, headers, request } = error.response

      res = {
        ...res,
        data: data.errors
          ? data
          : { errors: [{ code: status, message: statusText }] },
        status,
        statusText,
        headers,
        request
      }
    } else if (error.request) {
      // Http エラーだった場合はリクエスト結果を取りまとめる
      const { status, statusText } = error.request

      res = {
        ...res,
        data: { errors: [{ code: status, message: statusText }] },
        status,
        statusText
      }
    }

    return res
  }

  /**
   * リクエストハンドラー
   * @param promise
   */
  private static handleRequest<T>(promise: AxiosPromise<T>) {
    return promise
      .then(response => {
        return {
          ...response,
          error: undefined
        } as HttpServiceResponse<T>
      })
      .catch(HttpService.handleError)
  }

  constructor(private client: AxiosInstance) {}

  /**
   * GET でリクエストする
   * @param url
   * @param options
   */
  get<T>(url: string, options?: AxiosRequestConfig) {
    return HttpService.handleRequest<T>(this.client.get<T>(url, options))
  }

  /**
   * POST でリクエストする
   * @param url
   * @param data
   * @param config
   */
  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return HttpService.handleRequest<T>(this.client.post<T>(url, data, config))
  }

  /**
   * PUT でリクエストする
   * @param url
   * @param data
   * @param config
   */
  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return HttpService.handleRequest<T>(this.client.put<T>(url, data, config))
  }

  /**
   * DELETE でリクエストする
   * @param url
   * @param config
   */
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return HttpService.handleRequest<T>(this.client.delete(url, config))
  }
}
