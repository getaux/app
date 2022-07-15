import { Avatar, Input } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { Dropdown } from '@nextui-org/react'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'
import { toBn } from 'evm-bn'

const useImmutableToken = () => {
  const { data, error } = useSWR(
    'https://api.ropsten.x.immutable.com/v1/tokens',
    fetcher
  )

  return { data, isLoading: !data && !error }
}

const PricingInput = ({ onChange }: { onChange: any }) => {
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

    // let quantity

    // if (price && !isNaN(parseFloat(price))) {
    //   const float = parseFloat(price).toString()
    //   quantity = toBn(float, decimals).toString()
    // }

    onChange &&
      onChange({
        decimals,
        amount: price,
        currencyType,
      })
  }, [price, token])

  return (
    <Input
      animated={false}
      shadow={false}
      width={'100%'}
      autoFocus
      //label="Minimum Bid"
      type="text"
      placeholder="0.1"
      onChange={(e) => setPrice(e.target.value)}
      contentLeft={<TokensDropdown onChange={setToken} />}
    />
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
        disabledKeys={data?.result?.filter((x: any) => x.symbol !== 'ETH').map((x: any) => x.symbol)}
        //disabledKeys={['ETH']}
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

export default PricingInput
