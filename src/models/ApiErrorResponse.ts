export interface ApiError {
  code: number
  message: string | number
}

export interface ApiErrorResponse {
  errors: ApiError[]
}
