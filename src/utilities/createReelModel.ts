import { Reel } from '@/models/Reel'

export function createReelModel(id: number, items: string[]): Reel {
  return {
    id: id,
    idx: 0,
    intervalId: 0,
    intervalTime: 10,
    count: 0,
    length: items.length,
    status: 'ready'
  }
}
