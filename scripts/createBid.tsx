import createBid from 'utils/createBid'
;(async () => {
  const { error, data } = await createBid({
    transferId: '4789686',
    auctionId: 62,
    endAt: ''
  })
  if (error) {
    return console.log(error)
  }
  console.log(data)
})()
