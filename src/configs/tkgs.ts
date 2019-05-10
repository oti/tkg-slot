export const TKGS = (() => {
  const arr = []
  for (let i = 1; i < 121; i++) {
    arr.push(`./images/tkgs/${String(i).padStart(3, '0')}.jpg`)
  }
  return arr
})()
