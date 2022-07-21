export interface AuctionAsset {
  id: number
  internalId: string
  collection: Collection
  imageUrl: string
  name: string
  tokenId: string
}

export interface Collection {
  id: number
  address: string
  description?: string
  image?: string
  name: string
}

export interface AuctionBid {
  id: number
  status: string
  quantity: string
  owner: string
  createdAt: Date
}

export enum AuctionStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Filled = 'filled',
  Scheduled = 'scheduled',
}

export interface AuctionItem {
  id: number
  type: string
  status: AuctionStatus
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
  result: AuctionItem[]
  totalResults: number
}
