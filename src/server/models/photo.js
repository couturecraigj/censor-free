import mongoose from 'mongoose';
import fs from 'fs';
import sharp from 'sharp';
import uuid from 'uuid/v4';
import path from 'path';
import File from './file';
import PostNode from './postNode';
import User from './user';
import { makeDirectory } from '../utils/fileSystem';
import Searchable from './searchable';

/**
 * TODO: Make sure that on every update modified User is adjusted
 * TODO: Make sure that user is required when updating or creating each photo/postnode
 */

const PHOTO_DOES_NOT_EXIST = new Error('Photo has not been uploaded');

const cwd = process.cwd();

const { Schema } = mongoose;
const Photo = new Schema(
  {
    title: { type: String, index: 'text' },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: 'text' },
    height: { type: Number },
    width: { type: Number },
    kind: { type: String, default: 'Photo' },
    imgUri: { type: String },
    thumbnailUri: { type: String },
    private: { type: Boolean, default: false },
    products: [Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
);

Photo.virtual('objects').set(function(objects) {
  this._objects = objects;
});
Photo.virtual('user').set(function(user) {
  this._user = user;
});

Photo.pre('save', async function() {
  if (this._objects) PostNode.addObjects(this._id, this._objects, this._user);
});

const getThumbnailDimensions = ({ width, height }, size) => {
  let multiplier = 0;

  if (width > height) {
    multiplier = size / width;
  } else {
    multiplier = size / height;
  }

  return {
    width: Math.floor(width * multiplier),
    height: Math.floor(height * multiplier)
  };
};

Photo.statics.__createMobile = function(args, file, context) {
  // console.log('MOBILE');
  const { io, user, createWriteStream } = context.req;

  return new Promise((resolve, reject) => {
    try {
      const nsp = io.of('/photo_create_mobile');

      nsp.on('connection', async socket => {
        // console.log('/photo_create_mobile', 'user connected');
        const timeOut = setTimeout(() => resolve(null), 20000);

        try {
          // TODO: Only send this to the desired sockets to bypass the possibility of data getting sent to other clients when working in scale
          const newUser = await User.setupUserFromSocket(socket, io);

          if (newUser.id !== user.id) return;

          const opts = [
            socket,
            {
              readyMessage: 'FILE:streamDown$ready',
              chunkMessage: 'FILE:streamDown$chunk'
            }
          ];
          const writeStream = await createWriteStream(
            file.id,
            [file.fileName],
            ...opts
          );
          const thumbnailWriteStream = await createWriteStream(
            file.id + 'thumbnail',
            ['thumbnail', file.fileName],
            ...opts
          );

          file.readStream
            .pipe(file.thumbnailTransformingStream)
            .on('finish', async () => {
              clearTimeout(timeOut);
              socket.disconnect();
              resolve(await this.finishCreate(args, file, context));
            })
            .pipe(thumbnailWriteStream)
            .on('error', function() {
              clearTimeout(timeOut);
              reject();
            });
          file.readStream.pipe(writeStream);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }

    if (user.sockets.length === 0) {
      return reject(new Error('Could not find any open sockets for this User'));
    }

    user.sockets.forEach(socket =>
      io.to(socket).emit('join namespace', '/photo_create_mobile')
    );
  });
  // args.private = true;

  // return new Promise(async (resolve, reject) => {
  //   const writeStream = await createWriteStream(file.id, [file.fileName]);
  //   const thumbnailWriteStream = await createWriteStream(file.id + 'tmbnl', [
  //     'thumbnail',
  //     file.fileName
  //   ]);
};
Photo.statics.__createServer = function(args, file, context) {
  const { user } = context.req;

  return new Promise(async (resolve, reject) => {
    const publicFullsizePath = user.id;
    const publicThumbnailPath = path.join(user.id, 'thumbnail');

    await makeDirectory(publicFullsizePath);
    await makeDirectory(publicThumbnailPath);
    const writeStream = fs.createWriteStream(
      path.join(cwd, 'public', publicFullsizePath, file.fileName)
    );
    const thumbnailWriteStream = fs.createWriteStream(
      path.join(cwd, 'public', publicThumbnailPath, file.fileName)
    );

    file.readStream.pipe(writeStream);
    file.readStream
      .pipe(file.thumbnailTransformingStream)
      .pipe(thumbnailWriteStream)
      .on('finish', async () => {
        resolve(await this.finishCreate(args, file, context));
      })
      .on('error', function() {
        reject();
      });
  });
};

Photo.statics.createPhoto = function(args, context) {
  return new Promise(async resolve => {
    const file = await File.findOne({ uploadToken: args.imgUri });

    if (!file) throw File.NO_FILE_FOUND;

    if (!fs.existsSync(file.finishedFileName)) throw PHOTO_DOES_NOT_EXIST;

    const extension = file.finishedFileName.match(/(?:\.([^.]+))?$/gm)[0];

    const {
      width: thumbnailWidth,
      height: thumbnailHeight
    } = getThumbnailDimensions(file, 75);

    file.thumbnailTransformingStream = sharp().resize(
      thumbnailWidth,
      thumbnailHeight
    );
    file.fileName = uuid() + extension;
    file.readStream = fs.createReadStream(file.finishedFileName);

    if (context.req.user.dataMode === 'Mobile')
      return resolve(await this.__createMobile(args, file, context));

    return resolve(await this.__createServer(args, file, context));
  });
};

Photo.statics.find_One = async function(args) {
  // const { user } = context.req;

  // if (user.dataMode === 'Mobile') return this.__findOneMobile(args, context);

  return this.findOne(args);
};

Photo.statics.__findOneMobile = async function(args, context) {
  const { requestPost } = context.req;

  return requestPost({ kind: 'Photo', ...args }, context);
};

Photo.statics.finishCreate = async function(args, file, context) {
  const photo = await this.create({
    ...args,
    ...file.toJSON(),
    imgUri: '/' + context.req.user.id + '/' + file.fileName,
    thumbnailUri: '/' + context.req.user.id + '/thumbnail/' + file.fileName
  });
  const postNode = await PostNode.createPostNode(args, photo, context);
  const searchable = await Searchable.createSearchable(args, photo, context);

  photo.postNode = postNode.id;
  photo.searchable = searchable.id;

  fs.unlinkSync(file.finishedFileName);
  await file.remove();

  return photo.save();
};

Photo.statics.getImageOfCertainSize = function(
  photoFilePath,
  { width, height, req },
  writableStream
) {
  return new Promise((resolve, reject) => {
    const photoPath = path.join(cwd, 'public', photoFilePath);

    if (!fs.existsSync(photoPath)) throw new Error('No Photo at that Path');

    const transformer = sharp().resize(+width, +height);

    writableStream.once('error', reject);
    writableStream.on('close', resolve);
    const readStream = fs.createReadStream(photoPath);

    readStream.once('error', reject);
    readStream.on('close', () => {
      const publicPath = path.join(cwd, 'public', req.url);
      const file = photoFilePath.match(/.[^/]*/g)[1];

      makeDirectory(req.url.replace(file, ''));
      const publicReadStream = fs.createReadStream(photoPath);
      const publicStream = fs.createWriteStream(publicPath);
      const publicTransformer = sharp().resize(+width, +height);

      publicReadStream.once('error', reject);
      publicReadStream.on('close', resolve);
      publicReadStream.pipe(publicTransformer).pipe(publicStream);
    });
    readStream.pipe(transformer).pipe(writableStream);
  });
};

Photo.statics.edit = function() {};
Photo.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

export default mongoose.model('Photo', Photo);
