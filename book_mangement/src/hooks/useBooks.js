import { useQuery, useMutation, useQueryClient } from 'react-query'
import * as api from '../api/books-hybrid'

export function useBooks() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['books'],
    queryFn: api.fetchBooks,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  const create = useMutation({
    mutationFn: api.createBook,
    onMutate: async (newBook) => {
      await qc.cancelQueries(['books'])
      
      const previousBooks = qc.getQueryData(['books'])
      
      qc.setQueryData(['books'], (old) => {
        const tempBook = {
          ...newBook,
          _id: `temp-${Date.now()}`
        }
        return [...(old || []), tempBook]
      })
      
      return { previousBooks }
    },
    onError: (err, newBook, context) => {
      if (context?.previousBooks) {
        qc.setQueryData(['books'], context.previousBooks)
      }
      console.error('Create book error:', err)
    },
    onSuccess: () => {
      qc.invalidateQueries(['books'])
    },
    onSettled: () => {
      qc.invalidateQueries(['books'])
    }
  })

  const update = useMutation({
    mutationFn: ({ id, book }) => api.updateBook(id, book),
    onMutate: async ({ id, book }) => {
      await qc.cancelQueries(['books'])
      
      const previousBooks = qc.getQueryData(['books'])
      
      qc.setQueryData(['books'], (old) => {
        return old?.map(b => b._id === id ? { ...b, ...book } : b) || []
      })
      
      return { previousBooks }
    },
    onError: (err, { id }, context) => {
      if (context?.previousBooks) {
        qc.setQueryData(['books'], context.previousBooks)
      }
      console.error('Update book error:', err)
    },
    onSuccess: () => {
      qc.invalidateQueries(['books'])
    },
    onSettled: () => {
      qc.invalidateQueries(['books'])
    }
  })

  const remove = useMutation({
    mutationFn: api.deleteBook,
    onMutate: async (id) => {
      await qc.cancelQueries(['books'])
      
      const previousBooks = qc.getQueryData(['books'])
      
      qc.setQueryData(['books'], (old) => {
        return old?.filter(b => b._id !== id) || []
      })
      
      return { previousBooks }
    },
    onError: (err, id, context) => {
      if (context?.previousBooks) {
        qc.setQueryData(['books'], context.previousBooks)
      }
      console.error('Delete book error:', err)
    },
    onSuccess: () => {
      qc.invalidateQueries(['books'])
    },
    onSettled: () => {
      qc.invalidateQueries(['books'])
    }
  })

  return { 
    ...query, 
    create, 
    update, 
    remove,
    isCreating: create.isLoading,
    isUpdating: update.isLoading,
    isDeleting: remove.isLoading,
    isError: query.isError || create.isError || update.isError || remove.isError,
    error: query.error || create.error || update.error || remove.error,
  }
}
