import mongoose from 'mongoose';
import uuid from 'uuid/v4';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

const sendFileFields = file => ({
  finished: file.finished,
  uploadToken: file.uploadToken,
  chunkSize: file.chunkSize,
  chunksLoaded: file.chunksLoaded
});

const cwd = process.cwd();
const { Schema } = mongoose;
const File = new Schema(
  {
    mimeType: { type: String, required: true },
    height: { type: Number },
    width: { type: Number },
    finishedFileName: { type: String },
    path: {
      type: String
    },
    chunksLoaded: [String],
    chunkSize: {
      type: Number
    },
    extension: {
      type: String
    },
    uploadToken: { type: String, default: uuid, unique: true },
    user: { type: Schema.Types.ObjectId, required: true },
    originalFileName: { type: String, required: true },
    size: { type: Number, required: true },
    finished: { type: Boolean, default: false },
    convertedPath: { type: String },
    converted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

File.pre('validate', function() {
  if (this.isNew) {
    this.path = path.join(cwd, 'uploads', this.uploadToken);
    this.extension = this.originalFileName
      .replace(this.originalFileName.replace(/\.[\w\d]*$/gm, ''), '')
      .replace('.', '');
  }
});

File.statics.getUploadToken = async function(args) {
  if (!args.user)
    throw new Error('You need to be logged in to be able to upload anything');
  const file = await mongoose.models.File.findOne(args);
  if (file) {
    if (!file.finishedFileName) return sendFileFields(file);
    if (fs.existsSync(file.finishedFileName)) return sendFileFields(file);
    await file.destroy();
  }
  return mongoose.models.File.create(args).then(file => {
    fs.mkdirSync(file.path);
    return sendFileFields(file);
  });
};

File.statics.saveChunk = function({ uploadToken, chunk, chunkNumber }) {
  if (!uploadToken) throw new Error('We need a token to process the upload');
  const chunkName = '' + chunkNumber + '.chunk';
  return new Promise(async (resolve, reject) => {
    try {
      const file = await mongoose.models.File.findOne({ uploadToken });
      if (!file) return reject(mongoose.models.File.NO_FILE_FOUND());
      if (file.chunksLoaded.find(file => file === chunkName))
        return reject(mongoose.models.File.CHUNK_ALREADY_LOADED);
      const buffer = Buffer.from(chunk, 'base64');
      const chunkPath = path.join(file.path, chunkName);
      const writeStream = fs.createWriteStream(chunkPath);
      writeStream.on('finish', async () => {
        await mongoose.models.File.findByIdAndUpdate(file.id, {
          $addToSet: {
            chunksLoaded: chunkName
          }
        });
        try {
          if (file.size <= (file.chunksLoaded.length + 1) * file.chunkSize)
            await mongoose.models.File.combineChunks({ uploadToken });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      writeStream.on('error', err => {
        reject(err);
      });
      writeStream.write(buffer);
      writeStream.end();
    } catch (e) {
      reject(e);
    }
  });
};

File.statics.CHUNK_ALREADY_LOADED = new Error('Chunk Already Uploaded');
File.statics.NO_FILE_FOUND = new Error('No File Found');
File.statics.FILE_ALREADY_FINISHED = new Error(
  'File has already finished uploading'
);
File.statics.combineChunks = function({ uploadToken }) {
  return new Promise(async (resolve, reject) => {
    const file = await mongoose.models.File.findOne({ uploadToken });
    const finishedFileName = file.path + '.' + file.extension;
    fs.readdir(file.path, async (err, files) => {
      if (err) return reject(err);

      files.sort((a, b) => {
        const fileA = a.replace('.chunk', '');
        const fileB = b.replace('.chunk', '');
        return +fileA - +fileB;
      });
      const writeStream = fs.createWriteStream(finishedFileName);
      for (const newFile of files) {
        writeStream.write(fs.readFileSync(path.join(file.path, newFile)));
      }
      rimraf(file.path, async err => {
        if (err) return reject(err);
        writeStream.end();
        await mongoose.models.File.findByIdAndUpdate(file.id, {
          finished: true,
          chunksLoaded: [],
          finishedFileName
        });
        resolve({ finishedFileName });
      });
    });
  });
};

File.statics.edit = function() {};
File.statics.addComment = function() {};

if (mongoose.models && mongoose.models.File) delete mongoose.models.File;
export default mongoose.model('File', File);
