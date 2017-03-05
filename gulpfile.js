// Require() is built into Node.js and used to load modules
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'), // for compiling coffeescript
    concat = require('gulp-concat'), // for concatenating js files
    compass = require('gulp-compass'), // compiles sass
    sassLint = require('gulp-sass-lint'), // for sass lint
    browserify = require('gulp-browserify'); // for adding js libraries as dependencies
    gulpif = require('gulp-if'), // for conditional statements
    uglify = require('gulp-uglify'), // for js minifying
    minifyHTML = require('gulp-minify-html'), // for minifying html
    jsonMinify = require('gulp-jsonminify'), // for crushing json
    imageMin = require('gulp-imagemin'), // for optimizing images
    pngcrush = require('imagemin-pngcrush')
    connect = require('gulp-connect'); // plugin for running a webserver with liveReload

var env,
    coffeeSources,
    jsSources,
    htmlSources,
    sassSources,
    jsonSources,
    outputDir,
    sassStyle;

// Environment
// To run in production:
// > export NODE_ENV=production (for MacOS)
// > gulp
// To run in development:
// > export NODE_ENV=development (for MacOS)
// > gulp
// env = process.env.NODE_ENV || 'development' // node env var otherwise defaults to dev
env = 'production'
// env = 'development'

// modify how outputDir is used depending on env var
if (env==='development'){
  outputDir = 'builds/development/';
  sassStyle = 'nested';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed'; // compress css for production
}

// COFFEESCRIPT SOURCES
// var coffeeSources = ['components/coffee/*.coffee'];
// Use an array in case you need to add additional files later
// or the asterisk to specify all files of a specific type
coffeeSources = ['components/coffee/*.coffee'];

// JS SOURCES
// array of paths to all of the js documents
// order of concatenation = order of array elements
jsSources = [
  'components/scripts/jq.js',
  'components/scripts/template.js'
];

// SASS SOURCES
// array of paths to all of the scss documents
// to process through gulp sass lint
sassSources = ['components/sass/style.scss'];

// HTML SOURCES
htmlSources = [outputDir + '*.html',outputDir + '*.htm'];

// JSON SOURCES
jsonSources = [outputDir + 'js/*.json'];


// Gulp Task for processing coffeescript
// > gulp coffee
gulp.task('coffee', function(){
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

// Gulp Task for concatenating js files
// > gulp js
gulp.task('js', function(){
  gulp.src(jsSources)
    .pipe(concat('script.js')) // production js
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify())) // if env is production minify js
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload()) // reload webserver page after coffeescript is processed into js and js is concatenated
});


// Gulp Task for Sass lint
// > gulp sassLint
gulp.task('sassLint', function(){
  return gulp.src(sassSources)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Gulp Task for Compiling Sass
gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      // Can create an object here instead of using config.rb
      sass: 'components/sass', // src for sass
      image: outputDir + 'images', // src for imgs
      style: sassStyle // format for output: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload()) // reload webserver page after sass changes are compiled
});

gulp.task('html', function(){
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML())) // minify html if env is production
    .pipe(gulpif(env === 'production', gulp.dest(outputDir))) // save minified html to production dir
    .pipe(connect.reload()) // reload sebserver page after html changes
});


gulp.task('images', function(){
  gulp.src('builds/development/images/**/*.*') // get all images in the subfolders of images dir
    .pipe(gulpif(env === 'production', imageMin({
      // optimize images if env is production
      // compression/optimization options
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }], // don't need viewbox element for svgs
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images'))) // save optimized images to production dir
    .pipe(connect.reload()) // reload after compressing images
});

gulp.task('json', function(){
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonMinify())) // minify html if env is production
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js'))) // save minified html to production dir
    .pipe(connect.reload()) // reload sebserver page after html changes
});

// Watch/Monitor
gulp.task('watch', function(){
  gulp.watch('builds/development/*.html', ['html']) // reload when html is modified
  gulp.watch('builds/development/js/*.json', ['json']) // reload when json data is modified
  gulp.watch(coffeeSources, ['coffee']) // execute coffee task when coffeeSources are modified
  gulp.watch(jsSources, ['js']) // execute js task when jsSources are modified
  gulp.watch('builds/development/images/**/*.*', ['images']) // compress images when images are modified
  gulp.watch('components/sass/*.scss', ['compass']) // execute compass task when partials or style.scss changes
});

// Web Server with LiveReload
gulp.task('connect', function(){
  connect.server({
    // see https://www.npmjs.com/package/gulp-connect for server options
    root: 'builds/development',
    livereload: true

  })

});

// Gulp Task to Run all as dependency tasks
gulp.task('default', ['html', 'json','coffee', 'js', 'compass', 'images', 'connect', 'watch']);
