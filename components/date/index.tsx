import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function DatePicker(params: any) {
  return (
    <div>
      <style>{`
        .rdp { margin: 18px 12px; }
        .rdp-day_today:not(.rdp-day_outside) { background: #007AFF; color: #eee; border-radius: 8px; }
        .rdp-button:hover:not([disabled]) { background: #e9e9e9 }
        .rdp-button { border-radius: 8px; }
        .rdp-tbody .rdp-button:focus:not([disabled]), .rdp-button:active:not([disabled]) { background: #222; border: none; color: #eee }
        .rdp-caption_label { font-size: 16px; }
        .rdp svg { width: 13px; height: 13px; color: #333; }
        .rdp-head { color: #999; font: normal; font-weight: 500; }
        .rdp-day_today:hover:not(.rdp-day_outside) { background: #007AFF; color: #eee; border-radius: 8px; }
        .rdp-day { height: 30px; width: 35px; margin: 1px 1px; font-size: 14px; }
        .rdp-nav_button { height: 25px; width: 30px; }
        .rdp-nav .rdp-button:focus:not([disabled]) { border: none; background: #EFF0F3 }
        .rdp-nav .rdp-button:hover:not([disabled]) { border: none; background: #EFF0F3 }
        .rdp-button { border: none; }
        .rdp-day_selected:not([disabled]) { background: #111 }
      `}</style>
      <DayPicker {...params} />
    </div>
  )
}
