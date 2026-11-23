import type { InternalResult } from '../types'

export type Comparator = (a: InternalResult, b: InternalResult) => number

// Max-heap by the sort comparator: keeps the worst result (the one that sorts
// last) at the root so we can evict it when a better result arrives. Ordering by
// the comparator instead of the raw score keeps the retained top-N identical to
// a full sort followed by a slice, including the tie-break and a custom sortFn.
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

  // Insert while keeping at most `limit` items: fill until full, then replace
  // the root only when the incoming item sorts ahead of it. The guard makes a
  // separate shouldInsert() check redundant.
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
