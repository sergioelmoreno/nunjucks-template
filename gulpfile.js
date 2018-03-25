var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
const data = require('gulp-data');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sassOptions = { outputStyle: 'expanded' };
var autoprefixer = require('gulp-autoprefixer');
var autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };
var imagemin = require('gulp-imagemin');
var fs = require('fs');
var reload = browserSync.reload;

var src = {
    scss: 'app/scss/*.scss',
    css: 'dist/css',
    scripts: 'app/js/**/*',
    imgs: 'app/imgs/**/*',
    njk: 'app/site/**/*.+(html|njk)',
    html: 'dis/*.html'
};

// Static Server + watching scss/html files
gulp.task('serve', ['nunjucks', 'sass', 'scripts'], function(){
  browserSync.init({
    server: 'dist'
  });

  gulp.watch(src.scripts, ['scripts']);
  gulp.watch(src.imgs, ['images']);
  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.njk, ['nunjucks']);
  gulp.watch(src.html).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function(){
  return gulp
    .src(src.scss)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(src.css))
    .pipe(reload({ stream: true }))
});

// Compile Nunjucks

gulp.task('nunjucks', function(){
  gulp.src('app/site/*.+(html|njk)')
  .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('app/data.json'));
    }))
  .pipe(nunjucks.compile())
  .pipe(gulp.dest('dist'))
  .pipe(reload({ stream: true }))
});


// Images
gulp.task('images', function(){
  return gulp.src('app/imgs/**/*')
    .pipe(imagemin({
      progressive: true
    }))
  .pipe(gulp.dest('dist/img'))
  .pipe(reload({ stream: true }))
});

// Javascript

gulp.task('scripts', function(){
  return gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'))
  .pipe(reload({ stream: true }))
});

// Run
gulp.task('default', ['serve']);