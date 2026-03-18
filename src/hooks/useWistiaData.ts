import {useState, useEffect, useCallback, useRef} from 'react'

import {Config} from '../types'

const RESULTS_PER_PAGE = 100
const WISTIA_API_URL = 'https://api.wistia.com/modern'

interface UseWistiaDataResult<T> {
  data: T[]
  loadingMore: boolean
  error: string
  hasMore: boolean
  loadMore: () => void
}

export function useWistiaData<T>(
  path: string | null,
  config: Config,
  onFirstLoad?: (data: T[]) => void,
): UseWistiaDataResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const wistiaAPIOptions = {
    headers: {
      'X-Wistia-API-Version': '2026-01',
      Authorization: `Bearer ${config.token}`,
    }
  }

  // Always call onFirstLoad with the latest version without it being a dep
  const onFirstLoadRef = useRef(onFirstLoad)
  onFirstLoadRef.current = onFirstLoad

  useEffect(() => {
    if (!path) {
      setData([])
      setHasMore(false)
      setError('')
      setPage(1)
      return
    }

    setPage(1)
    fetch(`${WISTIA_API_URL}${path}&page=1&per_page=${RESULTS_PER_PAGE}`, wistiaAPIOptions)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            r.status === 401
              ? '401 Not authorised - check your API key permissions.'
              : `${r.status} error`,
          )
        }
        return r.json()
      })
      .then((result: T[]) => {
        setHasMore(result.length === RESULTS_PER_PAGE)
        setData(result)
        onFirstLoadRef.current?.(result)
      })
      .catch((err) => setError(err.message))
  }, [path, config.token])

  const loadMore = useCallback(() => {
    if (!path) return
    const nextPage = page + 1
    setPage(nextPage)
    setLoadingMore(true)

    fetch(`${WISTIA_API_URL}${path}&page=${nextPage}&per_page=${RESULTS_PER_PAGE}`, wistiaAPIOptions)
      .then((r) => r.json())
      .then((result: T[]) => {
        setHasMore(result.length === RESULTS_PER_PAGE)
        setData((prev) => [...prev, ...result])
        setLoadingMore(false)
      })
      .catch(console.error)
  }, [page, path, config.token])

  return {data, loadingMore, error, hasMore, loadMore}
}
