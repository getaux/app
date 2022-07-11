import useSWR from 'swr'

import { AuctionResponse } from '../types/auction'

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const json = await res.json()
    const error = new Error(json?.error || 'Network error')
    throw error
  }

  return res.json()
}

export const useAuction = (args?: any) => {
  let url = 'https://getaux-staging.imxrarity.io/v1/auctions'

  if (args?.collection) {
    url = `${url}?collection=${args.collection}`
  }

  const { data, error } = useSWR<AuctionResponse, any>(url, fetcher)

  return { data, error, isLoading: !data && !error }
}
