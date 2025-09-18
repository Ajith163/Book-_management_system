import React, { createContext, useContext, useReducer, useCallback } from 'react'

const initialState = {
  view: 'table',
  page: 1,
  searchTerm: '',
  genreFilter: 'All',
  statusFilter: 'All',
  editing: null,
  confirmDialog: { open: false, book: null },
}

const ActionTypes = {
  SET_VIEW: 'SET_VIEW',
  SET_PAGE: 'SET_PAGE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_GENRE_FILTER: 'SET_GENRE_FILTER',
  SET_STATUS_FILTER: 'SET_STATUS_FILTER',
  SET_EDITING: 'SET_EDITING',
  SET_CONFIRM_DIALOG: 'SET_CONFIRM_DIALOG',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  RESET_PAGINATION: 'RESET_PAGINATION',
}

const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_VIEW:
      return { ...state, view: action.payload }
    
    case ActionTypes.SET_PAGE:
      return { ...state, page: action.payload }
    
    case ActionTypes.SET_SEARCH_TERM:
      return { 
        ...state, 
        searchTerm: action.payload,
        page: 1
      }
    
    case ActionTypes.SET_GENRE_FILTER:
      return { 
        ...state, 
        genreFilter: action.payload,
        page: 1
      }
    
    case ActionTypes.SET_STATUS_FILTER:
      return { 
        ...state, 
        statusFilter: action.payload,
        page: 1
      }
    
    case ActionTypes.SET_EDITING:
      return { ...state, editing: action.payload }
    
    case ActionTypes.SET_CONFIRM_DIALOG:
      return { ...state, confirmDialog: action.payload }
    
    case ActionTypes.CLEAR_FILTERS:
      return {
        ...state,
        searchTerm: '',
        genreFilter: 'All',
        statusFilter: 'All',
        page: 1
      }
    
    case ActionTypes.RESET_PAGINATION:
      return { ...state, page: 1 }
    
    default:
      return state
  }
}

const AppContext = createContext()
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions = {
    setView: useCallback((view) => {
      dispatch({ type: ActionTypes.SET_VIEW, payload: view })
    }, []),

    setPage: useCallback((page) => {
      dispatch({ type: ActionTypes.SET_PAGE, payload: page })
    }, []),

    setSearchTerm: useCallback((term) => {
      dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term })
    }, []),

    setGenreFilter: useCallback((genre) => {
      dispatch({ type: ActionTypes.SET_GENRE_FILTER, payload: genre })
    }, []),

    setStatusFilter: useCallback((status) => {
      dispatch({ type: ActionTypes.SET_STATUS_FILTER, payload: status })
    }, []),

    setEditing: useCallback((book) => {
      dispatch({ type: ActionTypes.SET_EDITING, payload: book })
    }, []),

    setConfirmDialog: useCallback((dialog) => {
      dispatch({ type: ActionTypes.SET_CONFIRM_DIALOG, payload: dialog })
    }, []),

    clearFilters: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_FILTERS })
    }, []),

    resetPagination: useCallback(() => {
      dispatch({ type: ActionTypes.RESET_PAGINATION })
    }, []),

    openAddBookModal: useCallback(() => {
      dispatch({ type: ActionTypes.SET_EDITING, payload: {} })
    }, []),

    closeModal: useCallback(() => {
      dispatch({ type: ActionTypes.SET_EDITING, payload: null })
    }, []),

    openDeleteConfirm: useCallback((book) => {
      dispatch({ 
        type: ActionTypes.SET_CONFIRM_DIALOG, 
        payload: { open: true, book } 
      })
    }, []),

    closeDeleteConfirm: useCallback(() => {
      dispatch({ 
        type: ActionTypes.SET_CONFIRM_DIALOG, 
        payload: { open: false, book: null } 
      })
    }, []),
  }

  const value = {
    state,
    actions,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { ActionTypes }

