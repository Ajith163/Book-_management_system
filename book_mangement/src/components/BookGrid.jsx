import { highlightSearchTerm } from '../utils/highlight.jsx'
import { LoadingSpinner } from './LoadingSkeleton'

const BookGrid = ({ books, loading, onEdit, onDelete, searchTerm = '', currentPage = 1 }) => {
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

  const getDynamicGridClasses = () => {
    return 'dynamic-grid'
  }

  if (loading) {
    return <LoadingSpinner text="Loading books..." />
  }

  if (books.length === 0) {
    return (
      <div className="dynamic-grid">
        <div className="col-span-full text-center py-8">
          <div className="text-gray-500 text-lg mb-2">📚 No books found</div>
          <div className="text-gray-400">Try adjusting your search or add a new book</div>
        </div>
      </div>
    )
  }

  return (
    <div className={getDynamicGridClasses()}>
      {books.map((book, index) => {
        const serialNumber = (currentPage - 1) * 9 + index + 1
        return (
        <div key={book._id || book.id} className="flip-card w-full h-64">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      #{serialNumber}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                      {formatStatus(book.status)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                    {highlightSearchTerm(book.title, searchTerm)}
                  </h3>
                </div>
                
                {/* Book Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm text-gray-700 truncate">
                      {highlightSearchTerm(book.author, searchTerm)}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p className="text-sm text-gray-700 truncate">
                      {book.genre}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      {book.publishedYear}
                    </p>
                  </div>
                  
                  {book.rating > 0 && (
                    <div className="flex items-center justify-center pt-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(book.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 font-medium">
                          {book.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100"></div>
              </div>
            </div>

            <div className="flip-card-back bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200">
              <div className="p-5 h-full flex flex-col justify-center items-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {highlightSearchTerm(book.title, searchTerm)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {highlightSearchTerm(book.author, searchTerm)}
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => onEdit(book)}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Book
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}

export default BookGrid
