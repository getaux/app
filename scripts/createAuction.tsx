import CurrencyType from 'types/currencyType'
import createAuction from 'utils/createAuction'

enum AuctionType {
  English = 'english',
  Dutch = 'dutch',
}

;(async () => {
  const currencyType = CurrencyType.ETH
  const auctionType = AuctionType.English

  const { error, data } = await createAuction({
    transferId: 5,
    quantity: 10000000000000000,
    decimals: 18,
    endAt: new Date().toISOString(),
    tokenType: currencyType,
    type: auctionType,
  })
  console.log(3)
  if (error) {
    return console.log(error)
  }
  console.log(data)
})()
