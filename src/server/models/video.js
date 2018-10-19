import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import uuid from 'uuid/v4';
// import childProcess from 'child_process';
import { makeDirectory } from '../utils/fileSystem';
import File from './file';
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
const publicPath = path.join(cwd, 'public');

const { Schema } = mongoose;
const Video = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imgs: [Schema.Types.ObjectId],
    img: Schema.Types.ObjectId,
    kind: { type: String, default: 'Video' },
    uri: { type: String }
  },
  {
    timestamps: true
  }
);

Video.statics.addFilters = async function() {};

/**
 * TODO: Make it so that all these jobs are queued
 * instead of executing immediately
 */
Video.statics.createVideo = async function(args, context, extras) {
  const file = await File.findOne({ uploadToken: args.uploadToken });
  let filePath;
  if (!file.converted) {
    filePath = await mongoose.models.Video.createDifferentVideoFormats(
      file,
      // args,
      context,
      extras
    );
  } else {
    filePath = file.convertedPath;
    extras.progress(100);
  }
  let video = await mongoose.models.Video.findOne({ uri: filePath });
  if (!video) {
    video = await mongoose.models.Video.create({
      uri: filePath.replace(publicPath, ''),
      ...args
    });
    await PostNode.createPostNode(args, context, video);
  }
  // if (file) console.log(file);

  return { ...video.toJSON(), ...file.toJSON() };
};

Video.statics.createDifferentVideoFormats = async function(
  file,
  // args,
  context,
  { progress: reportProgress = () => {}, ...opts } = {}
) {
  const { Video } = mongoose.models;
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
          Math.round(
            (Object.values(progressMap).reduce((p, c) => p + c, 0) /
              (Object.keys(progressMap).length * duration)) *
              10000
          ) / 100
        );
      }
    };
  };
  const hlsProgress = progress('hls');
  const mp4Progress = progress('mp4');
  const ogvProgress = progress('ogv');
  const dashProgress = progress('dash');
  // const webmProgress = progress('webm');
  const targetDir = path.join(publicPath, context.req.user.id, fileDirectory);
  await makeDirectory(targetDir);

  const targetName = path.join(targetDir, fileName);
  Promise.all([
    Video.createHLSStream(file, targetName, {
      progress: hlsProgress,
      ...opts
    }),
    Video.createMP4Format(file, targetName, {
      progress: mp4Progress,
      ...opts
    }),
    Video.createOGVFormat(file, targetName, {
      progress: ogvProgress,
      ...opts
    }),

    // Video.createWEBMFormat(file, targetName, {
    //   progress: webmProgress,
    //   ...opts
    // }),
    Video.createDashStream(file, targetName, {
      progress: dashProgress,
      ...opts
    }),
    Video.getScreenshots(file, targetName)
  ]).then(() => {
    reportProgress(100);
    file.converted = true;
    file.convertedPath = targetName;
    return file.save();
  });
  // eslint-disable-next-line no-console
  console.log('File Conversion Started');
  return targetName;
};

