import { useRouter } from 'next/router'
import Link from 'next/link'

import { useAuction } from 'hooks'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'
import Layout from 'components/layout'
import { Collection } from 'types/collection'
import Spacer from 'components/spacer'
import Product from 'components/product'
import { AuctionItem } from 'types/auction'
import Nav from 'components/nav'

const useCollection = (id: string) => {
  const { data, error } = useSWR<Collection, any>(
    id && `https://api.x.immutable.com/v1/collections/${id}`,
    fetcher
  )

  return { data, error, isLoading: !data && !error }
}

export default function Page() {
  const router = useRouter()
  const { id } = router.query

  const { data: auction } = useAuction({ collection: id })
  const { data: collection } = useCollection(id as string)

  return (
    <>
      <Nav />

      <Layout>
        <div className="my-24 mx-auto flex max-w-xl flex-col items-center justify-center space-y-4 text-center">
          <img
            className="h-32 w-32 rounded-lg"
            src={collection?.collection_image_url as string}
          />
          <Spacer />
          <span className="mb-2 text-3xl font-extrabold">
            {collection?.name}
          </span>
          <span className="text-md text-gray-400">
            {collection?.description}
          </span>
        </div>

        <span className="px-4 text-xl font-bold">Auctions</span>
        <div className="z-50 grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          {auction?.result?.map((item: AuctionItem) => {
            return <Product item={item} />
          })}
        </div>
      </Layout>
    </>
  )
}
