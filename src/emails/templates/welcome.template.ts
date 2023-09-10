import envs from '../../config/envs'

export default function welcomeMailTemplate (firstName: string, token: string) {
    return ` <div class="intercom-interblocks-image intercom-interblocks-align-left">
    <a href="https://downloads.intercomcdn.com/i/o/498170793/af68a4d119556a7a1ba153de/Large+%281500+x+750%29+copy.jpg" target="_blank" rel="noreferrer nofollow noopener">
        <img src="https://downloads.intercomcdn.com/i/o/498170793/af68a4d119556a7a1ba153de/Large+%281500+x+750%29+copy.jpg" alt="Header Image" width="1501" height="501">
    </a>
</div>

<div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
    <p>Hey <span class="intercom-interblocks-template" data-template-identifier="first_name" data-template-fallback="there">${firstName}</span>,
    <br><br>In order to complete your account, we need to verify your email address. Simply click on the link below to confirm your account.&nbsp;</p>
</div>

<div class="intercom-interblocks-button intercom-interblocks-align-left">
    <a href="${envs.hosts.client}/verified/${token}" target="_blank" rel="noreferrer nofollow noopener" class="intercom-h2b-button">
        Verify Account
    </a>
</div>

<div class="intercom-interblocks-paragraph intercom-interblocks-align-left">
    <p></p>
</div>`
}
