import type { InternalResult } from '../types'

export type Comparator = (a: InternalResult, b: InternalResult) => number

// Fixed-capacity max-heap used for top-N selection. The root holds the
// worst-ranked retained item according to `comparator` (largest in sort order),
// so a candidate only enters a full heap if `comparator(item, root) < 0`.
export default class MaxHeap {
  limit: number
  heap: InternalResult[]
  comparator: Comparator

  constructor(limit: number, comparator: Comparator) {
    this.limit = limit
    this.heap = []
    this.comparator = comparator
  }

  get size(): number {
    return this.heap.length
  }

  insert(item: InternalResult): void {
    const len = this.heap.length
    if (len < this.limit) {
      this.heap.push(item)
      this._bubbleUp(len)
    } else if (this.comparator(item, this.heap[0]) < 0) {
      this.heap[0] = item
      this._sinkDown(0)
    }
  }

  extractSorted(): InternalResult[] {
    return this.heap.sort(this.comparator)
  }

  _bubbleUp(i: number): void {
    const { heap, comparator } = this
    const item = heap[i]
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (comparator(item, heap[parent]) <= 0) break
      heap[i] = heap[parent]
      i = parent
    }
    heap[i] = item
  }

  _sinkDown(i: number): void {
    const { heap, comparator } = this
    const len = heap.length
    const item = heap[i]
    for (;;) {
      const left = 2 * i + 1
      if (left >= len) break
      let next = comparator(heap[left], item) > 0 ? left : -1
      if (
        left + 1 < len &&
        comparator(heap[left + 1], next < 0 ? item : heap[left]) > 0
      ) {
        next = left + 1
      }
      if (next < 0) break
      heap[i] = heap[next]
      i = next
    }
    heap[i] = item
  }
}
