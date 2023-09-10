const baseTemplate = (content: string) => `
<html>
    <head>
    <style disabled="" type="text/css">
        
    </style>

    <base target="_blank">
    </head>
    <body style="width: 100%; height: 100%; background-color: #f9f9f9;" data-new-gr-c-s-check-loaded="14.1056.0" data-gr-ext-installed="">
    ${content}
    </body>
    <grammarly-desktop-integration data-grammarly-shadow-root="true"></grammarly-desktop-integration>
</html>
`

export default baseTemplate
