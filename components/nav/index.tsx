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
    <div className="z-100 border-2 border-b border-gray-50">
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
                <Avatar size={'sm'} src={'/1.jpg'} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={5}>
                <Link href={'/account'}>
                  <DropdownMenuItem>My aseets: {prettyHex(user)}</DropdownMenuItem>
                </Link>
                <Link href={'/account'}>
                  <DropdownMenuItem>My bids</DropdownMenuItem>
                </Link>
                <Link href={'/account'}>
                  <DropdownMenuItem>My auctions</DropdownMenuItem>
                </Link>
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
                Conect
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav
