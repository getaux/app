import { useCallback, useState } from 'react'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const useConnectAndSign = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  })

  const sign = useCallback(
    async ({ message }: { message: string }) => {
      setLoading(true)

      // if not connected, connect and sign message.
      // if connected, sign the message and return with it.
      if (!isConnected) {
        try {
          await connectAsync()

          let signature = await signMessageAsync({
            message,
          })

          return { data: signature }
        } catch (e) {
          console.error(e)
          return { error: e }
        } finally {
          setLoading(false)
        }
      } else {
        try {
          let signature = await signMessageAsync({
            message,
          })

          return { data: signature }
        } catch (e) {
          console.error(e)
          return { error: e }
        } finally {
          setLoading(false)
        }
      }
    },
    [isConnected]
  )

  return { sign, isLoading: loading }
}

export default useConnectAndSign
