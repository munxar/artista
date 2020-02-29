import React from 'react'
import ReactPDF from '@react-pdf/renderer'
import gm from 'gm'
import { docs } from './schema'
import { url } from './environment'

export const renderTemplateStream = async ({ id, args }, { format, width }) => {
    const doc = docs.find(doc => doc.id === id)
    if (!doc) {
        return
    }
    let stream = await ReactPDF.renderToStream(<doc.doc {...args} />) as any
    if (format !== 'pdf') {
        stream = gm(stream).resize(width).stream(format)
    }
    return stream
}

export const renderTemplateData = async ({ id, args }, { format, width }) => {
    const stream = await renderTemplateStream({ id, args }, { format, width })
    const data = await streamToBase64(stream)
    return `data:${toMimeType(format)};base64,${data}`
}

export const renderTemplateLink = async ({ id, args }, { format, width }) => {
    const query = Object.entries(args).map(([key, value]) => `${key}=${value}`).join('&')
    let path = url(`/${id}.${format}`)
    if (width) {
        path += `/${width}`
    }
    if (query) {
        path += `?${query}`
    }
    return path
}

async function streamToBase64(stream?: NodeJS.ReadableStream) {
    const buffer: any[] = []
    if (!stream) {
        return ''
    }
    for await (const chunk of stream) {
        buffer.push(chunk)
    }
    return Buffer.concat(buffer).toString('base64')
}

function toMimeType(format: string) {
    return format === 'pdf' ? 'application/pdf' : `image/${format}`
}
