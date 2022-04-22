export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function forHumans(seconds: any) {
  var levels = [
    [Math.floor(seconds / 31536000), 'years'],
    [Math.floor((seconds % 31536000) / 86400), 'days'],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
    // [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
    // [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
  ]
  var returntext = ''

  for (var i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue
    returntext +=
      ' ' +
      levels[i][0] +
      ' ' +
      (levels[i][0] === 1
        ? (levels[i][1] as string).substr(
            0,
            (levels[i][1] as string).length - 1
          )
        : levels[i][1])
  }
  return returntext.trim()
}
