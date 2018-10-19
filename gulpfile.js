const gulp = require ("gulp");//подключаем gulp
const uglify = require ("gulp-uglify");//минифицирование js
const concat = require ("gulp-concat");//конкатынация файлов, склеивает файдлы
const minifyCss = require ("gulp-minify-css");
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence'); 
const reload = browserSync.reload;
const sass = require('gulp-sass');
const sourcemaps = require ('gulp-sourcemaps');
const rigger = require('gulp-rigger');

const path = {
	src:{
		html:["app/index.html",
		"app/components/*.html"],
		styles21:["app/styles/upload_product.css","app/styles/fontawesome/fontawesome.css"],
		styles28:["app/styles/contact.css","app/styles/fontawesome/fontawesome.css"],
		styles23:["app/styles/withdrawals.css","app/styles/fontawesome/fontawesome.css"],
		styles4:["app/styles/all_new_item.css","app/styles/fontawesome/fontawesome.css"],
		styles3:["app/styles/main.css","app/styles/fontawesome/fontawesome.css"],
		fonts: "app/fonts/**/*",
		images:"app/img/**/*"
	},
	build :{
		html:"build/",
		css: "build/styles/",
		fonts:"build/fonts/",
		images:"build/img/"
	}
};

gulp.task("css21",function(){
	return gulp
	.src(path.src.styles21)
	.pipe(minifyCss())
	.pipe(concat("upload_product.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("css28",function(){
	return gulp
	.src(path.src.styles28)
	.pipe(minifyCss())
	.pipe(concat("contact.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("css23",function(){
	return gulp
	.src(path.src.styles23)
	.pipe(minifyCss())
	.pipe(concat("withdrawals.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("css4",function(){
	return gulp
	.src(path.src.styles4)
	.pipe(minifyCss())
	.pipe(concat("all_new_item.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("css3",function(){
	return gulp
	.src(path.src.styles3)
	.pipe(minifyCss())
	.pipe(concat("main.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("html",function(){
	return gulp
		.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe( reload({stream: true}));
});
gulp.task("img",function(){
	return gulp
	.src(path.src.images)
	.pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ], {
        verbose: true
    }))
	.pipe(gulp.dest(path.build.images))
});

gulp.task("clean",function(){
	return gulp.src('build').pipe(clean())
});
gulp.task("build",shell.task([
	'gulp clean',
	'gulp img',
	'gulp html',
	'gulp sass',
	'gulp css21',
	'gulp css28',
	'gulp css23',
	'gulp css4',
	'gulp css3',
	'gulp font',
	
]));
gulp.task("font",function(){
	return gulp
	.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts));
});
gulp.task("browser-sync", function (){
	browserSync({
		startPath: "/",
		server: {
			baseDir: "build/"
		},
		notify: false
	});
 });
 gulp.task ("server", shell.task([
	"gulp build",
	"gulp browser-sync",
	"gulp watch"
	])
 );
 
 gulp.task("watch", function (){
	gulp.watch("app/index.html", ['html'])
	gulp.watch("app/components/*.html", ['html'])
    gulp.watch("app/styles/scss/*.scss", ['sass'])
	gulp.watch("app/styles/upload_product.css", ['css21'])
	gulp.watch("app/styles/contact.css", ['css28'])
	gulp.watch("app/styles/withdrawals.css", ['css23'])
	gulp.watch("app/styles/all_new_item.css", ['css4'])
	gulp.watch("app/styles/main.css", ['css3'])
 });
 
 gulp.task("server", function() {
	runSequence("build", "browser-sync", "watch");
 
 });
 gulp.task('sass', function () {
    return gulp.src('./app/styles/scss/**/*')
     .pipe(sourcemaps.init())
     .pipe(sass().on('error', sass.logError))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('./app/styles'));
   });
 gulp.task ( "default", ['server']);
 