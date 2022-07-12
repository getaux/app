import axios from 'axios'
import axiosRetry from 'axios-retry'

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

const createBid = async (body: {
  transferId: string
  auctionId: number
  endAt: string
}): Promise<ApiResponse> => {
  return axios
    .post('https://getaux-staging.imxrarity.io/v1/bids', body)
    .then((response) => {
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

export default createBid
