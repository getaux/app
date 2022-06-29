import * as PopoverPrimitive from '@radix-ui/react-popover'
import { styled, keyframes } from '@stitches/react'

const scaleIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.97)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
})

const StyledContent = styled(PopoverPrimitive.Content, {
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: '8px',
  boxShadow: 'rgb(0 0 0 / 5%) 0px 5px 10px',
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  animation: `${scaleIn} 0.1s ease`,
})

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverContent = StyledContent
