import toast from 'utils/toast'
import { Button, Loading } from '@nextui-org/react'

import useCancel from 'hooks/useCancel'

const CancelAuctionButton = ({ id }: { id: string }) => {
  const { cancel, isLoading } = useCancel(id)

  return (
    <Button
      bordered
      color="error"
      auto
      onClick={async (_) => {
        let { error } = await cancel()

        if (error) {
          return toast.error((error as any)?.message)
        }

        toast.success('Auction cancelled!')
      }}
    >
      {isLoading ? (
        <Loading type="spinner" color="currentColor" size="sm" />
      ) : (
        'Cancel Auction'
      )}
    </Button>
  )
}

export default CancelAuctionButton
