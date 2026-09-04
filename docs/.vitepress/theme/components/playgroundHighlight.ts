interface PlaygroundMatch {
  key?: string
  indices?: [number, number][]
}

interface PlaygroundResult {
  item: unknown
  matches?: PlaygroundMatch[]
}

export function highlightMatch(
  result: PlaygroundResult,
  key: string,
  includeMatches: boolean
): string {
  const value = getNestedValue(result.item, key)

  if (!includeMatches || !result.matches) {
    return escapeHtml(value)
  }

  const match = result.matches.find((candidate) => candidate.key === key)

  if (!match?.indices?.length || !value) {
    return escapeHtml(value)
  }

  let highlighted = ''
  let lastIndex = 0
  const indices = [...match.indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of indices) {
    highlighted += escapeHtml(value.slice(lastIndex, start))
    highlighted += `<mark>${escapeHtml(value.slice(start, end + 1))}</mark>`
    lastIndex = end + 1
  }
  highlighted += escapeHtml(value.slice(lastIndex))

  return highlighted
}

function getNestedValue(obj: unknown, path: string): string {
  const value = path
    .split('.')
    .reduce<unknown>((current, part) => (current as any)?.[part], obj)

  return value == null ? '' : String(value)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
