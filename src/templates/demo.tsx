import React from 'react'
import { Document, Page, Text, Image, Canvas, View } from '@react-pdf/renderer'
import { gql } from "apollo-server-express"

export default () => ({
    typeDefs: gql`
        type Query {
            simple(name: String = "World"): TemplateResponse            
            canvas: TemplateResponse
        }
    `,
    docs: {
        simple: ({ name }) => {
            return <Document>
                <Page size="A4">
                    <Text>Hello, {name}!</Text>
                </Page>
            </Document>
        },
        canvas: () => {
            return <Document>
                <Page size="A5">
                    <View style={{ margin: 10 }}>
                        <Text>Draw stuff in a canvas</Text>
                        <Canvas style={{ width: 100, height: 100 }} paint={(doc: PDFKit.PDFDocument, width, height) => {
                            doc
                                .rect(0, 0, 90, 30)
                                .fill('#AAAA00')

                            return null
                        }} />
                    </View>
                </Page>
            </Document>
        }
    }
})
