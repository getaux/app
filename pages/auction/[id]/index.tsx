import { useRouter } from 'next/router'
import useSWR from 'swr'
import { format } from 'date-fns'
import Link from 'next/link'

import { forHumans } from 'utils'
import fetcher from 'utils/fetcher'
import Layout from 'components/layout'
import { Collection } from 'types/collection'
import { AuctionBid, AuctionItem } from 'types/auction'
import Nav from 'components/nav'
import Spacer from 'components/spacer'
import getPriceIcon from 'utils/getPriceIcon'
import Button from 'components/button'

const useCollection = (id: string) => {
  const { data, error } = useSWR<Collection, any>(
    id && `https://api.x.immutable.com/v1/collections/${id}`,
    fetcher
  )

  return { data, error, isLoading: !data && !error }
}

const prettyHex = (str: string, len = 4) =>
  str && `${str.substring(0, len)}...${str.substring(str.length - len)}`

const Verified = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      transform="rotate(62.112990463539965 8 8)"
      d="M10.046 1.56a1.5 1.5 0 001.06.44H12.5A1.5 1.5 0 0114 3.5v1.393c0 .398.158.78.44 1.061l.984.985a1.5 1.5 0 010 2.122l-.985.985a1.5 1.5 0 00-.44 1.06V12.5a1.5 1.5 0 01-1.5 1.5h-1.393a1.5 1.5 0 00-1.06.44l-.986.985a1.5 1.5 0 01-2.12 0l-.986-.986a1.5 1.5 0 00-1.06-.44H3.5A1.5 1.5 0 012 12.5v-1.393a1.5 1.5 0 00-.44-1.06L.575 9.06a1.5 1.5 0 010-2.122l.985-.985A1.5 1.5 0 002 4.894V3.5A1.5 1.5 0 013.5 2h1.393a1.5 1.5 0 001.06-.44L6.94.576a1.5 1.5 0 012.121 0l.986.986z"
      fill="#0788f5"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.133 5.903a.75.75 0 00-1.266-.806L6.93 9.712l-1.344-1.68a.75.75 0 00-1.172.937l2 2.5a.75.75 0 001.219-.066l3.5-5.5z"
      fill="#fff"
    ></path>
  </svg>
)

const SubTitle = ({ children }: { children: any }) => (
  <div className="text-sm text-gray-400">{children}</div>
)

const Title = ({ children }: { children: any }) => (
  <div className="text-md font-bold text-gray-700">{children}</div>
)

const useAuction = () => {
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR<AuctionItem, any>(
    id && `https://getaux-staging.imxrarity.io/v1/auctions/${id}`,
    fetcher
  )
  return { data, error, isLoading: !data && !error }
}

export default function Page() {
  const { data: auction } = useAuction()
  const { data: collection } = useCollection(
    auction?.asset?.tokenAddress as string
  )

  let highestBid = auction?.bids?.reduce(function (prev, current) {
    return Number(prev.quantity) > Number(current.quantity) ? prev : current
  })

  let price =
    Number(highestBid?.quantity) / parseFloat(`1e${auction?.decimals}`)

  let ending = forHumans(
    auction &&
      (new Date(auction?.endAt).getTime() - new Date().getTime()) / 1000
  )

  return (
    <>
      <Nav />

      <Layout>
        <div className="mt-24 grid grid-cols-1 space-x-12 lg:grid-cols-2">
          <img className="w-full rounded-lg" src={auction?.asset?.imageUrl} />

          <div className="mt-12 flex flex-col items-center lg:mt-0 lg:items-start">
            <Link href={`/collection/${collection?.address}`}>
              <a>
                <div className="flex items-center space-x-1">
                  <Verified />
                  <SubTitle>{collection?.name}</SubTitle>
                </div>
              </a>
            </Link>

            <Spacer />

            <div className="text-2xl font-extrabold text-gray-900">
              {auction?.asset?.name}
            </div>

            <Spacer />

            <SubTitle>
              Highest bid by {prettyHex(highestBid?.owner as string)}
            </SubTitle>

            <Spacer />

            <span className="flex items-center space-x-2">
              {getPriceIcon(auction?.tokenType as string, '38')}
              <span className="text-5xl font-bold">{price}</span>
            </span>

            <Spacer />

            <div className="flex flex-col space-y-10">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <SubTitle>Owner</SubTitle>
                  <span className="text-md font-bold text-gray-700">
                    {prettyHex(auction?.owner as string)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <SubTitle>Owner</SubTitle>
                  <span className="text-md font-bold text-gray-700">
                    {prettyHex(auction?.owner as string)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <SubTitle>Highest bid</SubTitle>
                  <span className="text-md font-bold text-gray-700">
                    {price} {auction?.tokenType}
                  </span>
                </div>
              </div>

              <div className="">
                <SubTitle>Bids</SubTitle>
                <div className="h-48 space-y-4 overflow-auto px-2 py-4">
                  {auction?.bids.map((item) => (
                    <Bid item={item} />
                  ))}
                </div>
              </div>
            </div>

            <Spacer />

            <Button type="success">Buy</Button>
          </div>
        </div>
      </Layout>
    </>
  )
}

const Bid = ({ item }: { item: AuctionBid }) => {
  const { data: auction } = useAuction()
  let price = Number(item?.quantity) / parseFloat(`1e${auction?.decimals}`)
  const date = format(new Date(item.createdAt), 'LLLL MM, yyyy HH:mm:ss')

  return (
    <div className="flex items-center space-x-4 border-t-[1px] border-gray-50 pt-4">
      <div className="h-8 w-8 rounded-full bg-red-500"></div>
      <div>
        <Title>
          Bid of {price} {auction?.tokenType} placed by {prettyHex(item?.owner)}
        </Title>
        <SubTitle>{date}</SubTitle>
      </div>
    </div>
  )
}
