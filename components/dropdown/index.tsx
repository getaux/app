import React from 'react'
import { styled, keyframes } from '@stitches/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

const scaleIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.97)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
})

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 200,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: '5px 0',
  transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
  animation: `${scaleIn} 0.075s ease-in-out forwards`,
  boxShadow: 'rgb(0 0 0 / 9%) 0px 3px 12px',
})

const itemStyles = {
  all: 'unset',
  fontSize: 13,
  lineHeight: 1,
  color: '#333',
  //borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 30,
  padding: '0 12px',
  position: 'relative',
  //paddingLeft: 25,
  userSelect: 'none',

  '&[data-disabled]': {
    color: '#999',
    pointerEvents: 'none',
  },

  '&:focus': {
    backgroundColor: '#f8f9fb',
    // color: violet.violet1,
  },
}

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles })

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: '#eee',
  margin: '5px 0',
})

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = StyledContent
export const DropdownMenuItem = StyledItem
export const DropdownMenuSeparator = StyledSeparator

export const DropdownMenuDemo = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        hey
        {/* <HamburgerMenuIcon /> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuItem>New Tab</DropdownMenuItem>
        <DropdownMenuItem>New Window</DropdownMenuItem>
        <DropdownMenuItem disabled>New Private Window</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuDemo
