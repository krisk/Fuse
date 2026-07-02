import type { InternalResult } from '../types'

type Comparator = (a: InternalResult, b: InternalResult) => number

// Max-heap by the sort comparator: keeps the worst result (the one that sorts
// last) at the top so we can evict it when a better result arrives. Ordering by
// the comparator instead of the raw score keeps the retained top-N identical to
// a full sort followed by a slice, including the tie-break and a custom sortFn.
export default class MaxHeap {
  limit: number
  heap: InternalResult[]
  cmp: Comparator

  constructor(limit: number, cmp: Comparator) {
    this.limit = limit
    this.heap = []
    this.cmp = cmp
  }
  get size(): number {
    return this.heap.length
  }
  shouldInsert(item: InternalResult): boolean {
    return this.size < this.limit || this.cmp(item, this.heap[0]) < 0
  }
  insert(item: InternalResult): void {
    if (this.size < this.limit) {
      this.heap.push(item)
      this._bubbleUp(this.size - 1)
    } else if (this.cmp(item, this.heap[0]) < 0) {
      this.heap[0] = item
      this._sinkDown(0)
    }
  }
  extractSorted(
    sortFn: (a: InternalResult, b: InternalResult) => number
  ): InternalResult[] {
    return this.heap.sort(sortFn)
  }
  _bubbleUp(i: number): void {
    const heap = this.heap
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.cmp(heap[i], heap[parent]) <= 0) break
      const tmp = heap[i]
      heap[i] = heap[parent]
      heap[parent] = tmp
      i = parent
    }
  }
  _sinkDown(i: number): void {
    const heap = this.heap
    const len = heap.length
    let largest = i
    do {
      i = largest
      const left = 2 * i + 1
      const right = 2 * i + 2
      if (left < len && this.cmp(heap[left], heap[largest]) > 0) {
        largest = left
      }
      if (right < len && this.cmp(heap[right], heap[largest]) > 0) {
        largest = right
      }
      if (largest !== i) {
        const tmp = heap[i]
        heap[i] = heap[largest]
        heap[largest] = tmp
      }
    } while (largest !== i)
  }
}
