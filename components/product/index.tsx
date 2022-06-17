import { AuctionResult } from 'types/auction'

import {
  Usdc,
  Gods,
  Eth,
  Omi,
  Watch,
  Expired,
  InProgress,
  Cancelled,
} from 'components/icons'
import { forHumans } from 'utils'

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

export default Product
