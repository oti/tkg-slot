export const ua = navigator.userAgent.toLowerCase()

export const isAndroid = /android/.test(ua)

export const isIOS = /iphone|ipad/.test(ua)

export const isIe = /msie|trident/.test(ua)

export const isMobile =
  ua.indexOf('mobi') !== -1 ||
  /iphone|ipad/.test(ua) ||
  (/windows/.test(ua) && /phone/.test(ua) && /wpdesktop/.test(ua)) ||
  /iemobile/.test(ua)

export const hasTouch = typeof document.ontouchstart !== 'undefined'
