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

Using `React-Router` with `loadable-components` is throwing a error

```javascript
loadable-component client modules: {}
loadable-component server modules: {children: Array(1)}

Uncaught (in promise) Error: loadable-components: module "./Home" is not found, client and server modules are not sync. You are probably not using the same resolver on server and client.
    at eval (loadable-components.es.js:105)
    at Array.map (<anonymous>)
    at loadState (loadable-components.es.js:96)
    at loadComponents (loadable-components.es.js:130)
    at load (index.js:33)
    at Module.eval (index.js:41)
    at eval (index.js:68)
    at Module../src/client/index.js (app.js:3483)
    at __webpack_require__ (app.js:768)
    at fn (app.js:131)
```
