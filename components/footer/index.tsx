import { Logo } from "../icons";
import Link from 'next/link'

const Footer = () => {
  return (
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-16">
          <div className="px-2 py-4 lg:px-20 lg:py-12">
              <div className="flex flex-col gap-10">
                  <div className="flex items-start">
                      <div className="flex flex-col mr-14"><p>Quick links</p>
                          <div className="cursor-pointer"><small>Lorem Ipsum</small></div>
                          <div className="cursor-pointer"><small>Lorem Ipsum 2</small></div>
                          <div className="cursor-pointer"><small>Lorem Ipsum 3</small></div>
                      </div>
                      <div className="flex flex-col mb-8"><p>Resources</p>
                          <div className="cursor-pointer"><small>API Documentation</small></div>
                          <div className="cursor-pointer"><small>GitHub</small></div>
                          <div className="cursor-pointer"><small>Lorem Ipsum 2</small></div>
                      </div>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 cursor-pointer">
                          <div className="flex items-center">
                              <Link href={'/'}>
                                  <a>
                                      <Logo />
                                  </a>
                              </Link>
                              <p className="mx my font font-bold">AuctionX</p>
                          </div>
                      </div>
                      <div className="flex items-center ml-2">
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Footer
