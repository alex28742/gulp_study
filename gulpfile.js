var gulp = require('gulp'),
    sass = require('gulp-sass'), // перечислять можно через запятую
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');

gulp.task('myTask',function(){
	console.log('hello I am a task');
});


gulp.task('sass',function(){
	return gulp.src('app/sass/*.sass')// берем файл исходник (и сразу его возвращаем)
	.pipe(sass())// выполняем команду нашего плагина
	.pipe(gulp.dest('app/css'))// выводим результат(указываем только папки!)
  //Тестовый вызов: в консоли gulp sass (выполняем gulp.task('sass'...))
	//Результат: видим что стили появились в css/main.css
  // инжектим наши стили
  .pipe(browserSync.reload({stream:true}));
});

// создаем таск для канкатенации скриптов библиотек в один файл и их минификации.
gulp.task('scripts', function(){
  // возвращаем значение.. несколько файлов поэтому будем возвращать массив ([])
  return gulp.src([
    // перебираем файлы которые подключим (минифицированные)
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
  ])
  // дальше пишем pipe в котором канкатенируем файлы в один
  .pipe(concat('libs.min.js')) // libs.min.js - произвольное имя.. даем сами
  // сжимаем этот файл.
  .pipe(uglify())
  // указываем куда выгрузить сжатый файл
  .pipe(gulp.dest('app/js')); // указываем только директорию!
});

// пишем таск который будет сжимать css библиотеки
gulp.task('css-libs',['sass'], function(){
    return gulp.src('app/css/libs.css') // в этом файле мы подключили все библиотеки
    // дальше мы его минифицируем
    .pipe(cssnano())
    // переименюем файл и добавим суфикс
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));// указали куда выгружаем
});

// task для очистки папки продакшена dist
gulp.task('clean', function(){
  return del.sync('dist');// синхронизируется и удаляется папка dist
  // при выполнении gulp clean папка dist удаляется.
});

// таск для очистки кэша
gulp.task('clear', function(){
  // будем вручную запускать при необходимости очистки кэша
  return cache.clearAll();
});

// таск обработки изображений
gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  // дальше производим сжатие.. imagemin имеет параметры {....}
  .pipe(cache(imagemin({
    // параметры
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}], // для работы с svg
    use: [pngquant()]
  })))
  // выгружаем
  .pipe(gulp.dest('dist/img'));
});

// подключаем метод слежения
gulp.task('watch',['browser-sync','css-libs','scripts'],function(){
  gulp.watch('app/sass/*.sass',['sass']);// указываем за какими файлами следим
  // через запятую указываем массив тасков которые будем выполнять если что-то изменится
  // следим теперь из за файлами html
  gulp.watch('app/*.html', browserSync.reload);
  // сделим за файлами скриптов
  gulp.watch('app/js/**/*.js', browserSync.reload);

});

gulp.task('build',['clean','img','sass', 'scripts'], function(){
  // из app в dist перенести файлы.
  // если нам надо обработать несколько src и сделать мультифункциональный таск
  // создаем переменную и присваиваем ей src всех файлов ктороые будем переносить
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css',
  ])
  // пишем куда будем выгружать при выполнеии сборки (build)..(указываем только директории!)
  .pipe(gulp.dest('dist/css'));
  // если будем использовать шрифты.. тоже должны их перенести
  var buildFonts = gulp.src('app/fonts/**/*') // выбираем все.. включая поддиректории
  // отправляем шрифты в дистрибутив
  .pipe(gulp.dest('dist/fonts')); // если шрифтов нет.. создаваться ничего не будет
  // дальше надо перенести все js файлы
  var buildJs = gulp.src('app/js/**/*')
  // переносим
  .pipe(gulp.dest('dist/js'));
  // переносим html
  var buildHtml = gulp.src('app/*.html')
  // выгружаем
  .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync',function(){
  //browserSync({});//{здесь определяем параметры}
  // 1-й параметр - сервер в нашем случае это папка app
  browserSync({
    server:{
      baseDir:'app'
    },
    // убираем уведомления brawser browser Sync
    notify:false

  });
});
