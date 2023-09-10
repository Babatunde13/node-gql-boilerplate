import { Schema, Document } from 'mongoose'

export interface BaseModelClient {
    _id: string
    active: boolean
    metadata: object
    created: string
    updated: string
}

export interface BaseModelServer extends Document {
    _id: Schema.Types.ObjectId
    active: boolean
    metadata: object
    created: Date
    updated: Date
}
