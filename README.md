# artista 
a service for generating pdf documents and rasterizing them as images.
it uses graphql as api, react-pdf as pdf generation and gm (graphics magic binding) for image generation.

## requirements
if you only intent to generate PDFs, only node > 12 is required. For image generation a installation of graphics magic and ghostscript is required (see gm documentation)

## installation
- clone repo
- cd into folder
- yarn or npm i

## run endpoint in development mode
- yarn dev

## build and run in production
- yarn build
- yarn start

## how to use it

to generate a template, just place a file (with any name) directly under the src/templates folder.
it must be a .tsx file to be handled correctly by typescript.

The file must default export a function that returns at least two things:
A graphql query definitions named typeDefs and a react-pdf documents names docs.

```typescript
import React from 'react'
import { Document, Page, Text } from '@react-pdf/renderer'

export default () => {
    return {
        // grpahql definition
        // 
        typeDefs: {
            Query {
                myDoc(title: String): TemplateResponse
            }        
        },
        // document definition
        docs: {
            myDoc: ({ title }) => {
                return <Document>
                    <Page>
                        <Text>{title}</Text>
                    </Page>
                </Document>
            }
        }
    }
}
```
