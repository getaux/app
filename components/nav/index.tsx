import { Avatar, Button } from '@nextui-org/react'
import { Logo, Gradient } from 'components/icons'
import Link from 'next/link'
import { useImx } from 'utils/useImx'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'components/dropdown'
import prettyHex from 'utils/prettyHex'

const Nav = () => {
  // @ts-expect-error
  const { user, disconnect, connect } = useImx()
  return (
    <nav className="z-50 border-2 border-b border-gray-50 border-b-2 backdrop-blur sticky top-0">

      {process.env.NEXT_PUBLIC_NETWORK === 'ropsten' ? (
        <div className="mx-auto flex items-center justify-center border-b-2 text-neutral-500 text-sm py-2">
            You're browsing our ropsten app
        </div>
      ) : ('')}

      <div className="mx-auto max-w-4xl">
        <div className="flex w-full items-center justify-between p-4">
          <Link href={'/'}>
            <a>
              <Logo />
            </a>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar size={'sm'} src={'/1.jpg'} pointer />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={5}>
                <Link href={'/account'}>
                  <DropdownMenuItem>My assets: {prettyHex(user)}</DropdownMenuItem>
                </Link>
                {/* <Link href={'/account'}>
                  <DropdownMenuItem>My bids</DropdownMenuItem>
                </Link>
                <Link href={'/account'}>
                  <DropdownMenuItem>My auctions</DropdownMenuItem>
                </Link> */}
                <DropdownMenuSeparator />
                <a onClick={(_) => disconnect()}>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="z-100">
              <Button
                bordered
                size={'sm'}
                onClick={(e) => connect()}
                // @ts-expect-error
                type={'success'}
              >
                Connect
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
