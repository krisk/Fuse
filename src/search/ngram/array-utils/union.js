// Assumes arrays are sorted
export default function (arr1, arr2) {
  let result = []
  let i = 0
  let j = 0

  while (i < arr1.length && j < arr2.length) {
    let item1 = arr1[i]
    let item2 = arr2[j]

    if (item1 < item2) {
      result.push(item1)
      i += 1
    } else if (item2 < item1) {
      result.push(item2)
      j += 1
    } else {
      result.push(item2)
      i += 1
      j += 1
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i])
    i += 1
  }

  while (j < arr2.length) {
    result.push(arr2[j])
    j += 1
  }

  return result
}
