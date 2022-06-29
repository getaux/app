import { AuctionItem } from 'types/auction'
import Link from 'next/link'

import { Watch, Expired, InProgress, Cancelled, Done } from 'components/icons'
import { forHumans } from 'utils'
import getPriceIcon from 'utils/getPriceIcon'

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
    case 'filled':
      icon = <Done />
      break
    default:
      break
  }

  return icon
}

const Product = ({ item }: { item: AuctionItem }) => {
  const {
    id,
    status,
    endAt,
    quantity,
    tokenType,
    decimals,
    asset: { imageUrl, name },
  } = item

  let price = Number(quantity) / parseFloat(`1e${Number(decimals)}`)

  return (
    <Link href={`/auction/${id}`}>
      <div
        className={`cursor-pointer space-y-2 rounded-lg border border-gray-100 bg-white p-5 transition-all hover:border-pink-200 hover:bg-pink-50`}
      >
        <div className="flex flex-col space-y-2">
          <span className="elipsis text-xs text-gray-400">{name}</span>

          <div className="flex items-center">
            {getStatusIcon(status)}
            <span className="elipsis ml-1.5 text-xs text-gray-400">
              {status}
            </span>
          </div>

          <div className=" flex items-center" style={{ marginLeft: '-3px' }}>
            <Watch />
            <span className="elipsis ml-1 text-xs text-gray-400">
              {forHumans(
                (new Date(endAt).getTime() - new Date().getTime()) / 1000
              )}
            </span>
          </div>

          <div
            className="mb-0 flex items-center"
            style={{ marginLeft: '-2px' }}
          >
            {getPriceIcon(tokenType)}
            <span className="elipsis ml-1 text-lg font-bold text-gray-900">
              {price}
            </span>
          </div>
        </div>

        <img className="w-full rounded-lg" src={imageUrl} />
      </div>
    </Link>
  )
}

export default Product