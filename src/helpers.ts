export const replaceJsonValues = (obj, searchFor, replaceWith) => {
  let result = {}
  let regex = new RegExp(`\"${searchFor}\"`, 'g')

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      replaceJsonValues(obj[key], searchFor, replaceWith)
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(regex, replaceWith)
    }

    result[key] = obj[key]
  })

  return result
}
