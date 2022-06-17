export interface AuctionAsset {
  id: number
  internalId: string
  tokenAddress: string
  imageUrl: string
  name: string
  tokenId: string
}

export interface AuctionBid {
  id: number
  status: string
  quantity: string
  owner: string
  createdAt: Date
}

export interface AuctionResult {
  id: number
  type: string
  status: string
  transferId: string
  quantity: string
  decimals: number
  tokenType: string
  owner: string
  asset: AuctionAsset
  bids: AuctionBid[]
  createdAt: Date
  endAt: Date
}

export interface AuctionResponse {
  result: AuctionResult[]
  totalResults: number
}
