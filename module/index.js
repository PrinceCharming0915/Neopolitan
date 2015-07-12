'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var getDirCount = require('../helpers/get-dir-count');
var path = require('path');
var pjson = require(path.join(process.cwd(), './package.json'));
var config = pjson.config;
var directories = config.directories;

var ModuleGenerator = module.exports = function ModuleGenerator() {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  var fileJSON = this.config.get('config');

  // options
  this.projectName = fileJSON.projectName;
  this.jsFramework = fileJSON.jsFramework;
  this.singlePageApplication = fileJSON.singlePageApplication;
  this.jsOption = fileJSON.jsOption;
  this.jsTemplate = fileJSON.jsTemplate;
  this.cssOption = fileJSON.cssOption;
  this.sassSyntax = fileJSON.sassSyntax;
  this.testFramework = fileJSON.testFramework;
  this.htmlOption = fileJSON.htmlOption;
  this.useDashboard = fileJSON.useDashboard;

};

util.inherits(ModuleGenerator, yeoman.generators.NamedBase);

// Prompts
ModuleGenerator.prototype.ask = function ask() {

  var self = this;
  var done = this.async();
  var prompts = [{
    name: 'moduleFile',
    message: 'Where would you like to create this module?',
    default: function(answers) {
      return config ? directories.source + '/' + directories.modules : directories.source + '/_modules';
    }
  }, {
    when: function(answers) {
      return self.jsFramework === 'angular';
    },
    name: 'moduleURL',
    message: 'URL of new module?',
    default: '/someurl'
  }];

  this.prompt(prompts, function(answers) {

    this.templateFile = path.join(
      answers.moduleFile,
      this._.slugify(this.name.toLowerCase()),
      this._.slugify(this.name.toLowerCase())
    );

    this.moduleFile = path.join(
      answers.moduleFile,
      this._.slugify(this.name.toLowerCase()),
      this._.slugify(this.name.toLowerCase())
    );

    // Get source directory
    this.rootDir = getDirCount(this.moduleFile.replace(directories.source + '/', ''));

    this.testFile = path.join(
      answers.moduleFile,
      this._.slugify(this.name.toLowerCase()),
      '__tests__',
      this._.slugify(this.name.toLowerCase())
    );

    this.dashFile = path.join(
      answers.moduleFile,
      this._.slugify(this.name.toLowerCase()),
      '__dash__',
      this._.slugify(this.name.toLowerCase()) + '.dash'
    );

    this.moduleURL = answers.moduleURL;

    this.htmlURL = path.join(
      answers.moduleFile.replace('src', ''),
      this._.slugify(this.name.toLowerCase()),
      this._.slugify(this.name.toLowerCase()),
      '.html'
    );

    done();
  }.bind(this));
};

ModuleGenerator.prototype.files = function files() {

  if (this.jsFramework === 'angular') {
    this.template('angular/module.js', this.moduleFile + '.js');
    this.template('angular/module.controller.js', this.moduleFile + '.controller.js');
    this.template('angular/module.html', this.moduleFile + '.html');

    if (this.testFramework !== 'none') {
      this.template('angular/module.spec.js', this.testFile + '.controller.spec.js');
    }
  }
  else if (this.jsFramework === 'react') {
    this.template('react/module.jsx', this.moduleFile + '.jsx');

    if (this.testFramework !== 'none') {
      this.template('react/module.spec.js', this.testFile + '.spec.js');
    }
  }
  else if (this.jsFramework === 'marionette') {
    this.template('marionette/module.js', this.moduleFile + '.js');
    if (this.testFramework !== 'none') {
      this.template('marionette/module.spec.js', this.testFile + '.spec.js');
    }

    this.template('marionette/module.html', this.moduleFile + '.jst');
  }

  if (this.cssOption === 'sass') {
    if (this.sassSyntax === 'sass') {
      this.template('module.css', this.moduleFile + '.sass');
    }
    else {
      this.template('module.css', this.moduleFile + '.scss');
    }
  }
  else if (this.cssOption === 'less') {
    this.template('module.css', this.moduleFile + '.less');
  }
  else if (this.cssOption === 'stylus') {
    this.template('module.css', this.moduleFile + '.styl');
  }
};
