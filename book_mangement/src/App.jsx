import React from 'react'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
              📚 Book Management system
            </div>
            <div className="flex items-center gap-4">
             
              <button
                onClick={() => {
                  const event = new CustomEvent('openAddBookModal');
                  window.dispatchEvent(event);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Add Book</span>
                  <span className="sm:hidden">Add</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard />
      </main>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16 sm:mt-0"
        toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200"
        bodyClassName="!text-sm"
      />
    </div>
  )
}
