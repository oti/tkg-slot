export interface Reel {
  idx: number
  intervalId: number
  intervalTime: number
  count: number
  length: number
  status: 'ready' | 'rolling' | 'stopped'
}
