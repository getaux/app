import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button, Loading, Image } from '@nextui-org/react'
import { useImx, link } from 'utils/useImx'
import { ERC721TokenType, ETHTokenType, ERC20TokenType } from '@imtbl/imx-sdk'
import React from 'react'
import { Modal, Input, Row, Checkbox, Text } from '@nextui-org/react'
import PricingInput from 'components/pricing-input'
import CurrencyType from 'types/currencyType'
import toast from 'utils/toast'

import { forHumans } from 'utils'
import fetcher from 'utils/fetcher'
import Layout from 'components/layout'
import { Collection } from 'types/collection'
import { AuctionBid, AuctionItem, AuctionStatus } from 'types/auction'
import Nav from 'components/nav'
import Spacer from 'components/spacer'
import getPriceIcon from 'utils/getPriceIcon'
import CancelAuctionButton from 'components/cancel-auction-button'
import { Logo, Verified } from 'components/icons'
import { useAccount } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import createBid from 'utils/createBid'
import { DollarSign } from '@geist-ui/icons'

const useCollection = (id: string) => {
  const { data, error } = useSWR<Collection, any>(
    id && `https://api.ropsten.x.immutable.com/v1/collections/${id}`,
    fetcher
  )

  return { data, error, isLoading: !data && !error }
}

const prettyHex = (str: string, len = 4) =>
  str && `${str.substring(0, len)}...${str.substring(str.length - len)}`

const SubTitle = ({ children }: { children: any }) => (
  <div className="text-sm text-gray-400">{children}</div>
)

const Title = ({ children }: { children: any }) => (
  <div className="text-md font-bold text-gray-700">{children}</div>
)

const useAuction = () => {
  const router = useRouter()
  const { id } = router.query

  const { data, error, mutate } = useSWR<AuctionItem, any>(
    id && `https://getaux-staging.imxrarity.io/v1/auctions/${id}`,
    fetcher
  )
  return { data, error, isLoading: !data && !error, mutate }
}

