import { gql } from 'apollo-server'
import { readFileSync } from 'fs'

const mutations = readFileSync(`${process.cwd()}/src/graphql/schema/mutation.gql`).toString('utf-8')
const queries = readFileSync(`${process.cwd()}/src/graphql/schema/query.gql`).toString('utf-8')
const types = readFileSync(`${process.cwd()}/src/graphql/schema/types.gql`).toString('utf-8')
const enum_ = readFileSync(`${process.cwd()}/src/graphql/schema/enum.gql`).toString('utf-8')
const input = readFileSync(`${process.cwd()}/src/graphql/schema/input.gql`).toString('utf-8')

export default gql`
    ${types}
    ${mutations}
    ${queries}
    ${enum_}
    ${input}
`
