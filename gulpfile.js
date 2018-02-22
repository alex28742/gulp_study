var gulp = require('gulp'),
    sass = require('gulp-sass'), // перечислять можно через запятую
    browserSync = require('browser-sync');

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
  .pipe(browserSync.reload({stream:true}))
});

// подключаем метод слежения
gulp.task('watch',['browser-sync','sass'],function(){
  gulp.watch('app/sass/*.sass',['sass']);// указываем за какими файлами следим
  // через запятую указываем массив тасков которые будем выполнять если что-то изменится
  // следим теперь из за файлами html
  gulp.watch('app/*.html', browserSync.reload);
  // сделим за файлами скриптов
  gulp.watch('app/js/**/*.js', browserSync.reload);

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
