import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

import useConnectAndSign from 'hooks/useConnectAndSign'

type CancelAuctionPayload = {
  publicKey: string
  signature: string
}

const cancelAuction = async (
  auctionId: string,
  payload: CancelAuctionPayload
) => {
  const options = {
    method: 'DELETE',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }

  let url = `https://getaux-staging.imxrarity.io/v1/auctions/${auctionId}`
  let res = await fetch(url, options)
  let json = await res.json()
  if (res.status !== 200) {
    return { error: json }
  }

  return { data: json }
}

const useCancel = (auctionId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const { sign } = useConnectAndSign()
  const { address } = useAccount()

  const cancel = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: signature, error } = await sign({
        message: auctionId.toString(),
      })
      console.log(signature, error)

      if (error) {
        console.error('Failed to create signature', error)
        throw Error((error as any)?.message)
      }

      const { data, error: cancelError } = await cancelAuction(auctionId, {
        signature: signature as string,
        publicKey: address as string,
      })
      console.log(data, cancelError)

      if (cancelError) {
        console.error('Failed to cancel auction', cancelError)
        throw Error((cancelError as any)?.error)
      }

      return { data }
    } catch (e) {
      console.error('Failed to cancel bid', e)

      return { error: e }
    } finally {
      setIsLoading(false)
    }
  }, [address])

  return { cancel, isLoading }
}

export default useCancel
