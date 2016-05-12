var gulp = require('gulp');
var winInstaller = require('electron-windows-installer');

gulp.task('create-windows-installer', function(done) {
  winInstaller({
    appDirectory: './privtv-win32-x64',
    outputDirectory: './release',
    arch: 'ia32'
  }).then(done).catch(done);
});
