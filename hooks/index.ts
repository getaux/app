import useSWR from 'swr'

import { AuctionResponse } from '../types/auction'
import fetcher from 'utils/fetcher'

export const useAuction = (args?: any) => {
  let url = 'https://getaux-staging.imxrarity.io/v1/auctions'

  if (args?.collection) {
    url = `${url}?collection=${args.collection}`
  }

  const { data, error } = useSWR<AuctionResponse, any>(url, fetcher)

  return { data, error, isLoading: !data && !error }
}
