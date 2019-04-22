import { isValidMailAddress } from '@/utilities/isValidMailAddress'
import { isHiragana } from '@/utilities/isHiragana'

export const fistEMail = {
  getMessage: (field: string) => `${field}が正しくありません`,
  validate: (val: any) => isValidMailAddress(val)
}

export const hiragana = {
  getMessage: (field: string) => `${field}が正しくありません`,
  validate: (val: any) => isHiragana(val)
}
