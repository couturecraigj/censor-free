import mongoose from 'mongoose';
import fs from 'fs';
import sharp from 'sharp';
import uuid from 'uuid/v4';
import path from 'path';
import PostNode from './postNode';

const PHOTO_DOES_NOT_EXIST = new Error('Photo has not been uploaded');

const cwd = process.cwd();

const { Schema } = mongoose;
const Photo = new Schema(
  {
    title: { type: String },
    description: { type: String },
    height: { type: Number },
    width: { type: Number },
    imgUri: { type: String }
  },
  {
    timestamps: true
  }
);

const makeDirectory = async filepath => {
  if (!fs.existsSync(filepath)) fs.mkdirSync(filepath);
  return;
};

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

Photo.statics.createPhoto = async function(args, context) {
  const uploadsPath = path.join(
    cwd,
    'uploads',
    context.req.user.id,
    args.imgUri
  );
  const publicFullsizePath = path.join(cwd, 'public', context.req.user.id);
  const publicThumbnailPath = path.join(
    cwd,
    'public',
    context.req.user.id,
    'thumbnail'
  );

  if (!fs.existsSync(uploadsPath)) throw PHOTO_DOES_NOT_EXIST;
  const extension = args.imgUri.match(/(?:\.([^.]+))?$/gm)[0];
  const readStream = fs.createReadStream(uploadsPath);
  const fileName = uuid() + extension;
  makeDirectory(publicFullsizePath);
  makeDirectory(publicThumbnailPath);
  const writeStream = fs.createWriteStream(
    path.join(publicFullsizePath, fileName)
  );
  const thumbnailWriteStream = fs.createWriteStream(
    path.join(publicThumbnailPath, fileName)
  );
  writeStream.on('close', () => {
    fs.unlinkSync(uploadsPath);
  });
  const {
    width: thumbnailWidth,
    height: thumbnailHeight
  } = getThumbnailDimensions(args, 75);
  const thumbnailTransformingStream = sharp().resize(
    thumbnailWidth,
    thumbnailHeight
  );
  readStream.pipe(writeStream);
  readStream.pipe(thumbnailTransformingStream).pipe(thumbnailWriteStream);
  const postNode = await PostNode.createPostNode(args, context);
  const photo = await mongoose.models.Photo.create({
    ...args,
    imgUri: '/' + context.req.user.id + '/' + fileName
  });
  postNode.post = photo.id;
  postNode.kind = 'Photo';
  postNode.save();
  return photo;
};

Photo.statics.getImageOfCertainSize = function(
  folder,
  photoFilename,
  { width, height },
  writableStream
) {
  return new Promise((resolve, reject) => {
    const photoPath = path.join(cwd, 'public', folder, photoFilename);
    if (!fs.existsSync(photoPath)) throw new Error('No Photo at that Path');
    const transformer = sharp().resize(+width, +height);
    writableStream.once('error', reject);
    writableStream.on('close', resolve);
    const readStream = fs.createReadStream(photoPath);
    readStream.once('error', reject);
    readStream.on('close', resolve);
    readStream.pipe(transformer).pipe(writableStream);
  });
};

Photo.statics.edit = function() {};
Photo.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

export default mongoose.model('Photo', Photo);
