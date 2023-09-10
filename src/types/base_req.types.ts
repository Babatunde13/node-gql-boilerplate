import { Request, Response } from 'express'
import { IUser } from '../models/user.model'

export interface Context {
    user?: IUser
}

export interface AuthContext {
    user: IUser
}

export interface ParentType {
    [key: string]: unknown
}

export interface BaseReq extends Request, Context {}

export interface Application {
    req: BaseReq
    res: Response
}
