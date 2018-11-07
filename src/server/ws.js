import fs from 'fs';
import User from './models/user';

/**
 * TODO: Set this up so that it will run on another port but will be linked in this app for development
 */

export default (httpServer, app) => {
  const io = require('socket.io')(httpServer);

  // io.use((socket, next) => {
  //   const handshake = socket.handshake;

  //   // eslint-disable-next-line no-console
  //   console.log(socket);
  //   // eslint-disable-next-line no-console
  //   console.log(handshake);

  //   // ...
  //   next();
  // });
  // io.use(async (socket, next) => {
  //   console.log(socket.handshake);
  //   next();
  // });
  // console.log('socket.io');
  io.on('connection', async socket => {
    // eslint-disable-next-line no-console
    console.log('a user connected');
    let user;

    // socket.use((packet, next) => {
    if (socket.handshake.query.token)
      user = await User.getUserFromToken(socket.handshake.query.token);

    if (user) {
      // eslint-disable-next-line no-console
      console.log(user);
    }

    //   next();
    // });
    const fileName = 'IMG_3912.mov';

    socket.on('graphql-urls', callback => {
      callback(app.get('apollo'));
    });
    socket.emit('file_check', { fileName, user: {} });
    socket.on('file_available', () => {
      // eslint-disable-next-line no-console
      console.log('FILE AVAILABLE');
      const writeStream = fs.createWriteStream(fileName);

      socket.on('chunk', (chunk, callback) => {
        writeStream.write(chunk);
        callback();
      });
      writeStream.on('error', err => {
        // eslint-disable-next-line no-console
        console.error(err);
        writeStream.end();
      });
      socket.on('end', () => writeStream.end());
    });
    socket.on('disconnect', function() {
      // eslint-disable-next-line no-console
      console.log('user disconnected!');
    });
  });
  // console.log(httpServer);

  httpServer.once('listening', () => {
    app.set('io-port', httpServer.address().port);
  });

  app.set('io', io);

  return io;
};
