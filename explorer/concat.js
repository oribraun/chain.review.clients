var concat = require('concat-files');
var del = require('del');
var folder = process.argv[2];
// console.log(process.argv)
var files = [
    './' + folder + '/scripts.js',
    './' + folder + '/runtime-es2015.js',
    './' + folder + '/runtime-es5.js',
    './' + folder + '/polyfills-es2015.js',
    './' + folder + '/polyfills-es5.js',
    './' + folder + '/main-es2015.js',
    './' + folder + '/main-es5.js'
];
var fileName = 'script.js';
concat(files, './' + folder + '/' + fileName, function(err) {
    if (err) throw err
    del(files).then(function() {
        console.log('done');
    });
    console.log('./' + folder + '/' + folder.replace('out', '') + '.html')
    del('./' + folder + '/' + folder.replace('-out', '') + '.html').then(function() {
        console.log('done');
    });
});
