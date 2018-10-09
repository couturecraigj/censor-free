import mongoose from 'mongoose';
// import MediaConverter from 'html5-media-converter';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import uuid from 'uuid/v4';
import { makeDirectory } from '../utils/fileSystem';
// import fs from 'fs';
import PostNode from './postNode';

function scale(width, height) {
  return (
    'scale="iw*min(' +
    width +
    '/iw\\,' +
    height +
    '/ih):ih*min(' +
    width +
    '/iw\\,' +
    height +
    '/ih)"'
  );
}

const parseHoursMinutesSecondsHundredSecondsToSeconds = str => {
  const [hours, minutes, seconds, hundredsSeconds] = str.match(/(\d{2,4})/g);
  const totalSeconds =
    +hundredsSeconds / 100 + +seconds + +minutes * 60 + +hours * 360;
  return totalSeconds;
};

const cwd = process.cwd();
const uploadPath = path.join(cwd, 'uploads');
const publicPath = path.join(cwd, 'public');

const { Schema } = mongoose;
const Video = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imgs: [Schema.Types.ObjectId],
    img: Schema.Types.ObjectId,
    uri: { type: String }
  },
  {
    timestamps: true
  }
);

Video.statics.createVideo = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Video.create(args, postNode);
};

Video.statics.createDifferentVideoFormats = async function(
  args,
  context,
  { progress: reportProgress = () => {}, ...opts } = {}
) {
  const fileDirectory = uuid();
  const fileName = uuid();
  const progressMap = {};
  let duration = 0;
  const progress = key => {
    progressMap[key] = 0;
    return (totalProgress, totalDuration, currentTime) => {
      // console.log(progressMap, duration);
      duration = totalDuration;
      if (currentTime <= duration && 0 <= currentTime) {
        progressMap[key] = currentTime;
        reportProgress(
          Object.values(progressMap).reduce((p, c) => p + c, 0) /
            (Object.keys(progressMap).length * duration)
        );
      }
    };
  };
  const hlsProgress = progress('hls');
  const mp4Progress = progress('mp4');
  const ogvProgress = progress('ogv');
  const webmProgress = progress('webm');
  const targetDir = path.join(publicPath, context.req.user.id, fileDirectory);
  await makeDirectory(targetDir);
  const targetName = path.join(targetDir, fileName);
  await Promise.all([
    await mongoose.models.Video.createHLSStream(args, context, targetName, {
      progress: hlsProgress,
      ...opts
    }),
    mongoose.models.Video.createMP4Format(args, context, targetName, {
      progress: mp4Progress,
      ...opts
    }),
    mongoose.models.Video.createOGVFormat(args, context, targetName, {
      progress: ogvProgress,
      ...opts
    }),

    mongoose.models.Video.createWEBMFormat(args, context, targetName, {
      progress: webmProgress,
      ...opts
    })
  ]);
  // eslint-disable-next-line no-console
  console.log('Finished creating files');
};

Video.statics.createOGVFormat = async function(
  args,
  context,
  targetName,
  { height, width, progress } = {}
) {
  const originalVideoPath = path.join(
    uploadPath,
    context.req.user.id,
    args.videoUri
  );
  await mongoose.models.Video.__convertFile(
    originalVideoPath,
    {
      height,
      width,
      progress,
      args: [
        '-c:v',
        'libtheora',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'libvorbis',
        '-q',
        '5',
        '-f',
        'ogg'
      ]
    },
    targetName + '.ogv'
  );
};
Video.statics.createWEBMFormat = async function(
  args,
  context,
  targetName,
  { height, width, progress } = {}
) {
  const originalVideoPath = path.join(
    uploadPath,
    context.req.user.id,
    args.videoUri
  );
  await mongoose.models.Video.__convertFile(
    originalVideoPath,
    {
      height,
      progress,
      width,
      args: [
        '-c:v',
        'libvpx',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'libvorbis',
        '-quality',
        'good',
        '-b:v',
        '2M',
        '-crf',
        '5',
        '-f',
        'webm'
      ]
    },
    targetName + '.webm'
  );
};

Video.statics.createHLSStream = function(
  args,
  context,
  targetName,
  { height, width, progress = () => {} } = {}
) {
  const originalVideoPath = path.join(
    uploadPath,
    context.req.user.id,
    args.videoUri
  );
  return new Promise((resolve, reject) => {
    const ffm = ffmpeg(originalVideoPath).outputOptions([
      '-profile:v',
      'baseline',
      '-level',
      '3.0',
      '-start_number',
      '0',
      '-hls_time',
      '10',
      '-hls_list_size',
      '0',
      '-f',
      'hls'
    ]);
    // ffm.on('start', function(commandLine) {
    //   console.log(commandLine);
    // });
    if (width && height) {
      ffm.addOutputOptions('-s', `${width}x${height}`);
    }
    ffm.output(targetName + '.m3u8');
    ffm.on('error', function(error, stdout, stderr) {
      error.stderr = stderr;
      reject(error);
    });
    let totalSeconds = 0;
    ffm.on('codecData', ({ duration }) => {
      totalSeconds = parseHoursMinutesSecondsHundredSecondsToSeconds(duration);
      progress(0, totalSeconds, 0);
    });
    ffm.on('progress', ({ timemark }) => {
      const currentTime = parseHoursMinutesSecondsHundredSecondsToSeconds(
        timemark
      );
      progress((currentTime / totalSeconds) * 100, totalSeconds, currentTime);
    });
    ffm.run();
    ffm.on('end', function() {
      progress(100, totalSeconds, totalSeconds);
      resolve();
    });
  });
};

Video.statics.__convertFile = function(
  originalVideoPath,
  { width, height, args = [], progress = () => {} } = {},
  targetFile
) {
  return new Promise((resolve, reject) => {
    const ffm = ffmpeg(originalVideoPath).outputOptions(args);
    ffm.on('start', function() {
      // console.log('Spawned Ffmpeg with command: ' + commandLine);
    });
    if (width && height) {
      ffm.addOutputOptions('-vf', scale(width, height));
    }
    ffm.output(targetFile);
    ffm.on('error', function(error, stdout, stderr) {
      error.stderr = stderr;
      reject(error);
    });
    let totalSeconds = 0;
    ffm.on('codecData', ({ duration }) => {
      totalSeconds = parseHoursMinutesSecondsHundredSecondsToSeconds(duration);
      progress(0, totalSeconds, 0);
    });
    ffm.on('progress', ({ timemark }) => {
      const currentTime = parseHoursMinutesSecondsHundredSecondsToSeconds(
        timemark
      );
      progress((currentTime / totalSeconds) * 100, totalSeconds, currentTime);
    });
    ffm.on('end', function() {
      progress(100, totalSeconds, totalSeconds);
      resolve();
    });
    ffm.run();
  });
};

Video.statics.createMP4Format = async function(
  args,
  context,
  targetName,
  { height, width, progress } = {}
) {
  const originalVideoPath = path.join(
    uploadPath,
    context.req.user.id,
    args.videoUri
  );
  await mongoose.models.Video.__convertFile(
    originalVideoPath,
    {
      height,
      progress,
      width,
      args: [
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-profile:v',
        'baseline',
        '-preset',
        'fast',
        '-crf',
        '18',
        '-f',
        'mp4',
        '-movflags',
        'faststart'
      ]
    },
    targetName + '.mp4'
  );
};
Video.statics.edit = function() {};
Video.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Video) delete mongoose.models.Video;

export default mongoose.model('Video', Video);
