/**
 * 画像をプリロードする
 * @param src
 * @param useCrossOrigin
 */
export function imageLoader(src: string, useCrossOrigin?: boolean) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);

    if (useCrossOrigin) img.crossOrigin = "anonymous";
    img.src = src;
  });
}
