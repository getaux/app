import { Expired, InProgress, Cancelled, Done } from 'components/icons'

export const getStatusIcon = (type: string) => {
  let icon
  switch (type) {
    case 'expired':
      icon = (() => <Expired />)()
      break
    case 'active':
      icon = <InProgress />
      break
    case 'cancelled':
      icon = <Cancelled />
      break
    case 'filled':
      icon = <Done />
      break
    default:
      break
  }

  return icon
}
export default getStatusIcon
