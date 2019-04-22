import { isStringOfNotEmpty } from '@/utilities/isString'

/**
 * 有効なメールアドレスか否かを返す
 * @param val
 */
export function isValidMailAddress(val: any): val is string {
  return isStringOfNotEmpty(val) && /^[\w./?\-+]+@[\w.-]+$/.test(val)
}
