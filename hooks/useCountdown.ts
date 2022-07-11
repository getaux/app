import { useState, useEffect } from 'react'
import { intervalToDuration, isValid } from 'date-fns'

const useCountdown = (initialDate: Date) => {
  const [remaining, setRemaining] = useState<any>()

  useEffect(() => {
    const pastDate = new Date(initialDate).getTime() < new Date().getTime()

    if (
      isValid(initialDate) &&
      !pastDate &&
      new Date(initialDate).getTime() - new Date().getTime() > 0
    ) {
      let id = setInterval(() => {
        let duration = intervalToDuration({
          start: new Date(),
          end: new Date(initialDate),
        })

        setRemaining(duration)
      }, 1000)

      return () => clearInterval(id)
    } else {
      setRemaining(null)
    }
  }, [initialDate])

  return { remaining }
}

export default useCountdown
