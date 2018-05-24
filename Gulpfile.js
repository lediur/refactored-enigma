var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  var config = {
    src: 'src/index.ts',
    filename: 'index.js',
    dest: 'dist/',
  };
  var extensions = ['.js', '.ts', '.json'];
  var b = browserify({ extensions: extensions });
  b
    .plugin('tsify', { target: 'es6' })
    .transform(
      babelify.configure({
        extensions: extensions,
      })
    )
    .add(config.src)
    .bundle()
    // log errors if they happen
    .on('error', function(e) {
      console.log(e.message);
      throw e;
    })
    .pipe(source(config.filename))
    .pipe(gulp.dest(config.dest));
});
