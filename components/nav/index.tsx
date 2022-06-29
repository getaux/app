import { Avatar, Button } from '@nextui-org/react'
import { Logo, Gradient } from 'components/icons'
import Link from 'next/link'
import { useImx } from 'utils/useImx'

const Nav = () => {
  const { user } = useImx()
  return (
    <div className="border-2 border-b border-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="flex w-full items-center justify-between p-4">
          <Link href={'/'}>
            <a>
              <Logo />
            </a>
          </Link>

          {user ? (
            <Avatar size={'sm'} src={'/1.jpg'} />
          ) : (
            <Button>Connect</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav
