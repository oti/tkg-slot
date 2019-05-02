export interface Reel {
  id: number
  idx: number
  intervalId: number
  intervalTime: number
  count: number
  length: number
  status: 'ready' | 'rolling' | 'stopped'
}
