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

const path = {
	src:{
		html:"app/index.html",
		styles:[
			"app/css/fonts.css",
			"app/css/vendors/bootstrap.css",
			"app/css/vendors/et-line.css",
			"app/css/vendors/all.min.css",
			"app/css/style.css"
			
		],
	
		fonts: ["app/fonts/**/*","app/webfonts/**/*"],
		images:"app/img/**/*"
	},
	build :{
		html:"build",
		js: "build/js/",
		css: "build/css/",
		fonts:"build/fonts/",
		images:"build/img/"
	}
};

gulp.task("js",function() {
	return gulp
	.src(path.src.js)
	.pipe(uglify())
	.pipe(concat("main.js"))
	.pipe(gulp.dest(path.build.js))
	.pipe( reload({stream: true}));
});
gulp.task("css",function(){
	return gulp
	.src(path.src.styles)
	.pipe(minifyCss())
	.pipe(concat("main.css"))
	.pipe(gulp.dest(path.build.css))
	.pipe( reload({stream: true}));
});
gulp.task("html",function(){
	return gulp
		.src(path.src.html)
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
]
				  ,
				  {
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
	'gulp css',
	'gulp js',
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
			baseDir: "build"
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
	gulp.watch("app/css/**/*.css", ['css'])
	gulp.watch("app/css/**/*.js", ['css'])
 });
 
 gulp.task("server", function() {
	runSequence("build", "browser-sync", "watch");
 
 });
 gulp.task('sass', function () {
    return gulp.src('./app/css/sass/app.scss')
     .pipe(sourcemaps.init())
     .pipe(sass().on('error', sass.logError))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('./app/css'));
   });
 gulp.task ( "default", ['server']);
