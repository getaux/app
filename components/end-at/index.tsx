import { Popover, PopoverTrigger, PopoverContent } from 'components/popover'
import DatePicker from 'components/date'
import { useState, useEffect } from 'react'
import format from 'date-fns/format'
import Calendar from '@geist-ui/icons/calendar'
import Clock from '@geist-ui/icons/clock'
import { PopoverClose } from '@radix-ui/react-popover'
import { parse, intervalToDuration } from 'date-fns'

const CalendarPopover = ({
  onChange,
  initialDate,
}: {
  onChange: any
  initialDate: any
}) => {
  const [expiry, setExpiry] = useState(initialDate || new Date())
  const [open, setOpen] = useState<boolean>(false)
  const [isFocued, setIsFocused] = useState<boolean>(false)

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <button
          onClick={(_) => {
            setOpen((p) => !p)
            setIsFocused(true)
          }}
          className={`flex flex items-center space-x-2 rounded border border-white px-2 py-1 text-sm transition-all hover:border-gray-200 ${
            isFocued ? 'bg-gray-100' : ''
          }`}
        >
          <Calendar color={'#666'} size={'18'} />
          <span>{expiry && format(expiry, 'dd/MM/yyyy')}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          setOpen(false)
          setIsFocused(false)
        }}
        onPointerDownOutside={(e) => {
          setOpen(false)
          setIsFocused(false)
        }}
        sideOffset={10}
        align={'start'}
        style={{ background: '#EFF0F3' }}
      >
        <DatePicker
          mode="single"
          selected={expiry}
          onSelect={(e: any) => {
            setExpiry(e)
            setOpen(false)
            setIsFocused(false)
            e && onChange && onChange(format(new Date(e), 'yyyy-MM-dd'))
          }}
          disabled={[{ before: new Date() }]}
        />
      </PopoverContent>
    </Popover>
  )
}

const TimePopover = ({
  onChange,
  initialTime,
}: {
  onChange: any
  initialTime: string
}) => {
  const [time, setTime] = useState(initialTime || times[0])
  const [open, setOpen] = useState<boolean>(false)
  const [isFocued, setIsFocused] = useState<boolean>(false)
  return (
    <Popover open={open}>
      <PopoverTrigger>
        <button
          onClick={(_) => {
            setOpen((p) => !p)
            console.log(open)
            setIsFocused(true)
          }}
          className={`flex flex items-center space-x-2 rounded border border-white px-2 py-1 text-sm transition-all hover:border-gray-200 ${
            isFocued ? 'bg-gray-100' : ''
          }`}
        >
          <Clock color={'#666'} size={'18'} />
          <span>{time}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          setOpen(false)
          setIsFocused(false)
        }}
        onPointerDownOutside={(e) => {
          setOpen(false)
          setIsFocused(false)
        }}
        sideOffset={10}
        align={'start'}
        style={{ background: '#EFF0F3' }}
      >
        <div className="flex h-64 flex-col overflow-auto p-1 py-1 text-left text-sm">
          {times.map((x) => (
            <PopoverClose style={{ width: '200px' }}>
              <div
                key={x}
                onClick={(_) => {
                  setTime(x)
                  setOpen(false)
                  setIsFocused(false)
                  onChange(x)
                }}
                className={`w-44 rounded py-1 pl-4 text-left text-gray-700 hover:bg-gray-200 hover:text-gray-900 ${
                  x === time ? 'bg-gray-100' : ''
                }`}
              >
                {x}
              </div>
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const EndAt = ({ onChange }: { onChange: any }) => {
  const [time, setTime] = useState(times[0])
  const [date, setDate] = useState()
  const [until, setUntil] = useState<any>()

  useEffect(() => {
    if (date && time) {
      console.log(date, time)
      onChange && onChange(new Date(`${date} ${time}`))
    }
  }, [time, date])

  return (
    <div className="flex items-center space-x-2">
      <CalendarPopover onChange={setDate} />
      <TimePopover onChange={setTime} />
      {until && (
        <div className="flex space-x-1 text-xs text-gray-500">
          <span>{until?.days}d</span>
          <span>{until?.hours}h</span>
        </div>
      )}
    </div>
  )
}

export default EndAt

const times = [
  '12:00 AM',
  '12:15 AM',
  '12:30 AM',
  '12:45 AM',
  '1:00 AM',
  '1:15 AM',
  '1:30 AM',
  '1:45 AM',
  '2:00 AM',
  '2:15 AM',
  '2:30 AM',
  '2:45 AM',
  '3:00 AM',
  '3:15 AM',
  '3:30 AM',
  '3:45 AM',
  '4:00 AM',
  '4:15 AM',
  '4:30 AM',
  '4:45 AM',
  '5:00 AM',
  '5:15 AM',
  '5:30 AM',
  '5:45 AM',
  '6:00 AM',
  '6:15 AM',
  '6:30 AM',
  '6:45 AM',
  '7:00 AM',
  '7:15 AM',
  '7:30 AM',
  '7:45 AM',
  '8:00 AM',
  '8:15 AM',
  '8:30 AM',
  '8:45 AM',
  '9:00 AM',
  '9:15 AM',
  '9:30 AM',
  '9:45 AM',
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '11:30 AM',
  '11:45 AM',
  '12:00 PM',
  '12:15 PM',
  '12:30 PM',
  '12:45 PM',
  '1:00 PM',
  '1:15 PM',
  '1:30 PM',
  '1:45 PM',
  '2:00 PM',
  '2:15 PM',
  '2:30 PM',
  '2:45 PM',
  '3:00 PM',
  '3:15 PM',
  '3:30 PM',
  '3:45 PM',
  '4:00 PM',
  '4:15 PM',
  '4:30 PM',
  '4:45 PM',
  '5:00 PM',
  '5:15 PM',
  '5:30 PM',
  '5:45 PM',
  '6:00 PM',
  '6:15 PM',
  '6:30 PM',
  '6:45 PM',
  '7:00 PM',
  '7:15 PM',
  '7:30 PM',
  '7:45 PM',
  '8:00 PM',
  '8:15 PM',
  '8:30 PM',
  '8:45 PM',
  '9:00 PM',
  '9:15 PM',
  '9:30 PM',
  '9:45 PM',
  '10:00 PM',
  '10:15 PM',
  '10:30 PM',
  '10:45 PM',
  '11:00 PM',
  '11:15 PM',
  '11:30 PM',
  '11:45 PM',
]
