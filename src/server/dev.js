/* eslint-disable no-console */
// require("@babel/polyfill");
import app from '.';

const chalk = require('chalk');

function startServer() {
  return new Promise((resolve, reject) => {
    const httpServer = app.listen(app.get('port'));

    httpServer.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        reject(err);
      }
    });

    httpServer.once('listening', () => resolve(httpServer));
  }).then(httpServer => {
    const { port } = httpServer.address();
    console.info(
      `

${chalk.italic.red(
        'Everything loaded just fine now you can navigate to one of the below options'
      )}
${chalk.underline.red(
        '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='
      )}

Website ==> ${chalk.blue.bold(`http://localhost:${port}/`)}
GraphQL ==> ${chalk.blue.bold(
        `http://localhost:${port}${app.get('apollo').graphqlPath}`
      )}
`
    );

    // Hot Module Replacement API
    if (module.hot) {
      let currentApp = app;
      module.hot.accept('./index', () => {
        httpServer.removeListener('request', currentApp);
        import('.')
          .then(({ default: nextApp }) => {
            currentApp = nextApp;
            httpServer.on('request', currentApp);
            console.log('HttpServer reloaded!');
          })
          .catch(err => console.error(err));
      });

      // For reload main module (self). It will be restart http-server.
      module.hot.accept(err => console.error(err));
      module.hot.dispose(() => {
        console.log('Disposing entry module...');
        httpServer.close();
      });
    }
  });
}

console.log('Starting http server...');
startServer().catch(err => {
  console.error('Error in server start script.', err);
});
