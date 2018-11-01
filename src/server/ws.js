import fs from 'fs';
import User from './models/user';

const io = require('socket.io')();

export default (httpServer, app) => {
  io.attach(httpServer, {
    // pingInterval: 1000,
    // pingTimeout: 500
    // cookie: false
  });
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
      console.log('user disconnected');
    });
  });

  app.set('io', io);

  return io;
};
