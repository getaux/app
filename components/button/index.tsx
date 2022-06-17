// import { Keyboard, Loading } from '@geist-ui/core'

const Button3 = ({
  icon,
  children,
  keyboard,
  loading = false,
  onClick,
  type,
  disabled = false,
  ...rest
}: {
  icon?: any
  children: any
  keyboard?: string
  loading?: boolean
  onClick?: any
  type?: string
  disabled?: boolean
}) => {
  let color = 'text-gray-800'

  if (disabled) {
    color = 'text-gray-500'
  }
  if (type === 'success') {
    color = 'text-gray-100'
  }

  return (
    <button
      onClick={(_) => {
        if (!disabled) {
          onClick && onClick()
        }
      }}
      className={` rounded-lg border bg-white px-3 py-1 text-sm shadow-sm transition-all  ${
        disabled ? 'cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50'
      } ${
        type === 'success'
          ? 'border-none bg-indigo-500 text-gray-100 hover:bg-indigo-700/90'
          : ''
      }`}
    >
      <div
        className={`flex flex h-6 w-32 items-center items-center justify-center ${color}`}
        {...rest}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
            {/* {keyboard && (
              <span className="ml-2">
                <Keyboard scale={1 / 3}>c</Keyboard>
              </span>
            )} */}
          </>
        )}
      </div>
    </button>
  )
}

export default Button3
