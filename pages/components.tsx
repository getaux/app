import { ERC20TokenType, ERC721TokenType, ETHTokenType } from '@imtbl/imx-sdk'
import toast from 'utils/toast'
import { useImx, link } from 'utils/useImx'
import CancelAuctionButton from 'components/cancel-auction-button'
import { Avatar, Button, Loading, Input } from '@nextui-org/react'
import { useState, useCallback, useEffect } from 'react'
import { Dropdown, User } from '@nextui-org/react'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'

const sleep = (time: number) => new Promise((r) => setTimeout(r, time))

type AuctionPayload = {
  transferId: string
  quantity: string
  decimals: number
  endAt: string
  tokenType: string
  type: string
}

const createAuction = async (payload: AuctionPayload) => {
  const options = {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }

  let url = 'https://getaux-staging.imxrarity.io/v1/auctions'
  let res = await fetch(url, options)
  let json = await res.json()
  if (res.status !== 200) {
    return { error: json }
  }

  return { data: json }
}

type BidPayload = {
  transferId: string
  auctionId: number
}

const createBid = async (request: BidPayload) => {
  const options = {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }

  let url = 'https://getaux-staging.imxrarity.io/v1/bids'
  let res = await fetch(url, options)
  let json = await res.json()
  if (res.status !== 200) {
    return { error: json }
  }

  return { data: json }
}

enum AuctionType {
  English = 'english',
  Dutch = 'dutch',
}

enum CurrencyType {
  ETH = 'ETH',
  IMX = 'IMX',
  GODS = 'GODS',
  USDC = 'USDC',
  GOG = 'GOG',
  OMI = 'OMI',
}

type CreateAuctionRequest = {
  tokenType: ERC721TokenType
  tokenId: string
  tokenAddress: string
  toAddress: string
  quantity: string
  decimals: number
  endAt: string
  auctionType: AuctionType
  currencyType: CurrencyType
}