Video.statics.createOGVFormat = async function(
  file,
  // args,
  // context,
  targetName,
  { height, width, progress } = {}
) {
  await mongoose.models.Video.__convertFile(
    file.finishedFileName,
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
  file,
  // args,
  // context,
  targetName,
  { height, width, progress } = {}
) {
  await mongoose.models.Video.__convertFile(
    file.finishedFileName,
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

Video.statics.createDashStream = function(
  file,
  targetName,
  {
    //   // height,
    //   // width,
    progress = () => {}
  } = {}
) {
  return new Promise((resolve, reject) => {
    const ffm = ffmpeg(`${file.path}.${file.extension}`)
      .output(targetName + '.mpd')
      .outputOptions([
        '-map',
        '0',
        '-map',
        '0',
        '-c:a',
        'libfdk_aac',
        '-c:v',
        'libx264',
        '-b:v:0',
        '800k',
        '-b:v:1',
        '300k',
        '-s:v:1',
        '320x170',
        '-profile:v:1',
        'baseline',
        '-profile:v:2',
        'main',
        '-bf',
        '1',
        '-keyint_min',
        '120',
        '-g',
        '120',
        '-sc_threshold',
        '0',
        '-b_strategy',
        '0',
        '-ar:a:1',
        '22050',
        '-use_timeline',
        '1',
        // '-seg_duration',
        // '4',
        '-use_template',
        '1',
        // '-window_size',
        // '5',
        // '-adaptation_sets',
        // 'id=0,streams=v id=1,streams=a',
        '-f',
        'dash'
      ]);

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
    ffm
      .on('end', () => {
        return resolve();
      })
      .on('error', e => {
        // eslint-disable-next-line no-console
        console.error(e);
        reject(e);
      });
    ffm.run();
  });
};

Video.statics.createHLSStream = function(
  file,
  // args,
  // context,
  targetName,
  { height, width, progress = () => {} } = {}
) {
  return new Promise((resolve, reject) => {
    const ffm = ffmpeg(file.finishedFileName)
      .output(path.join(targetName, '360p.m3u8'))
      .outputOptions([
        '-vf',
        'scale=w=640:h=360:force_original_aspect_ratio=decrease',
        '-c:a',
        'aac',
        '-ar',
        '48000',
        '-c:v',
        'h264',
        '-profile:v',
        'main',
        '-crf',
        '20',
        '-sc_threshold',
        '0',
        '-g',
        '48',
        '-keyint_min',
        '48',
        '-hls_time',
        '4',
        '-hls_playlist_type',
        'vod',
        '-b:v',
        '800k',
        '-maxrate',
        '856k',
        '-bufsize',
        '1200k',
        '-b:a',
        '96k',
        '-hls_segment_filename',
        path.join(targetName, '360p_%03d.ts')
      ])
      .output(path.join(targetName, '480p.m3u8'))
      .outputOptions([
        '-vf',
        'scale=w=842:h=480:force_original_aspect_ratio=decrease',
        '-c:a',
        'aac',
        '-ar',
        '48000',
        '-c:v',
        'h264',
        '-profile:v',
        'main',
        '-crf',
        '20',
        '-sc_threshold',
        '0',
        '-g',
        '48',
        '-keyint_min',
        '48',
        '-hls_time',
        '4',
        '-hls_playlist_type',
        'vod',
        '-b:v',
        '1400k',
        '-maxrate',
        '1498k',
        '-bufsize',
        '2100k',
        '-b:a',
        '128k',
        '-hls_segment_filename',
        path.join(targetName, '480p_%03d.ts')
      ])
      .output(path.join(targetName, '720p.m3u8'))
      .outputOptions([
        '-vf',
        'scale=w=1280:h=720:force_original_aspect_ratio=decrease',
        '-c:a',
        'aac',
        '-ar',
        '48000',
        '-c:v',
        'h264',
        '-profile:v',
        'main',
        '-crf',
        '20',
        '-sc_threshold',
        '0',
        '-g',
        '48',
        '-keyint_min',
        '48',
        '-hls_time',
        '4',
        '-hls_playlist_type',
        'vod',
        '-b:v',
        '2800k',
        '-maxrate',
        '2996k',
        '-bufsize',
        '4200k',
        '-b:a',
        '128k',
        '-hls_segment_filename',
        path.join(targetName, '720p_%03d.ts')
      ])
      .output(path.join(targetName, '1080p.m3u8'))
      .outputOptions([
        '-vf',
        'scale=w=1920:h=1080:force_original_aspect_ratio=decrease',
        '-c:a',
        'aac',
        '-ar',
        '48000',
        '-c:v',
        'h264',
        '-profile:v',
        'main',
        '-crf',
        '20',
        '-sc_threshold',
        '0',
        '-g',
        '48',
        '-keyint_min',
        '48',
        '-hls_time',
        '4',
        '-hls_playlist_type',
        'vod',
        '-b:v',
        '5000k',
        '-maxrate',
        '5350k',
        '-bufsize',
        '7500k',
        '-b:a',
        '192k',
        '-hls_segment_filename',
        path.join(targetName, '1080p_%03d.ts')
      ]);
    // ffm.on('start', function(commandLine) {
    //   console.log(commandLine);
    // });
    if (width && height) {
      ffm.addOutputOptions('-s', `${width}x${height}`);
    }

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
      fs.writeFileSync(
        path.join(targetName, 'playlist.m3u8'),
        `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8`
      );
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
  file,
  // args,
  // context,
  targetName,
  { height, width, progress } = {}
) {
  await mongoose.models.Video.__convertFile(
    file.finishedFileName,
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

Video.statics.getScreenshots = function(file, targetName) {
  return new Promise((resolve, reject) => {
    let files = [];
    ffmpeg(file.finishedFileName)
      .on('filenames', function(filenames) {
        files = filenames;
      })
      .on('end', function() {
        resolve(files);
      })
      .on('error', function(e) {
        reject(e);
      })
      .screenshots({
        count: 4,
        folder: targetName,
        filename: '%i.png'
      });
  });
};
Video.statics.edit = function() {};
Video.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Video) delete mongoose.models.Video;

export default mongoose.model('Video', Video);
