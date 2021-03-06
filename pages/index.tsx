import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '@nextui-org/react'

import { Logo, Gradient } from 'components/icons'
// import Button from 'components/button'
import { AuctionItem } from 'types/auction'
import { useAuction } from 'hooks'
import Layout from 'components/layout'
import Spacer from 'components/spacer'
import Product from 'components/product'
import Nav from 'components/nav'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'utils/toast'
import Footer from "../components/footer";

const Home: NextPage = () => {
  const { data, error } = useAuction({
    status: 'active',
    orderBy: 'endAt',
    direction: 'asc'
  })
  const router = useRouter()

  const randomAuctionId = data?.result?.map((x) => x.id)[
    Math.floor(Math.random() * data?.result?.length)
  ]

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="animate-fade">
      <Head>
        <title>AuctionX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <Layout>
        {/* <div
          style={{
            zIndex: 0,
            left: '50%',
            top: '250px',
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute"
        >
          <Gradient />
        </div> */}
        <div className="flex flex-col py-36">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo size={'120px'} />
            <div className="my-2 flex items-center">
              <span
                className="ml-2 text-6xl font-extrabold"
                //style={{ fontFamily: 'GT Walsheim' }}
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
              onClick={(e) => router.push(`/auction/${randomAuctionId}`)}
              // @ts-expect-error
              type={'success'}
            >
              Random auction
            </Button>
            <Spacer />
            <Spacer />
          </div>
        </div>

        <span className="px-4 text-xl font-bold">Auctions</span>
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.result?.slice(0, 12)?.map((item: AuctionItem, index: number) => {
            return <Product key={index} item={item} />
          })}
        </div>
      </Layout>

      <Footer />

    </div>
  )
}

export default Home
