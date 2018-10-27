import mongoose from 'mongoose';
import fs from 'fs';
import sharp from 'sharp';
import uuid from 'uuid/v4';
import path from 'path';
import File from './file';
import PostNode from './postNode';
import { makeDirectory } from '../utils/fileSystem';
import Searchable from './searchable';

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
    products: [Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
);

Photo.virtual('objects').set(function(objects) {
  this._objects = objects;
});

Photo.pre('save', async function() {
  if (this._objects) PostNode.addObjects(this._id, this._objects);
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

Photo.statics.createPhoto = function(args, context) {
  return new Promise(async (resolve, reject) => {
    const file = await File.findOne({ uploadToken: args.imgUri });

    const publicFullsizePath = path.join(context.req.user.id);
    const publicThumbnailPath = path.join(context.req.user.id, 'thumbnail');

    if (!fs.existsSync(file.finishedFileName)) throw PHOTO_DOES_NOT_EXIST;
    const extension = file.finishedFileName.match(/(?:\.([^.]+))?$/gm)[0];
    const readStream = fs.createReadStream(file.finishedFileName);
    const fileName = uuid() + extension;
    await makeDirectory(publicFullsizePath);
    await makeDirectory(publicThumbnailPath);
    const writeStream = fs.createWriteStream(
      path.join(cwd, 'public', publicFullsizePath, fileName)
    );
    const thumbnailWriteStream = fs.createWriteStream(
      path.join(cwd, 'public', publicThumbnailPath, fileName)
    );
    writeStream.on('finish', async () => {
      fs.unlinkSync(file.finishedFileName);
      const photo = await mongoose.models.Photo.create({
        ...args,
        imgUri: '/' + context.req.user.id + '/' + fileName,
        thumbnailUri: '/' + context.req.user.id + '/thumbnail/' + fileName
      });
      const postNode = await PostNode.createPostNode(args, photo, context);
      const searchable = await Searchable.createSearchable(
        args,
        photo,
        context
      );
      photo.postNode = postNode.id;
      photo.searchable = searchable.id;
      await photo.save();

      resolve(photo);
    });
    writeStream.on('error', e => {
      reject(e);
    });
    const {
      width: thumbnailWidth,
      height: thumbnailHeight
    } = getThumbnailDimensions(file, 75);
    const thumbnailTransformingStream = sharp().resize(
      thumbnailWidth,
      thumbnailHeight
    );
    readStream.pipe(writeStream);
    readStream.pipe(thumbnailTransformingStream).pipe(thumbnailWriteStream);
  });
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
