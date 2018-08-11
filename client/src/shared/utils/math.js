export function sum(array, ...rest) {
  if (Array.isArray(array)) {
    if (array.length === 0) { return 0 }
    return array.reduce((acc, num) => acc + num);
  } else {
    throw new Error("Input must be an array")
  }
}

export function avg(array) {
  if (Array.isArray(array)) {
    return sum(array) / array.length
  } else if (array.length === 0) {
    throw new Error("Array cannot be empty")
  } else {
    throw new Error("Input must be an array")
  }
}

export function median(array) {
  array = array.sort((a, b) => a - b)

  if (array.length % 2 === 0) {
    let midpoint = (array.length - 1) / 2
    let midpoint1 = Math.floor(midpoint)
    let midpoint2 = Math.ceil(midpoint)
    return (array[midpoint1] + array[midpoint2]) / 2
  } else {
    let midpoint = Math.floor(array.length / 2)
    return array[midpoint]
  }
}

export function standardDeviation(array, sample=false) {
  let meanSquares = array.map(num => (num - avg(array)) ** 2);

  return Math.sqrt(sum(meanSquares) / (sample ? array.length : array.length - 1))
}

export function toDegrees(rad) {
  return rad * 360 / (Math.PI * 2);
}
