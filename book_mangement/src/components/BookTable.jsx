import { useState } from 'react'
import { highlightSearchTerm } from '../utils/highlight.jsx'
import { LoadingSpinner } from './LoadingSkeleton'

const BookTable = ({ books, loading, onEdit, onDelete, searchTerm = '' }) => {
  const [sortField, setSortField] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortBooks = (books, field, order) => {
    return [...books].sort((a, b) => {
      let aValue = a[field]
      let bValue = b[field]

      if (field === 'publishedYear' || field === 'rating') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else {
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (order === 'asc') {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
        return 0
      } else {
        if (aValue > bValue) return -1
        if (aValue < bValue) return 1
        return 0
      }
    })
  }

  const sortedBooks = sortBooks(books, sortField, sortOrder)

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return sortOrder === 'asc' ? (
      <svg className="w-3 h-3 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Issued':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status) => {
    return status
  }

  if (loading) {
    return <LoadingSpinner text="Loading books..." />
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="text-gray-500 text-lg mb-2">📚 No books found</div>
          <div className="text-gray-400">Try adjusting your search or add a new book</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('author')}
              >
                <div className="flex items-center">
                  Author
                  {getSortIcon('author')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('genre')}
              >
                <div className="flex items-center">
                  Genre
                  {getSortIcon('genre')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('publishedYear')}
              >
                <div className="flex items-center">
                  Year
                  {getSortIcon('publishedYear')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center">
                  Rating
                  {getSortIcon('rating')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBooks.map((book) => (
              <tr key={book._id || book.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {highlightSearchTerm(book.title, searchTerm)}
                  </div>
                  <div className="text-xs text-gray-500 sm:hidden">
                    by {highlightSearchTerm(book.author, searchTerm)} • {book.genre} • {book.publishedYear}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">{highlightSearchTerm(book.author, searchTerm)}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{book.genre}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-900">{book.publishedYear}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      {book.rating > 0 ? `${book.rating}/5` : 'Not rated'}
                    </span>
                    {book.rating > 0 && (
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                    {formatStatus(book.status)}
                  </span>
                </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => onEdit(book)}
                          className="text-blue-600 hover:text-blue-900 transition-colors text-left flex items-center py-1 px-2 rounded hover:bg-blue-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="hidden sm:inline">Edit</span>
                          <span className="sm:hidden">✏️</span>
                        </button>
                        <button
                          onClick={() => onDelete(book)}
                          className="text-red-600 hover:text-red-900 transition-colors text-left flex items-center py-1 px-2 rounded hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">🗑️</span>
                        </button>
                      </div>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookTable
