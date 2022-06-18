import { Logo, Gradient } from 'components/icons'
import Link from 'next/link'

const Nav = () => (
  <div className="border-2 border-b border-gray-50">
    <div className="mx-auto max-w-4xl">
      <div className="p-4">
        <Link href={'/'}>
          <a>
            <Logo />
          </a>
        </Link>
      </div>
    </div>
  </div>
)

export default Nav
