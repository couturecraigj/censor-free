/* eslint-disable no-console */
import chalk from 'chalk';
import setup from './setup';
import app from '.';

const completedFunction = (port, graphQlPath) => `

${chalk.black.bgGreenBright(
  `
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Everything loaded just fine now you can navigate to one of the below options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
)}
${chalk.grey.bgBlackBright(
  '****************************************************************************'
)}
${chalk.grey.bgBlackBright('****************')} ${chalk.green(
  `Website ==>`
)} ${chalk.blue.underline.bold(
  `http://localhost:${port}/`
)}        ${chalk.grey.bgBlackBright('*****************')}
${chalk.grey.bgBlackBright('****************')} ${chalk.green(
  `GraphQL ==>`
)} ${chalk.blue.underline.bold(
  `http://localhost:${port}${graphQlPath}`
)} ${chalk.grey.bgBlackBright('*****************')}
${chalk.grey.bgBlackBright(
  '****************************************************************************'
)}
`;

function startServer() {
  return new Promise((resolve, reject) => {
    const httpServer = app.listen(app.get('port'));

    httpServer.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        return reject(err);
      }
      reject(err);
    });

    httpServer.once('listening', () => resolve(httpServer));
  }).then(httpServer => {
    const { port } = httpServer.address();
    console.info(completedFunction(port, app.get('apollo').graphqlPath));

    setup(app, httpServer);

    // Hot Module Replacement API
    if (module.hot) {
      let currentApp = app;
      module.hot.accept('.', () => {
        httpServer.removeListener('request', currentApp);
        import('.')
          .then(({ default: nextApp }) => {
            currentApp = nextApp;
            setup(currentApp, httpServer);
            httpServer.on('request', currentApp);

            console.log('HttpServer reloaded!');
            console.info(
              completedFunction(port, app.get('apollo').graphqlPath)
            );
          })
          .catch(err => console.error(err));
      });

      // For reload main module (self). It will be restart http-server.
      module.hot.accept(err => {
        console.log('~~~Error while compiling~~~');
        console.error(err);
      });
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
