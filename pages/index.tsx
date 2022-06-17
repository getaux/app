import type { NextPage } from 'next'
import Head from 'next/head'

import {
  Usdc,
  Gods,
  Eth,
  Omi,
  Expired,
  InProgress,
  Cancelled,
  Watch,
  Logo,
  Gradient,
  ExternalLink,
} from '../components/icons'
import { capitalizeFirstLetter, forHumans } from '../utils'
import Button from '../components/button'
import useSWR from 'swr'
import { AuctionResponse, AuctionResult } from '../types/auction'

const log = console.log
const Spacer = () => <div className="mb-2"></div>

const getPriceIcon = (type: string) => {
  let icon
  switch (type) {
    case 'ETH':
      icon = (() => <Eth size={'20'} />)()
      break
    case 'USDC':
      icon = <Usdc size={'20'} color="black" />
      break
    case 'OMI':
      icon = <Omi size={'20'} color="black" />
      break
    case 'GODS':
      icon = <Gods size={'20'} color="black" />
      break
    case 'GOG':
      icon = <Omi size={'20'} color="black" />
      break
    default:
      break
  }

  return icon
}

export const getStatusIcon = (type: string) => {
  let icon
  switch (type) {
    case 'expired':
      icon = (() => <Expired />)()
      break
    case 'active':
      icon = <InProgress />
      break
    case 'cancelled':
      icon = <Cancelled />
      break
    default:
      break
  }

  return icon
}

const useAuction = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR<AuctionResponse, any>(
    'https://getaux-staging.imxrarity.io/v1/auctions',
    fetcher
  )

  return { data, error, isLoading: !data && !error }
}

const Home: NextPage = () => {
  const { data } = useAuction()

  return (
    <div className="animate-fade">
      <Head>
        <title>AuctionX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="border-2 border-b border-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="p-4">
            <Logo />
          </div>
        </div>
      </div>

      <main className="relative mx-auto mx-auto flex max-w-4xl max-w-4xl flex-col justify-center px-4 pb-32">
        <div
          style={{
            zIndex: 0,
            left: '50%',
            top: '250px',
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute"
        >
          <Gradient />
        </div>
        <div className="z-50 flex flex-col py-36">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo size={'120px'} />
            <div className="my-2 flex items-center">
              <span
                className="ml-2 text-6xl font-extrabold"
                style={{ fontFamily: 'GT Walsheim' }}
              >
                Auctions for Immutable X are here.
              </span>
            </div>
            <Spacer />
            <Spacer />
            <span className="mb-2 text-xl text-gray-500">
              Together with snoopy, imxrarity, and the immutable x team,
              auctions are now active
            </span>
          </div>
          <Spacer />
          <Spacer />
          <Spacer />

          <div className="justify-centerr flex flex-col items-center">
            <Button
              type={'success'}
              scale={1.5}
              iconRight={<ExternalLink />}
              type="secondary"
            >
              Random auction
            </Button>
            <Spacer />
            <Spacer />
          </div>
        </div>

        <span className="px-4 text-xl font-bold">Auctions</span>
        <div className="z-50 grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          {data?.result?.map((item: AuctionResult) => {
            return <Product item={item} />
          })}
        </div>
      </main>
    </div>
  )
}

const Product = ({ item }: { item: AuctionResult }) => {
  const {
    status,
    endAt,
    quantity,
    tokenType,
    decimals,
    asset: { imageUrl, name },
  } = item

  let price = Number(quantity) / parseFloat(`1e${Number(decimals)}`)

  return (
    <div
      className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50`}
    >
      <div className="flex flex-col">
        <span className="elipsis mb-2 text-xs text-gray-400">{name}</span>

        <div className="mb-2 flex items-center">
          {getStatusIcon(status)}
          <span className="elipsis ml-1.5 text-xs text-gray-400">{status}</span>
        </div>

        <div className=" mb-2 flex items-center" style={{ marginLeft: '-3px' }}>
          <Watch />
          <span className="elipsis ml-1 text-xs text-gray-400">
            {forHumans(
              (new Date(endAt).getTime() - new Date().getTime()) / 1000
            )}
          </span>
        </div>

        <div className="mb-0 flex items-center" style={{ marginLeft: '-2px' }}>
          {getPriceIcon(tokenType)}
          <span className="elipsis ml-1 text-lg font-bold text-gray-900">
            {price}
          </span>
        </div>
      </div>

      <img className="mt-2 w-full rounded-lg" src={imageUrl} />
    </div>
  )
}

export default Home
