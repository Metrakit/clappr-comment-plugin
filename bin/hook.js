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

function formatAddButton(filePath) {
  var content = fs.readFileSync(filePath).toString().replace(/\r?\n|\r/g, '');
  return {name: 'buttonAddComment', content: content};
}

function formatBarComments(filePath) {
  var content = fs.readFileSync(filePath).toString().replace(/\r?\n|\r/g, '');
  return {name: 'buttonBarComments', content: content};
}


function copyFiles(asset) {
  var targetDir = path.extname(asset) === '.js' ? 'dist/' : 'dist/assets';
  fs.createReadStream(asset)
    .pipe(fs.createWriteStream(path.join(targetDir, path.basename(asset))));
}



var templates = glob('build/add.html').map(formatAddButton);
var stylesAdd = glob('build/add.css').map(formatAddButton);

/*var templates = new Array;
templates.push(glob('build/add.html').map(formatAddButton));
templates.push(glob('build/bar.html').map(formatBarComments));*/
/*templates = templates + glob('build/bar.html').map(formatBarComments);
var stylesBar = glob('build/bar.css').map(formatBarComments);*/

fs.writeFileSync(jstFile, codeTemplate({templates: templates, styles: stylesAdd}));

//fs.writeFileSync(jstFile, codeTemplate({templates: templatesBar, styles: stylesBar}));

mkdirp('dist/assets/');

glob('./node_modules/clappr/dist/**/*.{png,jpeg,jpg,gif,swf,eot,ttf,svg}').map(copyFiles);
glob('public/*.{png,jpeg,jpg,gif,swf,eot,ttf,svg}').map(copyFiles);
glob('./node_modules/clappr/dist/*.js').map(copyFiles);
