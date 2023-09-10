import envs from '../../config/envs'

export const forgotPasswordMailTemplate = (firstName: string, token: string) => `
    <div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
        <p>Hi <span class="intercom-interblocks-template" data-template-identifier="first_name" data-template-fallback="there">${firstName}</span>,
        <br><br>We have received a password reset request from your account. Your password reset link is. &nbsp;</p>
    </div>

    <div class="intercom-interblocks-button intercom-interblocks-align-left">
        <a href="${envs.hosts.client}/change-password/${token}" target="_blank" rel="noreferrer nofollow noopener" class="intercom-h2b-button">
            Reset Password
        </a>
    </div>

    <div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
        <p>
            Please note that this link is only valid for 30 minutes.
        </p>
    </div>
`

export const resetPasswordMailTemplate = (firstName: string) => `
    <div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
        <p>Hi <span class="intercom-interblocks-template" data-template-identifier="first_name" data-template-fallback="there">${firstName}</span>,
    </div>

    <div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
        <p>
            Your password has been successfully changed.
        </p>
    </div>
    <br />

    <div class="intercom-interblocks-button intercom-interblocks-align-left">
        <a href="${envs.hosts.client}/signin" target="_blank" rel="noreferrer nofollow noopener" class="intercom-h2b-button">
            Login
        </a>
    </div>
`
