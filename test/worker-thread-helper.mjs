import { parentPort, workerData } from 'node:worker_threads'
import Fuse from '../dist/fuse.mjs'

const { docs, options, query } = workerData
const fuse = new Fuse(docs, options)
const results = fuse.search(query)

parentPort.postMessage(results)
