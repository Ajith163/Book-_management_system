import React, { useMemo, useEffect } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useApp } from '../context/AppContext'
import BookTable from '../components/BookTable'
import BookGrid from '../components/BookGrid'
import BookForm from '../components/BookForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { 
  DataLoadingSkeleton, 
  LoadingSpinner, 
  TableLoadingSkeleton, 
  GridLoadingSkeleton,
  ErrorSkeleton 
} from '../components/LoadingSkeleton'
import { paginate } from '../utils/paginate'
import { toast } from 'react-toastify'

const baseGenres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Romance', 'Fantasy', 'Mystery', 'Thriller', 'Biography', 'History']

const getUniqueGenres = (books) => {
  const genreSet = new Set()
  
  baseGenres.forEach(genre => genreSet.add(genre))
  
  books.forEach(book => {
    if (book.genre && book.genre.trim()) {
      const normalizedGenre = book.genre.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      genreSet.add(normalizedGenre)
    }
  })
  
  return ['All', ...Array.from(genreSet).sort()]
}

const getGenres = (books) => getUniqueGenres(books)
const statuses = ['All', 'Available', 'Issued']

export default function Dashboard(){
  const { 
    data: books = [], 
    isLoading, 
    error,
    create, 
    update, 
    remove,
    isCreating,
    isUpdating,
    isDeleting,
    isError,
    refetch
  } = useBooks()

  const { state, actions } = useApp()
  const { 
    view, 
    page, 
    searchTerm: q, 
    genreFilter: genre, 
    statusFilter: status, 
    editing, 
    confirmDialog: confirm 
  } = state

  const genres = getGenres(books)

  useEffect(() => {
    const handleOpenAddBook = () => {
      actions.openAddBookModal()
    }
    
    window.addEventListener('openAddBookModal', handleOpenAddBook)
    return () => window.removeEventListener('openAddBookModal', handleOpenAddBook)
  }, [actions])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return books.filter(b => {
      const matchQ = !term || (b.title?.toLowerCase().includes(term)) || (b.author?.toLowerCase().includes(term))
      const matchGenre = genre === 'All' || (b.genre === genre)
      const matchStatus = status === 'All' || (b.status === status)
      return matchQ && matchGenre && matchStatus
    })
  }, [books, q, genre, status])

  const { data: paginatedBooks, totalPages } = paginate(filtered, page, 10)

  const gridBooks = useMemo(() => {
    if (view === 'grid') {
      const { data: gridData } = paginate(filtered, page, 9)
      return gridData
    }
    return filtered
  }, [filtered, page, view])

  const handleSave = async (payload) => {
    try{
      if(payload._id){
        await update.mutateAsync({ id: payload._id, book: payload })
        toast.success(`✅ "${payload.title}" updated successfully!`)
      } else {
        await create.mutateAsync(payload)
        toast.success(`✅ "${payload.title}" added successfully!`)
      }
      actions.closeModal()
    }catch(err){
        console.error('Save error:', err)
        toast.error(`❌ Failed to save book: ${err.message || 'Unknown error'}`)
    }
  }

  const confirmDelete = (book) => actions.openDeleteConfirm(book)
  const doDelete = async () => {
    try{
      await remove.mutateAsync(confirm.book._id)
      actions.closeDeleteConfirm()
      toast.success(`✅ "${confirm.book.title}" deleted successfully!`)
    }catch(err){
      console.error('Delete error:', err)
      toast.error(`❌ Failed to delete "${confirm.book.title}": ${err.message || 'Unknown error'}`)
    }
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorSkeleton 
            message={error?.message || 'Failed to load books'} 
            onRetry={refetch}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={()=>actions.setView('table')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Table</span>
                  </span>
                </button>
                <button
                  onClick={()=>actions.setView('grid')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="hidden sm:inline">Grid</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select 
                value={genre} 
                onChange={e=>actions.setGenreFilter(e.target.value)} 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {genres.map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                value={status} 
                onChange={e=>actions.setStatusFilter(e.target.value)} 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Status' : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 lg:max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e)=>actions.setSearchTerm(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {q && (
                  <button
                    onClick={() => actions.setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {(genre !== 'All' || status !== 'All') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Active Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {genre !== 'All' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Genre: {genre}
                      <button
                        onClick={() => actions.setGenreFilter('All')}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                      >
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {status !== 'All' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Status: {status}
                      <button
                        onClick={() => actions.setStatusFilter('All')}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                      >
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={actions.clearFilters}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All Filters
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>


        {isLoading ? (
          view === 'table' ? <TableLoadingSkeleton /> : <GridLoadingSkeleton />
        ) : view==='table' ? (
          <BookTable
            books={paginatedBooks}
            loading={false}
            onEdit={actions.setEditing}
            onDelete={confirmDelete}
            searchTerm={q}
          />
        ) : (
            <BookGrid
              books={gridBooks}
              loading={false}
              onEdit={actions.setEditing}
              onDelete={confirmDelete}
              searchTerm={q}
              currentPage={page}
            />
        )}

            {!isLoading && (
              <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button
                      onClick={()=>actions.setPage(Math.max(1, page-1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
                      disabled={page<=1}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <span className="px-3 py-2 text-sm text-gray-700 font-medium">
                        Page {page} of {totalPages||1}
                      </span>
                    </div>

                    <button
                      onClick={()=>actions.setPage(Math.min(totalPages||1, page+1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
                      disabled={page>= (totalPages||1)}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="mt-3 sm:hidden">
                    <div className="flex justify-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                        if (pageNum > totalPages) return null

                        return (
                          <button
                            key={pageNum}
                            onClick={() => actions.setPage(pageNum)}
                            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
      </div>

      {editing !== null && (
        <BookForm
          initial={editing}
          onClose={actions.closeModal}
          onSave={handleSave}
          availableGenres={genres}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={actions.closeDeleteConfirm}
        onConfirm={doDelete}
        book={confirm.book}
      />

    </div>
  )
}