export default function Page() {
  // @ts-expect-error
  const { connect, disconnect, user } = useImx()

  const handleCreate = async () => {
    let { data, error } = await createAuction({
      transferId: '4747561',
      // @ts-expect-error
      quantity: toBn('0.01'),
      decimals: 18,
      endAt: '2022-06-29T14:03:11.026Z',
      tokenType: 'ETH',
      type: 'english',
    })
    console.log(data, error)

    if (error) {
      let { error: message, code } = error
      return toast.error(message)
    }
  }

  const handleSend = async () => {
    const res = await link.transfer([
      {
        type: ETHTokenType.ETH,
        amount: '0.015',
        toAddress: '0x0dcc8801077bb9c8d874f84d07924ef91d6f3574',
      },
    ])
    console.log(res)
    // @ts-expect-error
    let { txId: transferId } = res?.result[0]

    console.log(transferId)
  }

  const handleBidOnly = async () => {
    let { data, error } = await createBid({
      transferId: '4747550',
      auctionId: 46,
    })
    console.log(data, error)

    if (error) {
      let { error: message, code } = error
      toast.error(message)
    }
  }

  const handleBid = async () => {
    try {
      const res = await link.transfer([
        {
          type: ETHTokenType.ETH,
          amount: '0.02',
          toAddress: process.env.NEXT_PUBLIC_AUCTIONX_ADDRESS as string,
        },
      ])

      console.log('Response from link transfer', res)

      // @ts-expect-error
      let { txId: transferId, status } = res?.result[0]

      if (status !== 'success') {
        throw new Error('Transfer failed')
      }

      // // TODO: retry if txId is not available
      // await sleep(5000)

      // let { data, error } = await createBid({
      //   transferId,
      //   auctionId: 62,
      // })

      // console.log(data, error)

      // if (error) {
      //   let { error: message, code } = error
      //   return toast.error(message)
      // }
      toast.success('Created bid!')
    } catch (e) {
      console.error('Failed to create bid', e)
      return toast.error((e as any)?.message)
    } finally {
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <button onClick={user ? () => disconnect() : () => connect()}>
        {user ? user : 'connect'}
      </button>

      {/* <button onClick={handleCreate}>2. create Auction</button>
      <button onClick={handleSend}>3. send eth for bid</button>
      <button onClick={handleBidOnly}>4. bid on item</button>
      <button onClick={handleBid}>5. send eth and bid on item</button> */}

      <DateAndTime />

      <Spacer />

      <div>
        <AuctionTypeDropdown />
      </div>

      <Spacer />

      <MinimumBidInput />

      <Spacer />

      <CreateAuctionButton />

      <Spacer />

      <CancelAuctionButton id={'45'} />

      <Spacer />
      {/* @ts-expect-error */}
      <Button onClick={handleBid} type="success">
        Bid on item
      </Button>
    </div>
  )
}

const MinimumBidInput = () => {
  const { mutate, data } = useAuction()

  return (
    <Input
      animated={false}
      bordered
      shadow={false}
      width="186px"
      label="Minimum Bid"
      type="text"
      //helperText={'Set your starting bid price'}
      placeholder="0.1"
      onChange={(e) => {
        const decimals = data?.selectedToken?.decimals
        let { value } = e.target
        let quantity

        if (value && !isNaN(parseFloat(value))) {
          const price = parseFloat(value).toString()
          quantity = toBn(price, decimals).toString()
        }

        mutate({
          ...data,
          quantity,
          decimals,
        })
      }}
      contentLeft={<TokensDropdown />}
    />
  )
}

const DateAndTime = () => {
  const { mutate, data } = useAuction()
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()

  useEffect(() => {
    if (date && time) {
      mutate({ ...data, endAt: new Date(`${date} ${time}`).toISOString() })
    }
  }, [time, date])

  return (
    <>
      <Input
        //color="success"
        animated={false}
        bordered
        shadow={false}
        onChange={(e) => setDate(e.target.value)}
        width="186px"
        label="Date"
        type="date"
      />
      <Input
        animated={false}
        shadow={false}
        bordered
        onChange={(e) => setTime(e.target.value)}
        width="186px"
        label="Time"
        type="time"
      />
    </>
  )
}

const useCreateAuction = () => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const create = useCallback(
    async ({
      tokenType,
      tokenId,
      tokenAddress,
      toAddress,
      quantity,
      decimals,
      endAt,
      auctionType,
      currencyType,
    }: CreateAuctionRequest) => {
      try {
        setIsLoading(true)
        const res = await link.transfer([
          {
            type: tokenType,
            tokenId,
            tokenAddress,
            toAddress,
          },
        ])
        console.log(res)
        // @ts-expect-error
        let { txId: transferId } = res?.result[0]

        console.log(transferId)

        await sleep(5000)

        let { data, error } = await createAuction({
          transferId,
          quantity,
          decimals,
          endAt,
          tokenType: currencyType,
          type: auctionType,
        })

        console.log(data, error)

        if (error) {
          let { error: message, code } = error
          throw Error(message)
        }

        return { data }
      } catch (e) {
        console.error(`Failed to create auction`, e)
        return { error: e ?? `Failed to create auction` }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { create, isLoading }
}

import { toBn } from 'evm-bn'
import Spacer from 'components/spacer'

const useImmutableToken = () => {
  const { data, error } = useSWR(
    'https://api.ropsten.x.immutable.com/v1/tokens',
    fetcher
  )

  return { data, isLoading: !data && !error }
}

type TokenItem = {
  decimals: string
  image_url: string
  name: string
  quantum: string
  symbol: string
  token_address: string
}

const AuctionTypeDropdown = () => {
  return (
    <>
      <span className="text-sm">Auction type</span>
      <Dropdown disableAnimation isBordered>
        <Dropdown.Button
          animated={false}
          css={{ border: '2px solid #999' }}
          bordered
        >
          Select auction type
        </Dropdown.Button>
        <Dropdown.Menu aria-label="Auction Type">
          <Dropdown.Item key={AuctionType.English}>English</Dropdown.Item>
          <Dropdown.Item key={AuctionType.Dutch}>Dutch</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

const TokensDropdown = () => {
  const { data } = useImmutableToken()
  const { mutate, data: auctionData } = useAuction()
  const [selected, setSelected] = useState<TokenItem>()

  useEffect(() => {
    if (data?.result?.length) {
      setSelected(data.result[0])
    }
  }, [data])

  return (
    <Dropdown closeOnSelect disableAnimation>
      <Dropdown.Button
        css={{ paddingLeft: '0px', minWith: 'auto', paddingRight: '0px' }}
      >
        <Avatar
          bordered
          size="sm"
          as="button"
          color="secondary"
          src={selected?.image_url}
        />
      </Dropdown.Button>
      <Dropdown.Menu
        onAction={(key) => {
          const selected = data.result.find((x: any) => x.name === key)
          if (selected) {
            setSelected(selected)
            mutate({
              ...auctionData,
              currencyType: selected.symbol,
              selectedToken: selected,
              decimals: selected.decimals,
            })
          }
        }}
        aria-label="Static Actions"
      >
        {data?.result?.map((x: any) => (
          <Dropdown.Item className="truncate" key={x.name}>
            <div className="flex items-center space-x-2">
              <Avatar size={'sm'} src={x?.image_url} />
              <span className="overflow-hidden truncate">{x.name}</span>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

const useAuction = () => {
  const { data, mutate } = useSWR<any, any>('auction')

  return { data, mutate }
}

const CreateAuctionButton = () => {
  const { create, isLoading } = useCreateAuction()
  const { data } = useAuction()

  const decimals = 18
  const quantity = toBn('0.01', decimals).toString()
  console.log(data)

  const handeleClick = useCallback(async () => {
    try {
      // const {
      //   tokenType,
      //   tokenId,
      //   currencyType,
      //   tokenAddress,
      //   toAddress,
      //   auctionType,
      //   quantity,
      //   decimals,
      //   endAt,
      // } = data

      // if (!data?.tokenType) {
      //   throw Error('Token type required')
      // }

      console.log(data)

      if (!data?.endAt) {
        throw Error('Date and time required')
      }

      if (!data?.tokenId) {
        throw Error('tokenId required')
      }

      const { data: response, error } = await create({
        tokenType: ERC721TokenType.ERC721,
        tokenId: '967',
        currencyType: CurrencyType.ETH,
        tokenAddress: '0x9f6ceedacc84e8266c3e7ce6f7bcbf7d1de39501',
        toAddress: process.env.NEXT_PUBLIC_AUCTIONX_ADDRESS as string,
        auctionType: AuctionType.English,
        quantity,
        decimals,
        endAt: '2022-06-29T14:03:11.026Z',
      })

      console.log(response, error)

      if (error) {
        throw Error((error as any).message)
      }

      toast.success('Auction created!')
    } catch (e) {
      console.error(e)
      toast.error((e as any).message)
    } finally {
    }
  }, [data])

  return (
    <Button bordered color="success" auto onClick={handeleClick}>
      {isLoading ? (
        <Loading type="spinner" color="currentColor" size="sm" />
      ) : (
        'Create Auction'
      )}
    </Button>
  )
}
