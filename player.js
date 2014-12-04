/**
 * player.js, a node script that converts a large text file of newline-separated
 * wave freqencies into an mp3 file with each of those frequencies concatenated.
 * by Ian Zapolsky
 */

var exec = require('child_process').exec;
var fs   = require('fs');
var sys  = require('sys');

// make sure we have a filename
if (process.argv.length != 3) {
  console.log('usage: node player.js <filename>');
  process.exit();
} 
var filename = process.argv[2];
var contents = fs.readFileSync(filename, 'utf8').split('\n');

// sound constants
var DURATION = .1;
var WAVETYPE = 'sin';

var commands     = [];
var subcommands  = [];
var mediaryFiles = [];

for (var i = 0; i < contents.length; i++) {

  if (contents[i] === '') {
    break;
  }

  // build sound
  var frequency  = parseInt(contents[i]);
  var subcommand = ' "|sox -n -p synth ' + DURATION + ' ' + WAVETYPE + ' ' + frequency + '"';
  subcommands.push(subcommand);

  // write command to build a separate mp3 file for every 200 tones
  if (i % 200 === 0) {
    var fname   = 'output' + mediaryFiles.length + '.mp3';
    var command = 'sox --combine concatenate -v 1.0';
    for (var j = 0; j < subcommands.length; j++) {
      command += subcommands[j];
    }
    command += ' ' + fname + ' norm';
    commands.push(command);
    mediaryFiles.push(fname);
    subcommands = [];
  }
}

var buildFiles = function(commands) {
  if (commands.length === 0) {
    concatenateFinal(mediaryFiles);
  } else {
    var command = commands.shift();
    exec(command, function(error, stdout, stderr) {
      console.log('wrote new mp3 file');
      buildFiles(commands);
    });
  }
};

var concatenateFinal = function(mediaryFiles) {
  var command = 'sox --combine concatenate -v 1.0';
  for (var i = 0; i < mediaryFiles.length; i++) {
    command += ' ' + mediaryFiles[i];
  }
  command += ' final.mp3 norm';
  exec(command, function(error, stdout, stderr) {
    console.log('concatenated final version');
    var rmCommand = 'rm output*';
    exec(rmCommand, function(error, stdout, stderr) {
      console.log('removed mediary files');
    });
  });
};

buildFiles(commands);


