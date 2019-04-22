import { getObjectClassName } from '@/utilities/getObjectClassName'

/**
 * 値が文字列であるか否かを返す
 * @param val
 */
export function isString(val: any): val is string {
  return getObjectClassName(val) === '[object String]'
}

/**
 * 値が空ではない文字列であるか否かを返す
 * @param val
 */
export function isStringOfNotEmpty(val: any): val is string {
  return isString(val) && val.length > 0
}
