interface IData {
  [index: string]: {}
}

const replaceValues = (
  source: IData,
  searchFor: string,
  replaceWith: string
) => {
  let result: IData = {}
  let regex = new RegExp(searchFor, 'g')

  Object.keys(source).forEach((key) => {
    if (typeof source[key] === 'object') {
      replaceValues(source[key], searchFor, replaceWith)
    } else if (typeof source[key] === 'string') {
      if (source[key].toString().length == searchFor.length) {
        source[key] = source[key].toString().replace(regex, replaceWith)
      }
    }

    if (source[key].toString().length == searchFor.length) {
      source[key] = source[key].toString().replace(regex, replaceWith)
    }

    result[key] = source[key]
  })

  return result
}

export default replaceValues
export { IData }
