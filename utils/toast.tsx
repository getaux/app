import { createToast } from 'vercel-toast'
import 'vercel-toast/dist/vercel-toast.css'

// const toast = (params: any, opts: any) => {
//   createToast(params, opts)
// }

export const error = (msg: string, params?: any) => {
  if (!msg) return
  createToast(msg, { type: 'error', timeout: 8000, ...params })
}

export const success = (msg: string, params?: any) => {
  if (!msg) return
  createToast(msg, { type: 'success', timeout: 8000, ...params })
}

export default {
  error,
  success,
}
