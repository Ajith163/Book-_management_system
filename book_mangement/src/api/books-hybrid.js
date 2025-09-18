const API_BASE_URL = 'https://reqres.in/api'
const API_KEY = 'reqres-free-v1'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

let localBooks = []
let nextId = 1000
const makeRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
  'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help', 
  'Business', 'Technology', 'Health', 'Travel', 'Cooking', 'Art'
]

const transformUserToBook = (user) => ({
  _id: user.id.toString(),
  title: `${user.first_name} ${user.last_name}`,
  author: user.email,
  genre: genres[user.id % genres.length],
  publishedYear: 2020 + (user.id % 10),
  rating: Math.floor(Math.random() * 5) + 1,
  status: user.id % 2 === 0 ? 'Available' : 'Issued'
})

const loadInitialBooks = async () => {
  if (localBooks.length > 0) return localBooks
  
  try {
    await delay(500)
    
    const endpoint = `${API_BASE_URL}/users?per_page=12`
    const response = await makeRequest(endpoint)
    
    localBooks = response.data.map(transformUserToBook)
    return localBooks
  } catch (error) {
    console.error(' Error fetching books from Reqres:', error)
    localBooks = []
    return []
  }
}

export const fetchBooks = async () => {
  try {
    await loadInitialBooks()
    return localBooks
  } catch (error) {
    console.error('Error fetching books:', error)
    throw new Error(`Failed to fetch books: ${error.message}`)
  }
}

export const createBook = async (bookData) => {
  try {
    await delay(300)
    
    await loadInitialBooks()
    const newBook = {
      _id: (nextId++).toString(),
      title: bookData.title || '',
      author: bookData.author || '',
      genre: bookData.genre || 'Fiction',
      publishedYear: bookData.publishedYear || new Date().getFullYear(),
      rating: bookData.rating || 0,
      status: bookData.status || 'Available'
    }
    
    localBooks.push(newBook)
    return newBook
  } catch (error) {
    console.error('Error creating book:', error)
    throw new Error(`Failed to create book: ${error.message}`)
  }
}

export const updateBook = async (id, bookData) => {
  try {
    await delay(300)
    
    await loadInitialBooks()
    const bookIndex = localBooks.findIndex(book => book._id === id)
    
    if (bookIndex === -1) {
      throw new Error(`Book with ID ${id} not found`)
    }
    
    localBooks[bookIndex] = {
      ...localBooks[bookIndex],
      ...bookData,
      _id: id
    }
    return localBooks[bookIndex]
  } catch (error) {
    console.error('Error updating book:', error)
    throw new Error(`Failed to update book: ${error.message}`)
  }
}

export const deleteBook = async (id) => {
  try {
    await delay(300)
    
    await loadInitialBooks()
    const bookIndex = localBooks.findIndex(book => book._id === id)
    
    if (bookIndex === -1) {
      throw new Error(`Book with ID ${id} not found`)
    }
    
    localBooks.splice(bookIndex, 1)
    
    return id
  } catch (error) {
    console.error('Error deleting book:', error)
    throw new Error(`Failed to delete book: ${error.message}`)
  }
}
