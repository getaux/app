import { Usdc, Gods, Eth, Omi } from 'components/icons'

function getPriceIcon(type: string, size?: string) {
  if (!size) {
    size = '20'
  }
  let icon: any
  switch (type) {
    case 'ETH':
      icon = <Eth size={size} />
      break
    case 'USDC':
      icon = <Usdc size={size} color="black" />
      break
    case 'OMI':
      icon = <Omi size={size} color="black" />
      break
    case 'GODS':
      icon = <Gods size={size} color="black" />
      break
    case 'GOG':
      icon = <Omi size={size} color="black" />
      break
    default:
      break
  }

  return icon
}

export default getPriceIcon
