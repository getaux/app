import Nav from 'components/nav'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'
import { useImx } from 'utils/useImx'
import Link from 'next/link'
import Layout from 'components/layout'
import { Button, Spacer, Text, Image } from '@nextui-org/react'
import { imxEndpoint } from "utils/imx";

type Asset = {
  name: string
  user: string
  image_url: string
  token_address: string
  token_id: string
}

export default function Page() {
  // @ts-expect-error
  const { user } = useImx()
  const { data } = useSWR(
    user &&
       `${imxEndpoint}/v1/assets?user=${user}&direction=asc&order_by=name`,

      //`${imxEndpoint}/v1/assets?user=${user}&direction=asc&order_by=name&collection=0x9f6ceedacc84e8266c3e7ce6f7bcbf7d1de39501`, // user: 0x0f90387fc8df00c5d519081b7a6e977fcae03eca
    fetcher
  )
  return (
    <div>
      <Nav />

      <Layout>
        <Spacer />
        <Spacer />

        <div className="text-left">
          <span className="p-4 text-5xl font-extrabold text-slate-300">
            My Assets
          </span>
        </div>
        <Spacer />
        <div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-3 lg:grid-cols-3">
          {data?.result?.slice(0, 12)?.map((item: Asset, index: number) => {
            return <Product key={index} item={item} />
          })}
        </div>
      </Layout>
    </div>
  )
}

const Product = ({ item }: { item: Asset }) => {
  const { token_id, token_address, name, user, image_url } = item

  return (
    <div
      className={`group relative space-y-2 rounded-lg border border-gray-100 bg-white p-5 transition-all hover:border-pink-200 hover:bg-pink-50`}
    >
      <div className="flex flex-col space-y-2">
        <span className="elipsis text-xs text-gray-400">{name}</span>

        <Image
          height={'220px'}
          width={'220px'}
          maxDelay={10000}
          showSkeleton
          className="w-full rounded-lg"
          css={{ borderRadius: '8px' }}
          src={`http://www.deelay.me/250/${image_url}`}
        />
      </div>

      <Link href={`/create/${token_address}/${token_id}`}>
        <a className="absolute bottom-2 right-2 cursor-pointer rounded-md p-0.5 text-gray-50  transition-all duration-300 hover:border-white dark:bg-black sm:opacity-0 sm:group-hover:opacity-100">
          {/*// @ts-expect-error */}
          <Button type="success" size={'sm'}>
            Auction
          </Button>
        </a>
      </Link>
    </div>
  )
}
