/**
 * 配列を中身を全て置き換える
 * @param array
 * @param items
 */
export function replaceArray<T = any>(array: T[], ...items: T[]) {
  return array.splice(0, array.length, ...items)
}

/**
 * 配列の中身を全て消去する
 * @param array
 */
export function clearArray<T = any>(array: T[]) {
  return replaceArray(array)
}
