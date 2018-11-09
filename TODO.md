### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| src/common/components/FileUpload.jsx | 34 | Make it so that a user can give a URL where an image is located instead of loading the file manually
| src/common/components/Post/New/Video/SecondStep.jsx | 11 | get the second step finished
| src/common/components/VideoPlayer/index.jsx | 6 | Add a Broken Video Image when a video does not load
| src/common/components/VideoPlayer/index.jsx | 7 | Make it so editing is a different bundle using React-Loadable
| src/common/pages/Home/index.jsx | 10 | Make it so main pages gives a good overview
| src/server/config/api/index.js | 28 | Look for the fastest socket
| src/server/config/api/index.js | 136 | Make it so that sends a default image when the user not connected d
| src/server/config/api/index.js | 174 | Have a different Image to show based on reason
| src/server/models/file.js | 7 | Integrate with AWS S3
| src/server/models/file.js | 8 | Use Localstack in development to be confident with s3
| src/server/models/object.js | 11 | Create a way to follow
| src/server/models/object.js | 12 | Create a way to own
| src/server/models/object.js | 13 | Create a way to want
| src/server/models/object.js | 14 | Create a way to sold
| src/server/models/photo.js | 13 | Make sure that on every update modified User is adjusted
| src/server/models/photo.js | 14 | Make sure that user is required when updating or creating each photo/postnode
| src/server/models/photo.js | 15 | Add Node-EXIF to get GEO and Manufacturer information from photo
| src/server/models/photo.js | 16 | Add Imagemin to compress the images
| src/server/models/photo.js | 17 | When saving the images locally use gunzip
| src/server/models/photo.js | 84 | Only send this to the desired sockets to bypass the possibility of data getting sent to other clients when working in scale
| src/server/models/postNode.js | 15 | Create a way to like
| src/server/models/postNode.js | 16 | Create a way to dislike
| src/server/models/user.js | 43 | Make it so that Users can be listed as Invites
| src/server/models/user.js | 44 | Make it so users can unsubscribe from updates
| src/server/models/user.js | 46 | Setup Google Authentication Method
| src/server/models/user.js | 47 | Setup Facebook Authentication Method
| src/server/models/user.js | 48 | Setup Twitter Authentication Method
| src/server/models/user.js | 49 | Setup Auth0 Authentication Method
| src/server/models/user.js | 50 | Setup GitHub Authentication Method
| src/server/models/user.js | 51 | Setup TOTP Authentication Method
| src/server/models/user.js | 52 | Setup LinkedIn Authentication Method
| src/server/models/user.js | 53 | Setup WeChat Authentication Method
| src/server/models/user.js | 54 | Setup Instagram Authentication Method
| src/server/models/user.js | 55 | Setup Slack Authentication Method
| src/server/models/user.js | 56 | Setup Reddit Authentication Method
| src/server/models/user.js | 57 | Setup Tumblr Authentication Method
| src/server/models/user.js | 58 | Setup WordPress Authentication Method
| src/server/models/user.js | 60 | Setup Pinterest Link
| src/server/models/user.js | 61 | Setup DeviantArt Link
| src/server/models/user.js | 62 | Setup YouTube Link
| src/server/models/user.js | 63 | Setup Etsy Link
| src/server/models/user.js | 64 | Setup Flickr Link
| src/server/models/user.js | 65 | Setup Picasa Link
| src/server/models/user.js | 469 | Create a Default Image to be loaded
| src/server/models/video.js | 57 | Make it so that all these jobs are queued
| src/server/ws.js | 5 | Set this up so that it will run on another port but will be linked in this app for development