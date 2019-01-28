# API/Front End Integration

Currently the front end adds the api server as an Express app endpoint to the front end server.

This was originally to get around performance implications of hosting on a separate domain.

Since all `GET` requests are now made server side for progressive enhancement, this has become less pressing than I expected.

So, it would make sense to migrate towards only communicating with the API via HTTP.

The potential downside to this is that prevents us from potentially optimising performance by consuming the DB models directly and skipping the HTTP request entirely but that path is fraught with potential compatibility and documentation pitfalls anyway.
