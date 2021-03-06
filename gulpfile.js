const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const __PROD__ = process.env.NODE_ENV === 'production';
const config = __PROD__
  ? require('./utilities/bundling/production/service-worker/webpack.config.js')
  : require('./utilities/bundling/development/service-worker/webpack.config.js');

gulp.task('default', function() {
  return gulp
    .src('src/service-worker/sw.js')
    .pipe(webpackStream(config, webpack))
    .on('error', function(err) {
      // eslint-disable-next-line no-console
      console.log(err.toString());

      this.emit('end');
    })
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', ['default'], () => {
  gulp.watch(['src/**/*.js', '**/fragmentTypes.json'], ['default'])
});
// gulp.task('electron', function() {
//   return gulp
//     .src('src/desktop-app/main/index.js')
//     .pipe(webpackStream(config, webpack))
//     .on('error', function(err) {
//       // eslint-disable-next-line no-console
//       console.log(err.toString());

//       this.emit('end');
//     })
//     .pipe(gulp.dest('desktop-app/'));
// });

// gulp.task('electron:watch', function() {
//   gulp.series(
//     'electron',
//     gulp.watch('src/desktop-app/**/*.js', gulp.series('electron')),
//     gulp.watch('**/fragmentTypes.json', gulp.series('electron'))
//   );
// });
