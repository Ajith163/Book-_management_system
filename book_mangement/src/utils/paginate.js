export function paginate(items = [], page = 1, perPage = 10) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const validPage = Math.min(Math.max(1, page), totalPages)
  const start = (validPage - 1) * perPage
  const end = start + perPage
  return { page: validPage, perPage, total, totalPages, data: items.slice(start, end) }
}

