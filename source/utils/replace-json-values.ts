export const replaceJsonValues = (
  body: string,
  searchFor: string,
  replaceWith: string
) => {
  let formattedSearch = new RegExp('"' + searchFor + '"', 'g')
  let formattedReplace = '"' + replaceWith + '"'
  let result = ''

  try {
    result = body.replace(formattedSearch, formattedReplace)
  } catch (error) {
    console.log(error)
  }
  return result
}
