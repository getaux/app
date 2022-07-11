import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ImxContextProvider } from 'utils/useImx'
import { NextUIProvider } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { useRouter } from 'next/router'
import { Logo } from 'components/icons'
import Router from 'next/router';

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
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false));
    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true));
      Router.events.off('routeChangeComplete', () => setLoading(false));
      Router.events.off('routeChangeError', () => setLoading(false));
    };
  }, [Router.events]);

  if (loading) {
    return (
      <div
        style={{
          zIndex: '100',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Logo/>
      </div>
    )
  }

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
