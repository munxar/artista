import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT || 4000
export const host = process.env.HOST || '127.0.0.1'
export const protocol = process.env.PROTOCOL || 'http'
export const url = path => `${protocol}://${host}:${port}${path}`
