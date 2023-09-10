import mailgun from 'mailgun-js'
import envs from '../config/envs'
import AppError from '../libs/error'
import logger from '../libs/logger'
import baseTemplate from './templates/base.template'

interface MailgunData {
    from: string
    to: string
    subject: string
    html: string
    'o:deliverytime'?: string
}

interface ISendMail {
    email: string
    subject: string
    content: string
    from?: string
    sendDate?: Date
}

export const sendMail = async ({ email, subject, content, from, sendDate }: ISendMail) => {
    if (envs.isTest) {
        return { data: 'Email sent' }
    }

    if (!from) {
        from = envs.mail.from
    }

    const data: MailgunData = {
        from,
        to: email,
        subject,
        html: baseTemplate(content)
    }
    if (sendDate) {
        data['o:deliverytime'] = new Date(sendDate).toUTCString().replace('GMT', '+0000')
    }

    try {
        const mg = mailgun({
            apiKey: envs.mail.apiKey,
            domain: envs.mail.domain
        })
        const resp = await mg.messages().send(data)
        return {
            data: resp
        }
    } catch (err) {
        const error = new AppError({
            message: 'Error sending email',
            type: 'EMAIL_SENDING_ERROR',
            metadata: {
                error: (err as Error).message
            }
        })
        logger.error('Error sending email', error)
        return { error }
    }
}
