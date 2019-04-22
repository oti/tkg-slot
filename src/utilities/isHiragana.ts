import { isStringOfNotEmpty } from '@/utilities/isString'

/**
 * 値がひらがなか否かを返す
 * @param val
 */
export function isHiragana(val: any): val is string {
  return isStringOfNotEmpty(val) && /^[ぁ-ゞー]+$/.test(val)
}
