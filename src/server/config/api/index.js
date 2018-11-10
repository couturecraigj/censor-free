/* env node */
import express from 'express';
import bodyParser from 'body-parser';
import File from '../../models/file';
import User from '../../models/user';

const app = express.Router();

app.get('/upload', async (req, res) => {
  // This is where we will check to see if the file already exists and also create an upload token and save it to the database
  try {
    const token = await File.getUploadToken(
      {
        ...JSON.parse(req.query.json)
      },
      { req, res }
    );

    res.json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get('/photo/:userId*', async (req, res) => {
  const user = await User.findById(req.params.userId);
  let ETag = req.headers['if-none-match'];

  // TODO: Look for the fastest socket
  return new Promise((resolve, reject) => {
    if (
      !user.sockets.some(socketId => {
        if (req.io.of('/').connected && req.io.of('/').connected[socketId]) {
          const socket = req.io.of('/').connected[socketId];

          const aborting = () => {
            socket.emit('Photo:streamUp$close');
            socket.removeAllListeners('Photo:streamUp$head');
            socket.removeAllListeners('Photo:streamUp$chunk');
            socket.removeAllListeners('Photo:streamUp$end');

            if (!req.aborted) req.abort();

            return reject('ABORTED');
          };
          const onAbort = function onAbort() {
            // this.destroy();
            return aborting();
          };

          req.once('abort', onAbort);
          let chunkNum = 0;

          socket.on(
            'Photo:streamUp$chunk',
            (pathName, chunk, num, callback) => {
              if (req.aborted) {
                return aborting();
              }

              if (req.params[0] !== pathName) return;

              if (chunkNum + 1 !== num) return;

              chunkNum++;

              if (callback) res.write(chunk, callback);
              else res.write(chunk);

              if (num > 1) res.flush();

              return;
            }
          );
          socket.once(
            'Photo:streamUp$reject',
            (pathName, userName, reason, head) => {
              if (req.aborted) return aborting();

              if (userName !== req.user.userObj.userName) return;

              if (req.params[0] !== pathName) return;

              socket.emit('Photo:streamUp$close');
              socket.removeAllListeners('Photo:streamUp$head');
              socket.removeAllListeners('Photo:streamUp$chunk');
              socket.removeAllListeners('Photo:streamUp$end');

              return reject({ reason, head });
            }
          );
          socket.once('Photo:streamUp$head', (pathName, head) => {
            if (req.aborted) return aborting();

            if (req.params[0] !== pathName) return;

            if (req.aborted) {
              return resolve(socket);
            }

            let code = 200;

            if (ETag === head.ETag) code = 304;

            if (!res.headersSent) {
              res.writeHead(code, head);
            } else {
              ETag = head.ETag;
              resolve(socket);
            }
          });
          socket.once('Photo:streamUp$end', (pathName, callback) => {
            if (req.aborted) return aborting();

            if (req.params[0] !== pathName) return;

            chunkNum = 0;
            callback();
            req.removeListener('abort', onAbort);

            return resolve(socket);
          });
          socket.emit(
            'Photo:streamUp$ready',
            req.headers,
            req.user.userObj,
            req.params[0].split('/').filter(v => v),
            req.params[0]
          );

          return true;
        }

        return false;
      })
    ) {
      // TODO: Make it so that sends a default image when the user not connected d
      res.status(502).send('DONE');

      return;
    }
  })
    .then(socket => {
      if (socket) {
        socket.emit('Photo:streamUp$close');
        socket.removeAllListeners('Photo:streamUp$head');
        socket.removeAllListeners('Photo:streamUp$chunk');
        socket.removeAllListeners('Photo:streamUp$reject');
        socket.removeAllListeners('Photo:streamUp$end');

        // if (!req.aborted) {
        // }

        res.end();
      }

      if (req.aborted) req.destroy();

      return;
    })
    .catch(e => {
      if (e.emit) {
        return;
      }

      if (e.message) {
        // eslint-disable-next-line no-console
        console.error(e);

        return res.send('ERROR');
      }

      if (e.reason) {
        // TODO: Have a different Image to show based on reason
        res.header(e.head);

        return res.status(e.reason).send(e.head);
      }

      return res.status(500).send('ERROR');
    });
});

app.post('/upload', bodyParser.json(), async (req, res, next) => {
  // This is were we will be putting all our data into
  // Requirements: Session, Token from Get
  try {
    await File.saveChunk(req.body);
    res.json(req.body);
  } catch (e) {
    if (e.message === File.FILE_ALREADY_FINISHED.message)
      return res.status(400).json({ message: e.message });

    if (e.message === File.CHUNK_ALREADY_LOADED.message)
      return res.status(400).json({ message: e.message });

    next(e);
  }
});

app.get('/graphql-urls', (req, res) => {
  // console.log(req.app.get('apollo'));
  const graphqlPath = req.app.get('apollo').clientOnly
    ? req.app.get('apollo').graphqlUrl
    : `${req.headers['x-forwarded-proto'] || req.protocol}://${
        req.headers.host
      }${req.app.get('apollo').graphqlPath}`;
  const subscriptionsPath = req.app.get('apollo').clientOnly
    ? req.app.get('apollo').graphqlSubscriptionURL
    : `ws://${req.headers.host}${req.app.get('apollo').subscriptionsPath}`;

  res.json({
    graphqlPath,
    subscriptionsPath
  });
});

export default app;