export default function Page() {
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const router = useRouter()
  const { address } = useAccount()
  const { id } = router.query
  const { data: auction } = useAuction()
  const { data: collection } = useCollection(
    auction?.asset?.tokenAddress as string
  )

  const tokenAddress = auction?.asset?.tokenAddress
  const tokenId = auction?.asset?.tokenId

  const owner = auction?.owner
  const isActive = auction?.status == AuctionStatus.Active

  console.log(isActive, isOwner, owner, address)

  useEffect(() => {
    if (
      address?.toLocaleLowerCase() === (owner as string)?.toLocaleLowerCase()
    ) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }, [address, owner])

  let highestBid
  let price

  if (auction?.bids?.length) {
    highestBid = auction?.bids?.reduce(function (prev, current) {
      return Number(prev?.quantity) > Number(current?.quantity) ? prev : current
    })

    price = Number(highestBid?.quantity) / parseFloat(`1e${auction?.decimals}`)

    let ending = forHumans(
      auction &&
        (new Date(auction?.endAt).getTime() - new Date().getTime()) / 1000
    )
  }

  return (
    <>
      <Nav />

      <Layout>
        <div className="mt-24 grid grid-cols-1 space-x-12 lg:grid-cols-2">
          <Image
            showSkeleton
            width={400}
            height={400}
            maxDelay={10000}
            css={{ borderRadius: '8px' }}
            src={`http://www.deelay.me/250/${auction?.asset?.imageUrl}`}
          />

          <div className="mt-12 flex flex-col items-center lg:mt-0 lg:items-start">
            <div className="flex w-full items-center justify-between">
              <Link href={`/collection/${collection?.address}`}>
                <a>
                  <div className="flex items-center space-x-1">
                    <Verified />
                    <SubTitle>{collection?.name}</SubTitle>
                  </div>
                </a>
              </Link>

              {id && isOwner && isActive && (
                <CancelAuctionButton id={id as string} />
              )}

              {id && isOwner && !isActive && tokenAddress && tokenId && (
                <Button
                  onClick={(e) =>
                    router.push(`/create/${tokenAddress}/${tokenId}`)
                  }
                  // @ts-expect-error
                  type="success"
                  bordered
                >
                  Create Auction
                </Button>
              )}
            </div>

            <Spacer />

            <div className="text-2xl font-extrabold text-gray-900">
              {auction?.asset?.name}
            </div>

            <Spacer />

            {highestBid && (
              <SubTitle>
                Highest bid by {prettyHex(highestBid?.owner as string)}
              </SubTitle>
            )}

            <Spacer />

            {price && (
              <span className="flex items-center space-x-2">
                {getPriceIcon(auction?.tokenType as string, '38')}
                <span className="text-5xl font-bold">{price}</span>
              </span>
            )}

            <Spacer />

            <div className="flex flex-col space-y-10">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <SubTitle>Owner</SubTitle>
                  <span className="text-md font-bold text-gray-700">
                    {prettyHex(auction?.owner as string)}
                  </span>
                </div>

                {highestBid && (
                  <div className="flex flex-col">
                    <SubTitle>Highest bid</SubTitle>
                    <span className="text-md font-bold text-gray-700">
                      {price} {auction?.tokenType}
                    </span>
                  </div>
                )}
              </div>

              {auction?.bids?.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )?.length ? (
                <div className="">
                  <SubTitle>Bids</SubTitle>
                  <div className="max-h-48 space-y-4 overflow-auto px-2 py-4">
                    {auction?.bids?.reverse()?.map((item) => (
                      <Bid item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>

            <Spacer />

            <BidModal />
          </div>
        </div>
      </Layout>
    </>
  )
}

type Pricing = {
  currencyType: CurrencyType
  decimals: number
  amount: string
}

type TransferAndBidRequest = {
  currencyType: string
  //currencyType: ERC721TokenType | ETHTokenType | ERC20TokenType
  amount: string
  auctionId: number
}

const transferAndBid = async ({
  currencyType,
  amount,
  auctionId,
}: TransferAndBidRequest) => {
  try {
    const res = await link.transfer([
      {
        // @ts-expect-error
        type: currencyType,
        amount,
        toAddress: process.env.NEXT_PUBLIC_AUCTIONX_ADDRESS as string,
      },
    ])

    console.log('Response from link transfer', res)

    // @ts-expect-error
    let { txId: transferId, status } = res?.result[0]

    if (status !== 'success') {
      throw new Error('Transfer failed')
    }

    let { data, error } = await createBid({
      transferId,
      auctionId,
    })

    console.log(data, error)

    if (error) {
      let { message } = error
      throw Error(message)
    }

    return { data }
  } catch (e) {
    console.error('Failed to create bid', e)
    return { error: { message: (e as any).message } }
  } finally {
  }
}

const BidModal = () => {
  const [pricing, setPricing] = useState<Pricing>()
  const [visible, setVisible] = React.useState(false)
  const [loading, setLoading] = useState(false)
  const { mutate } = useAuction()
  const router = useRouter()
  const auctionId = router.query.id as string

  const handler = () => setVisible(true)
  const handleClose = () => setVisible(false)

  const handleBid = useCallback(async () => {
    try {
      setLoading(true)
      const { amount, currencyType } = pricing as Pricing

      if (!amount) {
        throw Error('No amount given')
      }

      if (!currencyType) {
        throw Error('No currency type given')
      }

      const { data, error } = await transferAndBid({
        auctionId: Number(auctionId),
        currencyType,
        amount,
      })
      console.log(data, error)
      if (error) {
        throw Error(error.message)
      }
      toast.success('Bid created!')
      mutate()
    } catch (e) {
      console.error(e)
      toast.error((e as any).message)
    } finally {
      setLoading(false)
      setVisible(false)
    }
  }, [pricing, auctionId])

  return (
    <div>
      {/* @ts-expect-error */}
      <Button css={{ width: '100%' }} type="success" onPress={handler}>
        Bid
      </Button>
      <Modal
        animated={false}
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={handleClose}
      >
        <Modal.Header>
          <Logo size={'62'} />
        </Modal.Header>
        <Modal.Body>
          <Text h2>Place your bid</Text>
          <Text small css={{ color: '#999' }}>
            Choose from a list of currencies to place your bid, with the amount
            you want.
          </Text>
          <Spacer />
          <PricingInput onChange={setPricing} />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat css={{ color: '$accents5' }} onClick={handleClose}>
            Close
          </Button>
          {/* @ts-expect-error */}
          <Button auto type="success" onClick={handleBid}>
            {loading ? (
              <Loading type="spinner" color="currentColor" size="sm" />
            ) : (
              'Bid'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const Bid = ({ item }: { item: AuctionBid }) => {
  const { data: auction } = useAuction()
  let price = Number(item?.quantity) / parseFloat(`1e${auction?.decimals}`)
  const date = format(new Date(item.createdAt), 'LLLL MM, yyyy HH:mm:ss')

  return (
    <div className="flex items-center space-x-4 border-t-[1px] border-gray-50 pt-4">
      <div className="h-7 w-7 rounded-full bg-green-200"></div>
      <div>
        <Title>
          Bid of {price} {auction?.tokenType} placed by {prettyHex(item?.owner)}
        </Title>
        <SubTitle>{date}</SubTitle>
      </div>
    </div>
  )
}
