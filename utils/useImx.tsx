import { createContext, useContext } from 'react'
import { useState, useCallback, useEffect } from 'react'
import { Link } from '@imtbl/imx-sdk'

export const ImxContext = createContext(null)
export const link = new Link(
  process.env.NEXT_PUBLIC_NETWORK === 'ropsten'
    ? 'https://link.ropsten.x.immutable.com'
    : 'https://link.x.immutable.com'
)

export const ImxContextProvider = (props: any) => {
  const [user, setUser] = useState<string | null>()

  const connect = useCallback(() => {
    if (window != undefined) {
      const run = async () => {
        const { address } = await link.setup({})
        if (address) {
          localStorage.setItem('address', address)
          setUser(address.toLowerCase())
        } else {
          console.error('Failed to get addres from link.setup')
        }
      }
      run()
    }
  }, [user])

  const disconnect = useCallback(() => {
    if (window != undefined) {
      setUser(null)
      localStorage.removeItem('address')
    }
  }, [user])

  useEffect(() => {
    if (window != undefined) {
      let address = localStorage.getItem('address')
      if (address) {
        setUser(address)
      }
    }
  }, [])

  const value = {
    connect,
    disconnect,
    user,
  }

  return <ImxContext.Provider value={value} {...props} />
}

export const useImx = () => {
  const context = useContext(ImxContext)
  if (context === undefined) {
    throw new Error(`useImx must be used within a ImxContextProvider.`)
  }
  return context
}
