import envs from '../../config/envs'

export default function verifyAccountMailTemplate (name: string, token: string) {
    return `
    Hello ${name},

    Your account has not been verified yet. Please click on the link below to verify your account.

    ${envs.hosts.client}/verify-account/${token}
`
}
