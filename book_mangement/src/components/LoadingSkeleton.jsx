import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const DataLoadingSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton height={32} width={200} />
            <Skeleton height={16} width={300} className="mt-2" />
          </div>
          <Skeleton height={40} width={120} className="rounded-lg" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton height={40} width="100%" className="rounded-md" />
          <Skeleton height={40} width="100%" className="rounded-md" />
          <Skeleton height={40} width="100%" className="rounded-md" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton height={120} className="rounded-lg" />
                <Skeleton height={20} />
                <Skeleton height={16} width="70%" />
                <div className="flex justify-between">
                  <Skeleton height={14} width="40%" />
                  <Skeleton height={14} width="20%" />
                </div>
                <Skeleton height={24} width={80} className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
)

export const TableLoadingSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={80} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={60} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={50} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={70} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={60} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height={16} width={50} />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={120} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={100} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={80} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={60} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={40} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height={16} width={60} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </SkeletonTheme>
)

export const GridLoadingSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          <Skeleton height={120} className="rounded-lg" />
          <div className="space-y-2">
            <Skeleton height={20} />
            <Skeleton height={16} width="70%" />
            <div className="flex justify-between">
              <Skeleton height={14} width="40%" />
              <Skeleton height={14} width="20%" />
            </div>
            <Skeleton height={24} width={80} className="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonTheme>
)

export const FormLoadingSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <Skeleton height={24} width={200} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton height={16} width={60} />
          <Skeleton height={40} width="100%" className="rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton height={16} width={60} />
          <Skeleton height={40} width="100%" className="rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton height={16} width={60} />
          <Skeleton height={40} width="100%" className="rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton height={16} width={60} />
          <Skeleton height={40} width="100%" className="rounded-md" />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Skeleton height={40} width={80} className="rounded-md" />
        <Skeleton height={40} width={100} className="rounded-md" />
      </div>
    </div>
  </SkeletonTheme>
)

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  color = 'blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600'
  }
  
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`animate-spin rounded-full border-2 border-gray-300 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
        {text && <span className="text-gray-600 text-sm">{text}</span>}
      </div>
    </div>
  )
}

export const ButtonLoadingSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${sizeClasses[size]}`}></div>
  )
}

export const ErrorSkeleton = ({ message = 'Something went wrong', onRetry }) => (
  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Try Again
      </button>
    )}
  </div>
)