export const removeWordFromString = (body: string, wordToRemove: string) => {
  let result = body
  let sandwichedItalic = new RegExp(`\\s${wordToRemove}\\s`, 'g') // eg. " italic "
  let endItalic = new RegExp(`\\s?${wordToRemove}\\s?`, 'g') // eg. " italic", "italic ", "italic"

  result = result.replace(sandwichedItalic, ' ')
  result = result.replace(endItalic, '')

  return result
}
