const { compress } = require('./utils/strings');

const __PROD__ = process.env.NODE_ENV === 'production';
const script = !__PROD__
  ? `<script defer async src="http://localhost:8080/app.js"></script>`
  : `<script defer async src="${
      // eslint-disable-next-line node/no-unpublished-require
      require('../../webpack-assets.json').app.js
    }"></script>`;

export default ({ head, body, foot, attrs = {} }) => compress`
<!DOCTYPE html>
<html lang="en" ${attrs.html}>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  ${head}
  ${script}
</head>
<body ${attrs.body}>
  <div id="root">${body}</div>
  <div id="modal"></div>
  <div id="portal"></div>
  ${foot}
</body>
</html>
`;
