import useSWR from 'swr'

import { AuctionResponse } from '../types/auction'

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const json = await res.json()
    throw new Error(json?.error || 'Network error')
  }

  return res.json()
}

export const useAuction = (args?: any) => {
  let url = 'https://getaux-staging.imxrarity.io/v1/auctions'

  if(args){
    Object.keys(args).forEach((key: any, index: number) => {
      url = `${url}${index === 0 ? '?' : '&'}${key}=${args[key]}`
    })
  }

  const { data, error } = useSWR<AuctionResponse, any>(url, fetcher)

  return { data, error, isLoading: !data && !error }
}
