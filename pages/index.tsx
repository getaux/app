import type { NextPage } from 'next'
import Head from 'next/head'

import auctions from '../data/auctions.json'
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
} from '../components/icons'
import { capitalizeFirstLetter, forHumans } from '../utils'

export const getPriceIcon = (type: string) => {
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

const Home: NextPage = () => {
  return (
    <div className="flex h-full flex-col bg-white">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="border-2 border-b border-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="p-4">
            <Logo />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          {auctions.result.map((order: any, i: any) => {
            return (
              <Product
                ending={order.endAt}
                src={order.asset.imageUrl}
                name={order.asset.name}
                priceIcon={getPriceIcon(order.tokenType)}
                statusIcon={getStatusIcon(order.status)}
                statusText={capitalizeFirstLetter(order.status)}
                price={String(
                  (order.quantity / parseFloat(`1e${order.decimals}`)).toFixed(
                    2
                  )
                )}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}

const Product = ({
  src,
  name,

  price,
  ending,
  priceIcon,
  statusIcon,
  statusText,
}: {
  src: string
  name: string
  price: string
  ending: string
  priceIcon: any
  statusIcon: any
  statusText: string
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50`}
    >
      <div className="flex flex-col">
        <span className="elipsis mb-2 text-xs text-gray-400">{name}</span>

        <div className="mb-2 flex items-center">
          {statusIcon}
          <span className="elipsis ml-1.5 text-xs text-gray-400">
            {statusText}
          </span>
        </div>

        <div className=" mb-2 flex items-center" style={{ marginLeft: '-3px' }}>
          <Watch />
          <span className="elipsis ml-1 text-xs text-gray-400">
            {forHumans(
              (new Date(ending).getTime() - new Date().getTime()) / 1000
            )}
          </span>
        </div>

        <div className="mb-0 flex items-center" style={{ marginLeft: '-2px' }}>
          {priceIcon}
          <span className="elipsis ml-1 text-lg font-bold text-gray-900">
            {price}
          </span>
        </div>
      </div>

      <img className="mt-2 w-full rounded-lg" src={src} />
    </div>
  )
}

export default Home
