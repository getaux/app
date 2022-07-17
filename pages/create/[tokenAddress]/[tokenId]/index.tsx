import { ERC721TokenType } from '@imtbl/imx-sdk'
import { useRouter } from 'next/router'
import {
  Avatar,
  Button,
  Input,
  Spacer,
  Text,
  Image,
  Divider,
  Loading,
} from '@nextui-org/react'
import { useState, useCallback, useEffect } from 'react'
import { Dropdown } from '@nextui-org/react'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'
import { toBn } from 'evm-bn'
const sleep = (time: number) => new Promise((r) => setTimeout(r, time))
import { link } from 'utils/useImx'
import toast from 'utils/toast'
import EndAt from 'components/end-at'
import Nav from 'components/nav'

export default function Page() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2">
          <CreateAuctionContent />
          <PreviewAuction />
        </div>
      </div>
    </>
  )
}

const PreviewAuction = () => {
  const router = useRouter()
  const { tokenId, tokenAddress } = router.query
  const fetcher = (url: any) => fetch(url).then((r) => r.json())
  const { data } = useSWR(
    tokenId &&
      tokenAddress &&
      `https://api.ropsten.x.immutable.com/v1/assets/${tokenAddress}/${tokenId}`,
    fetcher
  )
  return (
    <div className="flex flex-col">
      <Image
        showSkeleton
        maxDelay={10000}
        // width={500}
        // height={500}
        className="rounded-lg"
        src={data?.image_url}
      />

      <span className="mt-2 text-8xl font-extrabold text-gray-200">
        {data?.name}
      </span>
    </div>
  )
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

const useImmutableToken = () => {
  const { data, error } = useSWR(
    'https://api.ropsten.x.immutable.com/v1/tokens',
    fetcher
  )

  return { data, isLoading: !data && !error }
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

const DateAndTime = ({ onChange }: { onChange: any }) => {
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()

  useEffect(() => {
    if (date && time) {
      onChange && onChange(new Date(`${date} ${time}`).toISOString())
    }
  }, [time, date])

  return (
    <div className="flex space-x-2">
      <Input
        animated={false}
        //bordered
        shadow={false}
        onChange={(e) => setDate(e.target.value)}
        width="186px"
        label="Date"
        type="date"
      />
      <Input
        animated={false}
        shadow={false}
        //bordered
        onChange={(e) => setTime(e.target.value)}
        width="186px"
        label="Time"
        type="time"
      />
    </div>
  )
}

const TokensDropdown = ({ onChange }: { onChange: any }) => {
  const { data } = useImmutableToken()
  const [selected, setSelected] = useState<any>()

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
          bordered={false}
          size="sm"
          as="button"
          //css={{ border: '1px solid #fff' }}
          src={selected?.image_url}
        />
      </Dropdown.Button>
      <Dropdown.Menu
        disabledKeys={data?.result?.filter((x: any) => x?.symbol !== 'ETH').map((x: any) => x?.symbol)}
        onAction={(key) => {
          const selected = data.result.find((x: any) => x.name === key)
          if (selected) {
            setSelected(selected)
            onChange && onChange(selected)
          }
        }}
        aria-label="Static Actions"
      >
        {data?.result?.map((x: any) => (
          <Dropdown.Item className="truncate" key={x.symbol}>
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

const QuantityInput = ({ onChange }: { onChange: any }) => {
  const [token, setToken] = useState<any>()
  const [price, setPrice] = useState<string>()

  const { data } = useImmutableToken()

  // set the initial token: ETH
  useEffect(() => {
    if (data?.result?.length) {
      setToken(data.result[0])
    }
  }, [data])

  useEffect(() => {
    const decimals = token?.decimals
    const currencyType = token?.symbol

    let quantity

    if (price && !isNaN(parseFloat(price))) {
      const float = parseFloat(price).toString()
      quantity = toBn(float, decimals).toString()
    }

    onChange &&
      onChange({
        quantity,
        decimals,
        currencyType,
      })
  }, [price, token])

  return (
    <Input
      animated={false}
      //bordered
      shadow={false}
      width="186px"
      label="Minimum Bid"
      type="text"
      placeholder="0.1"
      onChange={(e) => setPrice(e.target.value)}
      contentLeft={<TokensDropdown onChange={setToken} />}
    />
  )
}

const AuctionTypeDropdown = ({ onChange }: { onChange: any }) => {
  const [type, setType] = useState('english')
  return (
    <>
      <Text h2>Auction Type</Text>
      <Text small css={{ color: '#999' }}>
      English auction. Sell to the highest bidder: the highest bid wins at the end
      Ducth. Sell with a declining price: the price falls until someone purchases

      </Text>
      <Spacer />
      {/* <span className="mb-2 ml-1 text-sm">Auction type</span> */}
      <Dropdown disableAnimation isBordered>
        <Dropdown.Trigger>
          <Button
            light
            bordered
            animated={false}
            css={{ border: '2px solid #eee' }}
          >
            {type}
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu
          disabledKeys={[AuctionType.Dutch]}
          onAction={(e) => {
            setType(e as AuctionType)
            onChange && onChange(e)
          }}
          aria-label="Auction Type"
        >
          <Dropdown.Item key={AuctionType.English}>English</Dropdown.Item>
          <Dropdown.Item key={AuctionType.Dutch}>Dutch</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

import createAuction from 'utils/createAuction'

// const createAuction = async (payload: any) => {
//   const options = {
//     method: 'POST',
//     headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   }

//   let url = `${apiEndpoint}/auctions`
//   let res = await fetch(url, options)
//   let json = await res.json()
//   if (res.status !== 200) {
//     return { error: json }
//   }

//   return { data: json }
// }

const transferAndCreateAuction = async (req: CreateAuctionRequest) => {
  try {
    const {
      tokenType,
      tokenId,
      tokenAddress,
      toAddress,
      quantity,
      decimals,
      endAt,
      auctionType,
      currencyType,
    } = req
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

    let { data, error } = await createAuction({
      transferId,
      quantity: Number(quantity),
      decimals,
      endAt,
      tokenType: currencyType,
      type: auctionType,
    })

    console.log(data, error)

    if (error) {
      let { message } = error
      throw Error(message)
    }

    return { data }
  } catch (e) {
    console.error(`Failed to create auction`, e)
    return { error: e ?? `Failed to create auction` }
  } finally {
  }
}

const CreateAuctionContent = () => {
  const [loading, setLoading] = useState(false)
  const [endAt, setEndAt] = useState(
    new Date().toISOString()
  )
  const [pricing, setPricing] = useState<any>()
  const [auctionType, setAuctionType] = useState('english')
  const router = useRouter()
  const { tokenId, tokenAddress } = router.query

  const handleClick = useCallback(async () => {
    try {
      setLoading(true)

      const { quantity, decimals, currencyType } = pricing

      if (!endAt) {
        throw Error('Date and time required')
      }

      if (!tokenId) {
        throw Error('tokenId required')
      }

      if (!quantity) {
        throw Error('quantity required')
      }

      if (!decimals) {
        throw Error('decimals required')
      }

      if (!currencyType) {
        throw Error('currencyType required')
      }

      const { data: response, error } = await transferAndCreateAuction({
        tokenType: ERC721TokenType.ERC721,
        tokenId: tokenId as string,
        currencyType,
        tokenAddress: tokenAddress as string,
        toAddress: process.env.NEXT_PUBLIC_AUCTIONX_ADDRESS as string,
        auctionType: auctionType as AuctionType,
        quantity,
        decimals,
        endAt,
      })

      console.log(response, error)

      if (error) {
        throw Error((error as any).message)
      }

      toast.success('Auction created. Rediecting...')

      setTimeout(() => {
        router.push(`/auction/${response?.id}`)
      }, 3000)
    } catch (e) {
      console.error(e)
      toast.error((e as any).message)
    } finally {
      setLoading(false)
    }
  }, [endAt, pricing, tokenId, tokenAddress, auctionType])

  return (
    <div>
      <div>
        <Text h2>Pricing</Text>
        <Text small css={{ color: '#999' }}>
          The minimum amount you want to sell this asset.
        </Text>
        <Spacer />
        <QuantityInput onChange={setPricing} />
      </div>

      <Spacer />
      <Spacer />
      <div className="w-full border-b-[1px] border-slate-100"></div>
      <Spacer />
      <Spacer />

      <div>
        <Text h2>Ending time</Text>
        <Text small css={{ color: '#999' }}>
          The time this auction will end and no more bids will be accepted.
        </Text>
        <Spacer />
        <EndAt onChange={setEndAt} />
      </div>

      <Spacer />
      <Spacer />
      <div className="w-full border-b-[1px] border-slate-100"></div>
      <Spacer />
      <Spacer />

      <AuctionTypeDropdown onChange={setAuctionType} />

      <Spacer />
      <Spacer />
      <Spacer />

      <Button
        css={{ width: '100%' }}
        bordered
        color="success"
        auto
        onClick={handleClick}
      >
        {loading ? (
          <Loading type="spinner" color="currentColor" size="sm" />
        ) : (
          'Create Auction'
        )}
      </Button>
    </div>
  )
}
