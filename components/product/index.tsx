import { AuctionItem } from 'types/auction'
import Link from 'next/link'
import { Image } from '@nextui-org/react'

import { Watch } from 'components/icons'
import { forHumans } from 'utils'
import getPriceIcon from 'utils/getPriceIcon'
import getStatusIcon from 'utils/getStatusIcon'
import useCountdown from 'hooks/useCountdown'

const Product = ({ item }: { item: AuctionItem }) => {
  const {
    id,
    status,
    endAt,
    tokenType,
    asset: { imageUrl, name },
  } = item

  const { remaining } = useCountdown(new Date(endAt as Date))

  let highestBid
  let highestBidString
  let ending

  if (item?.bids?.length) {
    highestBid = item?.bids?.reduce(function (prev, current) {
      return Number(prev?.quantity) > Number(current?.quantity) ? prev : current
    })

    highestBidString =
      Number(highestBid?.quantity) / parseFloat(`1e${item?.decimals}`)
  }

  ending = forHumans(
    item && (new Date(item?.endAt).getTime() - new Date().getTime()) / 1000
  )

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
              {remaining ? (
                <div className="flex space-x-1">
                  <span>{remaining?.days}d</span>
                  <span>{remaining?.hours}h</span>
                  <span>{remaining?.minutes}m</span>
                  <span>{remaining?.seconds}s</span>
                </div>
              ) : (
                'ended'
              )}
            </span>
          </div>

          <div
            className="mb-0 flex items-center"
            style={{ marginLeft: '-2px' }}
          >
            {getPriceIcon(tokenType)}
            <span className="elipsis ml-1 text-lg font-bold text-gray-900">
              {highestBidString ? highestBidString : '-'}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {highestBidString ? 'highest bid' : 'no bids yet'}
            </span>
          </div>
        </div>

        <Image
          showSkeleton
          // width={200}
          // height={200}
          maxDelay={10000}
          css={{ borderRadius: '8px' }}
          src={`http://www.deelay.me/250/${imageUrl}`}
        />

        {/* <img className="w-full rounded-lg" src={imageUrl} /> */}
      </div>
    </Link>
  )
}

export default Product
