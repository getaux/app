import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ImxContextProvider } from 'utils/useImx'
import { NextUIProvider } from '@nextui-org/react'

import { configureChains, chain, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <NextUIProvider>
        <ImxContextProvider>
          <Component {...pageProps} />
        </ImxContextProvider>
      </NextUIProvider>
    </WagmiConfig>
  )
}

export default MyApp
