import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingSpinner, ButtonLoadingSpinner } from './LoadingSkeleton'

const baseGenres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help', 'Business', 'Technology', 'Health', 'Travel', 'Cooking', 'Art']

const normalizeGenre = (genre) => {
  if (!genre || !genre.trim()) return ''
  
  return genre.trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const BookForm = ({ initial, onClose, onSave, availableGenres = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      publishedYear: new Date().getFullYear(),
      rating: 0,
      status: 'Available'
    }
  })

  const watchedRating = watch('rating')

  useEffect(() => {
    if (initial) {
      reset(initial)
    } else {
      reset({
        title: '',
        author: '',
        genre: '',
        publishedYear: new Date().getFullYear(),
        rating: 0,
        status: 'Available'
      })
    }
  }, [initial, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const normaldata = {
        ...data,
        genre: normalizeGenre(data.genre)
      }
      
      await onSave(normaldata)
    } catch (error) {
      console.error('Error saving book:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {initial?._id ? '✏️ Edit Book' : '➕ Add New Book'}
            </h2>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
              {initial?._id ? 'Update book information' : 'Fill in the details to add a new book'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 2, message: 'Title must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                {...register('author', { 
                  required: 'Author is required',
                  minLength: { value: 2, message: 'Author name must be at least 2 characters' },
                  maxLength: { value: 50, message: 'Author name must be less than 50 characters' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
              )}
            </div>

                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                    Genre *
                  </label>
                  <select
                    id="genre"
                    {...register('genre', { required: 'Genre is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a genre</option>
                    {availableGenres.length > 0 ? (
                      availableGenres.filter(g => g !== 'All').map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))
                    ) : (
                      baseGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))
                    )}
                  </select>
                  {errors.genre && (
                    <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
                  )}
                </div>


            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
                Published Year *
              </label>
              <input
                type="number"
                id="publishedYear"
                {...register('publishedYear', { 
                  required: 'Published year is required',
                  min: { value: 1000, message: 'Year must be at least 1000' },
                  max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                })}
                min="1000"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.publishedYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.publishedYear && (
                <p className="text-red-500 text-sm mt-1">{errors.publishedYear.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (0-5)
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        const newRating = watchedRating === star ? 0 : star
                        reset({ ...watch(), rating: newRating })
                      }}
                      className={`text-2xl transition-colors ${
                        star <= watchedRating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {watchedRating > 0 ? `${watchedRating}/5` : 'No rating'}
                </span>
              </div>
              <input
                type="hidden"
                {...register('rating', {
                  min: { value: 0, message: 'Rating must be at least 0' },
                  max: { value: 5, message: 'Rating must be at most 5' }
                })}
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(errors).map(([field, error]) => (
                          <li key={field}>
                            <span className="font-medium">{field}:</span> {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`flex-1 px-4 py-3 sm:py-2 rounded-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center font-medium text-sm sm:text-base ${
                      isValid && !isSubmitting
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <ButtonLoadingSpinner size="sm" />
                        <span className="hidden sm:inline ml-2">
                          {initial?._id ? 'Updating...' : 'Adding...'}
                        </span>
                        <span className="sm:hidden ml-2">
                          {initial?._id ? 'Updating...' : 'Adding...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={initial?._id ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                        </svg>
                        <span className="hidden sm:inline">
                          {initial?._id ? 'Update Book' : 'Add Book'}
                        </span>
                        <span className="sm:hidden">
                          {initial?._id ? 'Update' : 'Add'}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 sm:py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookForm
