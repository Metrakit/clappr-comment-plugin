// Copyright 2014 Globo.com Clappr authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var glob = require('glob').sync;
var mkdirp = require('mkdirp').sync;
var path = require('path');
var fs = require('fs');
var _ = require('underscore');


var codeTemplate = _.template(fs.readFileSync('bin/.hook_template').toString());

var jstFile = './src/jst.js';

function format(filePath) {
  return fs.readFileSync(filePath).toString().replace(/\r?\n|\r/g, '');
}


function copyFiles(asset) {
  var targetDir = path.extname(asset) === '.js' ? 'dist/' : 'dist/assets';
  fs.createReadStream(asset)
    .pipe(fs.createWriteStream(path.join(targetDir, path.basename(asset))));
}



var html = [
  {name: 'add', content: glob('build/add.html').map(format)},
  {name: 'form', content: glob('build/form.html').map(format)},
];

var css = [
  {name: 'add', content: glob('build/add.css').map(format)},
  {name: 'form', content: glob('build/form.css').map(format)},
];


fs.writeFileSync(jstFile, codeTemplate({templates: html, styles: css}));

mkdirp('dist/assets/');

glob('./node_modules/clappr/dist/**/*.{png,jpeg,jpg,gif,swf,eot,ttf,svg}').map(copyFiles);
glob('public/*.{png,jpeg,jpg,gif,swf,eot,ttf,svg}').map(copyFiles);
glob('./node_modules/clappr/dist/*.js').map(copyFiles);
