const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const webpackAssets = require('./webpack-assets.json');

const assets = Object.values(webpackAssets).reduce(
  (p, c) => [...p, ...Object.values(c)],
  []
);

gulp.task('default', function() {
  return gulp
    .src('src/service-worker/sw.js')
    .pipe(
      webpackStream(
        {
          target: 'webworker',
          plugins: [
            new webpack.DefinePlugin({
              __ASSETS__: JSON.stringify(assets),
              __SW_PREFIX__: '"(inside Service-Worker) "'
            }),
            new webpack.ExtendedAPIPlugin()
          ],
          output: {
            filename: 'sw.js'
          }
        },
        webpack
      )
    )
    .pipe(gulp.dest('./public/'));
});
