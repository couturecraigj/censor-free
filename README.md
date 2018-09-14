# censor-free

What could possibly go wrong

Imagine something that allows you to find friends post anything and have certain filters to protect prying eyes.

## Why?

I am not alone in hating that people are being censored just because they have a certain point of view.

## TODOs

- Setup backend for posts
  - Videos
  - Pictures
  - Links
  - Reviews
  - Comments
  - Stories
- Create a walk-through that makes people provide filters to their content like who can view it
- Allow users to link to Patreon
- Build a Patreon for this site
- Allow users to link to YouTube
- Allow Users to link to Twitter
- Allow users to link to Facebook
- Allow users to link to DeviantArt
- Allow users to link to LinkedIn
- Allow users to link to Tumblr
- Allow users to link to Picasa
- Allow users to link to Flickr
- Allow users to link to Google+
- Allow users to link to Instagram
- Allow users to link to Pinterest
- Allow users to link multiple email addresses
- Allow users to link to websites
- Allow users to flag content for review
  - Nudity
  - Sex
  - Violence
  - Guns/Weapons
  - Frightening
  - Gross
  - Smoking
  - Drugs/Alcohol
  - Language
- Allow Users to give a rating on content using video game system
- Allow users to build a profile about themselves
  - Allow a main pic
  - Allow a displayName
- Allow a way to build circles (rename for copyright)
- Provide a suggestion box on the site that creates new GitHub Issues
- Save certain Posts (like Pinterest)

## Known Errors

When using `ApolloProvider` we get an error like this

```javascript
Uncaught ReferenceError: regeneratorRuntime is not defined
    at eval (apollo.js:45)
    at _default (apollo.js:73)
    at _default (App.js:53)
    at ProxyFacade (react-hot-loader.development.js:675)
    at mountIndeterminateComponent (react-dom.development.js:13744)
    at beginWork (react-dom.development.js:14068)
    at performUnitOfWork (react-dom.development.js:16415)
    at workLoop (react-dom.development.js:16453)
    at renderRoot (react-dom.development.js:16532)
    at performWorkOnRoot (react-dom.development.js:17386)
```
