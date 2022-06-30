import axios from 'axios'
import axiosRetry from 'axios-retry'
import CurrencyType from 'types/currencyType'

axiosRetry(axios, {
  retryDelay: axiosRetry.exponentialDelay,
  retries: 10,
  retryCondition: (error) => {
    return error?.response?.status === 404
  },
})

type ApiResponse = {
  data?: any
  error?: {
    message: string
    statusCode: number
  }
}

enum AuctionType {
  English = 'english',
  Dutch = 'dutch',
}

type CreateAuctionRequest = {
  transferId: number
  quantity: number
  decimals: number
  endAt: string
  type: AuctionType
  tokenType: CurrencyType
}

const createAuction = async (
  body: CreateAuctionRequest
): Promise<ApiResponse> => {
  return axios
    .post('https://getaux-staging.imxrarity.io/v1/auctions', body)
    .then((response) => {
      console.log(1)
      return { data: response.data }
    })
    .catch((error) => {
      const { status, statusText } = error.response
      const { data } = error.response
      const { error: apiError, code } = data
      return {
        error: { message: apiError, statusCode: status },
      }
    })
}

export default createAuction
