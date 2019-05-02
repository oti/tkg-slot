import { ReelStatus } from '@/models/ReelStatus'

export interface Reel {
  id: number
  idx: number
  intervalId: number
  intervalTime: number
  count: number
  length: number
  status: ReelStatus
}
