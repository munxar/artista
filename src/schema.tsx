import { join } from 'path'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import { IResolvers, gql } from 'apollo-server-express'
import { renderTemplateData, renderTemplateLink } from './render'

const templates = fileLoader(join(__dirname, 'templates'))

const { allResolvers, allTypeDefs, allDocs } = templates.reduce((obj, template) => {
    const { resolvers, typeDefs, docs } = template()
    if (resolvers) {
        obj.allResolvers.push(resolvers)
    }
    if (typeDefs) {
        obj.allTypeDefs.push(typeDefs)
    }
    if (docs) {
        Object.entries(docs).forEach(([id, doc]) => obj.allDocs.push({ id, doc }))
    }
    return obj
}, { allResolvers: [], allTypeDefs: [], allDocs: [] })

const docResolvers = allDocs.map(({ id }) => ({
    Query: { [id]: (_, args) => ({ id, args }) }
}))

const baseTypeDefs = gql`
    enum Format {
        pdf
        jpg
        png
        webp
        gif
    }
    type TemplateResponse {
        link(format: Format = pdf, width: Int): String!
        data(format: Format = pdf, width: Int): String!                
    }           
    type Query {
        _dummy: String
    }             
`
const baseResolvers = {
    TemplateResponse: {
        link: renderTemplateLink,
        data: renderTemplateData,
    }
}

export const resolvers = mergeResolvers([...docResolvers, ...allResolvers, baseResolvers]) as IResolvers
export const typeDefs = mergeTypes([...allTypeDefs, baseTypeDefs], { all: true })
export const docs = allDocs
