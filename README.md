## GitLogger ##

#### Purpose ####
The purpose of this package is to allow for better issue tracking of errors on your applications. Whenever an error occurs on either the `client` or the `server` it will be added to your repository as an issue. This package works with both public and private repositories on `github`.

#### Getting Started ####
**Add the Package**
`meteor add patrickml:git-logger`

**Create a Github AuthToken**
An auth token is needed so your application can post on your behalf. In order to make one go to this [link](https://github.com/settings/tokens/new?description=GitLogger). Don't worry you don't need to give it extensive rights. Just keep the original ones that are checked.

**Configure your `settings.json`**
```json
{
  "github" : {
    "token" : "YOUR_TOKEN",
    "user" : "YOUR_USERNAME",
    "repo" : "YOUR_REPO"
  }
}
```

After this point you are good to go all errors will be added to your github repository! Just know any issues from the client side will be grouped together if they happen right after eachother. This is because on the client things continue where on the server it crashes.

### Things to note ###
`GitLogger` makes multiple API calls it makes one to search for an existing `open` issues and if it finds one it will `comment` on the issue instead of creating a duplicate. So this means if you have closed the issue and it comes back up again you will have a new issue created.

Also errors thrown from the developer console will not show up on github they have to come from the live code.

#### Client Side Issue ####

**User Agent**
```
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"
```

**Message**
```
TriggeredError is not defined
```
**Stack Trace**
```
ReferenceError: TriggeredError is not defined
    at Object._.extend.triggerError (http://localhost:3000/packages/patrickml_errors-to-github-issue.js?3d681a9bc57415dc2f50e3803745e8ae91a5582b:57:5)
    at Object.Template.hello.events.click button (http://localhost:3000/app/demo.js?c58eee5cae6842b569c41f240ddcc2dd0a093fe3:23:17)
    at http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:3697:20
    at Function.Template._withTemplateInstanceFunc (http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:3671:12)
    at null.<anonymous> (http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:3696:25)
    at http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:2557:30
    at Object.Blaze._withCurrentView (http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:2211:12)
    at null.<anonymous> (http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:2556:26)
    at HTMLButtonElement.<anonymous> (http://localhost:3000/packages/blaze.js?9391df93ba5076c2cfc61ee68724eb79b65f00d9:833:24)
    at HTMLBodyElement.jQuery.event.dispatch (http://localhost:3000/packages/jquery.js?1015953f785c9b76503e2ecb391507dce965f357:4691:9)
```
**URL**
```
http://localhost:3000/
```
