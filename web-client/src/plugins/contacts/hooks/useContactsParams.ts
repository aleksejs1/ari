import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useContactsParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const group = searchParams.get('group') ?? undefined
  const search = searchParams.get('search') ?? undefined

  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | undefined>(undefined)

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (value) {
        newParams.set('search', value)
      } else {
        newParams.delete('search')
      }
      newParams.set('page', '1')
      return newParams
    })
  }

  const handleSort = (id: string, desc: boolean) => {
    setSorting({ id, desc })
  }

  const setPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
  }

  return {
    page,
    group,
    search,
    sorting,
    handleSearch,
    handleSort,
    setPage,
    searchParams,
  }
}
