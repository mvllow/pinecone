const parseObject = (obj, searchFor, replaceWith) => {
  let result = {}
  let regex = new RegExp(searchFor, 'g')

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      parseObject(obj[key], searchFor, replaceWith)
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(regex, replaceWith)
    }

    result[key] = obj[key]
  })

  return result
}

export { parseObject }
