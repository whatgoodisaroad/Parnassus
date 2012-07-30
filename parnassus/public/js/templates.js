
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["ide_tab"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<iframe');
buf.push(attrs({ 'frameBorder':(0), 'src':(src) }, {"frameBorder":true,"src":true}));
buf.push('></iframe>');
}
return buf.join("");
}
jade.templates["mini_status"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<dl class="mini-status"><dt>Branch</dt><dd>');
var __val__ = repo.get("branch")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</dd><dt>Staged Changes</dt><dd>');
var __val__ = repo.get("staged").length
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</dd><dt>Unstaged Changes</dt><dd>');
var __val__ = repo.get("unstaged").length
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</dd><dt>Untracked Files</dt><dd>');
var __val__ = repo.get("untracked").length
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</dd></dl>');
}
return buf.join("");
}
jade.templates["workspace"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="main-topbar"><div class="breadcrumbs"></div><div class="clearfix"></div></div><div class="changeset"><div id="status"><iframe');
buf.push(attrs({ 'src':("/status/" + name), 'frameBorder':(0) }, {"src":true,"frameBorder":true}));
buf.push('></iframe></div></div><div class="open-files"><ul id="ide-tabs" class="nav nav-tabs"></ul><div id="tab-content" class="tab-content"></div></div>');
}
return buf.join("");
}
jade.templates["workspaces"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="main-topbar"><div class="btn-group"><a class="btn view-control active"><i class="icon-list-ul"></i></a><a class="btn view-control"><i class="icon-th"></i></a></div><div class="breadcrumbs"></div><div class="clearfix"></div></div><ul class="workspaces">');
// iterate workspaces
;(function(){
  if ('number' == typeof workspaces.length) {
    for (var $index = 0, $$l = workspaces.length; $index < $$l; $index++) {
      var workspace = workspaces[$index];

buf.push('<li');
buf.push(attrs({ 'data-path':(workspace.get("path")) }, {"data-path":true}));
buf.push('><div><h1>');
var __val__ = workspace.get("name")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h1><div class="status"></div></div></li>');
    }
  } else {
    for (var $index in workspaces) {
      var workspace = workspaces[$index];

buf.push('<li');
buf.push(attrs({ 'data-path':(workspace.get("path")) }, {"data-path":true}));
buf.push('><div><h1>');
var __val__ = workspace.get("name")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h1><div class="status"></div></div></li>');
   }
  }
}).call(this);

buf.push('</ul>');
}
return buf.join("");
}