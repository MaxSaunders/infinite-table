import { useEffect, useState } from 'react'
import useMakeFakeData from './useMakeFakeData'

export default function useBookSearch(query, pageNumber) {
    const { getMore, getNext, results, allResults } = useMakeFakeData(50)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setBooks(prevBooks => {
            return [...new Set([...prevBooks, ...results])]
        })
        setLoading(false)
    }, [results])

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError('')
        getNext()
        setHasMore(true)
    }, [query, pageNumber])

    return {
        loading,
        error,
        books,
        hasMore
    }
}