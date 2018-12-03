export const pageHead = (render, model, req) => render(model, ':pagehead')`
<!DOCTYPE html>
<html class="no-js">
<head>
    <link media="all" rel="stylesheet" href="/static/styles/app.css">
    <title>Rebus Reader</title>
    <script src="/js/document-register-element.js"></script>
    <script src="/js/swup.min.js"></script>
    <script src="/components/page-transitions.js" type="module"></script>
    <script src="/components/nav-menu-toggle.js" type="module"></script>
    <meta name="jwt-meta" content="${req.user.token}">
    <meta name="rebus-user-id" content="${req.user.id}">
    <link href="${req.user.streams.outbox}" rel="rebus-outbox">
    <link href="${req.user.streams.upload}" rel="rebus-upload">
</head>
<body>`
