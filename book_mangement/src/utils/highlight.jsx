export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      )
    }
    return part
  })
}

