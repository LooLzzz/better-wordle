
const humanReadableSeconds = (seconds: number, precision: number = 1) => {
  const prefixes = [
    'second',
    'minute',
    'hour',
    'day',
  ]

  let remainingSeconds = seconds
  let index = 0

  while (remainingSeconds >= 60 && index < prefixes.length - 1) {
    remainingSeconds /= 60
    index++
  }

  const roundedSeconds = (
    remainingSeconds
      .toFixed(precision)
      .replace(/\.0+$/, '')
  )
  const unit = prefixes[index]
  const plural = roundedSeconds === '1' ? '' : 's'

  return `${roundedSeconds} ${unit}${plural}`
}

export {
  humanReadableSeconds
}
