// Assumes arrays are sorted
module.exports = (arr1, arr2) => {
  let result = []
  let i = 0
  let j = 0

  while (i < arr1.length && j < arr2.length) {
    let item1 = arr1[i]
    let item2 = arr2[j]

    if (item1 == item2) {
      result[result.length] = item1
      i += 1
      j += 1
    } else if (item1 < item2) {
      i += 1
    } else if (item1 > item2) {
      j += 1
    } else {
      i += 1
      j += 1
    }
  }

  return result;
}