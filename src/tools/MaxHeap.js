// Max-heap by score: keeps the worst (highest) score at the top
// so we can efficiently evict it when a better result arrives.
export default class MaxHeap {
  constructor(limit) {
    this.limit = limit
    this.heap = []
  }
  get size() {
    return this.heap.length
  }
  shouldInsert(score) {
    return this.size < this.limit || score < this.heap[0].score
  }
  insert(item) {
    if (this.size < this.limit) {
      this.heap.push(item)
      this._bubbleUp(this.size - 1)
    } else if (item.score < this.heap[0].score) {
      this.heap[0] = item
      this._sinkDown(0)
    }
  }
  extractSorted(sortFn) {
    return this.heap.sort(sortFn)
  }
  _bubbleUp(i) {
    const heap = this.heap
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (heap[i].score <= heap[parent].score) break
      const tmp = heap[i]
      heap[i] = heap[parent]
      heap[parent] = tmp
      i = parent
    }
  }
  _sinkDown(i) {
    const heap = this.heap
    const len = heap.length
    while (true) {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2
      if (left < len && heap[left].score > heap[largest].score) {
        largest = left
      }
      if (right < len && heap[right].score > heap[largest].score) {
        largest = right
      }
      if (largest === i) break
      const tmp = heap[i]
      heap[i] = heap[largest]
      heap[largest] = tmp
      i = largest
    }
  }
}
