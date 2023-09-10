import { MutationResolvers } from '../../../../generated/graphql'
import forgotPasswordResolver from './user/forgotPassword.resolver'
import loginResolver from './user/login.resolver'
import refreshAccessTokenResolver from './user/refreshAccessToken.resolver'
import registerResolver from './user/register.resolver'
import resetPasswordResolver from './user/resetPassword.resolver'
import updateUserResolver from './user/updateUser.resolver'
import verifyAccountResolver from './user/verifyAccount.resolver'
import verifyResetPasswordResolver from './user/verifyResetPasswordToken.resolver'

const mutations: MutationResolvers ={
    register: registerResolver,
    login: loginResolver,
    forgotPassword: forgotPasswordResolver,
    resetPassword: resetPasswordResolver,
    verifyResetPassword: verifyResetPasswordResolver,
    refreshAccessToken: refreshAccessTokenResolver,
    verifyAccount: verifyAccountResolver,
    updateUser: updateUserResolver,
}

export default mutations
