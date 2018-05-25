const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const streamqueue = require('streamqueue');
const concat = require('gulp-concat');
const buffer = require('vinyl-buffer');

function build() {
  var config = {
    src: 'src/index.ts',
    filename: 'index.js',
    dest: 'dist/',
  };

  var extensions = ['.js', '.ts', '.json'];
  const mainStream = browserify({ extensions: extensions })
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
    .pipe(buffer());

  const preShim = gulp.src('shims/preshim.js');
  const postShim = gulp.src('shims/postshim.js');

  return streamqueue({ objectMode: true }, preShim, mainStream, postShim)
    .pipe(concat(config.filename))
    .pipe(gulp.dest(config.dest));
}

gulp.task('watch', function() {
  return gulp.watch('src/**/*', ['build']);
});

gulp.task('build', function() {
  build();
});
