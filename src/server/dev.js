/* eslint-disable no-console */
import chalk from 'chalk';
import http from 'http';
import setup from './setup';
import ws from './ws';
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
)}        ${chalk.grey.bgBlackBright('*****************')}${
  graphQlPath
    ? `
${chalk.grey.bgBlackBright('****************')} ${chalk.green(
        `GraphQL ==>`
      )} ${chalk.blue.underline.bold(
        `http://localhost:${port}${graphQlPath}`
      )} ${chalk.grey.bgBlackBright('*****************')}`
    : ''
}
${chalk.grey.bgBlackBright(
  '****************************************************************************'
)}
`;

function startServer() {
  return new Promise((resolve, reject) => {
    const httpServer = app.listen(app.get('port'));
    const wsServer = http.createServer();

    ws(wsServer, app);

    wsServer.listen(3002);

    wsServer.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        return reject(err);
      }

      reject(err);
    });
    httpServer.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        return reject(err);
      }

      reject(err);
    });
    Promise.all([
      new Promise(resolve => {
        httpServer.once('listening', () => resolve(httpServer));
      }),
      // wsServer
      new Promise(resolve => {
        wsServer.once('listening', () => resolve(wsServer));
      })
    ]).then(resolve);
    // .then(() => resolve(httpServer));
  }).then(([httpServer, wsServer]) => {
    if (!app.get('apollo').clientOnly)
      app.get('apollo').installSubscriptionHandlers(httpServer);

    const { port } = httpServer.address();

    console.log(wsServer.address());

    console.info(
      completedFunction(
        port,
        !app.get('apollo').clientOnly ? app.get('apollo').graphqlPath : ''
      )
    );

    setup(app, httpServer);

    // Hot Module Replacement API
    if (module.hot) {
      let currentApp = app;
      let currentWs = ws;

      module.hot.accept(['.', './ws'], () => {
        httpServer.removeListener('request', currentApp);
        wsServer.removeListener('request', currentWs);
        wsServer.removeListener('upgrade', currentWs);

        Promise.all([import('.'), import('./ws')])
          .then(([{ default: nextApp }, { default: nextWs }]) => {
            currentApp.get('apollo').stop();
            currentApp.get('io').close(() => {
              wsServer = http.createServer();
              delete currentApp.get('io');
              console.log('CLOSING WS Server!');
              nextWs(wsServer, nextApp);
              wsServer.listen(3002);
            });

            currentWs = nextWs;
            currentApp = nextApp;

            nextApp.get('apollo').installSubscriptionHandlers(httpServer);

            setup(currentApp, httpServer);
            httpServer.on('request', currentApp);
            wsServer.on('request', currentWs);
            wsServer.on('upgrade', currentWs);

            console.log('HttpServer reloaded!');
            console.info(
              completedFunction(
                port,
                !app.get('apollo').clientOnly
                  ? app.get('apollo').graphqlPath
                  : ''
              )
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
