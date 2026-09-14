const { src, dest, watch, series, parallel } = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

function htmlTask() {
  return src("src/app/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function scssTask() {
  return src("src/app/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src("src/app/js/**/*.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function imgTask() {
  return src("src/app/imgs/**/*").pipe(imagemin()).pipe(dest("dist/imgs"));
}

function serveTask() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
}

function watchTask() {
  watch("src/app/**/*.html", htmlTask);
  watch("src/app/scss/**/*.scss", scssTask);
  watch("src/app/js/**/*.js", jsTask);
  watch("src/app/imgs/**/*", imgTask);
}

exports.default = series(
  parallel(htmlTask, scssTask, jsTask, imgTask),
  parallel(serveTask, watchTask),
);
