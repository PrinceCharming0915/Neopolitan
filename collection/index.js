'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var getDirCount = require('../helpers/get-dir-count');
var path = require('path');
var pjson = require(path.join(process.cwd(), './package.json'));
var config = pjson.config;
var directories = config.directories;

var CollectionGenerator = module.exports = function CollectionGenerator() {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  var fileJSON = this.config.get('config');

  // options
  this.useModel = this.options.model || false;
  this.jsFramework = fileJSON.jsFramework;
  this.jsOption = fileJSON.jsOption;
  this.singlePageApplication = fileJSON.singlePageApplication;
  this.testFramework = fileJSON.testFramework;

};

util.inherits(CollectionGenerator, yeoman.generators.NamedBase);

// Prompts
CollectionGenerator.prototype.ask = function ask() {
  if (this.jsFramework !== 'marionette') {
    this.log('This subgenerator is only used for Backbone Applications. It seems as though you are not using Backbone');
    this.log('Operation aborted');
    this.abort = true;
    return;
  }

  var done = this.async();
  var prompts = [{
    name: 'collectionFile',
    message: 'Where would you like to create this collection?',
    default: config ?
    directories.source + '/' + directories.scripts + '/collections' :
    'src/_scripts/collections'
  }, {
    name: 'existingModelName',
    message: 'What is the name of the model you would like to use with this collection?',
    default: this.name + '-model'
  }, {
    name: 'existingModelLocation',
    message: 'What folder is the model file located in?',
    default: config ? directories.source + '/' + directories.scripts + '/models' : 'src/_scripts/models'
  }];

  this.prompt(prompts, function(answers) {
    this.modelName = answers.existingModelName;

    this.collectionFile = path.join(
        answers.collectionFile,
        this._.slugify(this.name.toLowerCase()),
        this._.slugify(this.name.toLowerCase())
      );

    console.log(this.collectionFile);

    // Get root directory
    this.rootDir = getDirCount(
      this.collectionFile.replace(directories.source + '/' + directories.scripts + '/collections', '')
    );

    this.modelFile = path.join(
      answers.existingModelLocation.replace(directories.source + '/' + directories.scripts + '/', ''),
      this._.slugify(answers.existingModelName.toLowerCase()),
      this._.slugify(answers.existingModelName.toLowerCase())
    );

    this.testFile = path.join(
        answers.collectionFile,
        this._.slugify(this.name.toLowerCase()),
        '__tests__',
        this._.slugify(this.name.toLowerCase())
      );

    done();
  }.bind(this));
};

// Create files
CollectionGenerator.prototype.files = function files() {
  if (this.abort) {
    return;
  }

  if (this.jsOption === 'browserify') {
    this.template('browserify/collection.js', this.collectionFile + '.js');
    if (this.testFramework !== 'none') {
      this.template('browserify/collection.spec.js', this.testFile + '.spec.js');
    }
  }

};
