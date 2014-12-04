var exec = require('child_process').exec;
var fs   = require('fs');
var sys  = require('sys');

// make sure we have a filename
if (process.argv.length != 3) {
  console.log('usage: node player.js <filename>');
  process.exit();
} 

var subcommands  = [];
var mediaryFiles = [];

var filename = process.argv[2];
var contents = fs.readFileSync(filename, 'utf8').split('\n');

for (var i = 0; i < contents.length; i++) {
  if (contents[i] === '') {
    break;
  }
  var duration   = .1;
  var wavetype   = 'sin';
  var frequency  = parseInt(contents[i]);
  var subcommand = ' "|sox -n -p synth '+duration+' '+wavetype+' '+frequency+'"';
  subcommands.push(subcommand);
  if (i % 200 === 0) {
    var name = 'output'+mediaryFiles.length+'.mp3';
    var command = 'sox --combine concatenate -v 1.0';
    for (var j = 0; j < subcommands.length; j++) {
      command += subcommands[j];
    }
    subcommands = [];
    command += ' '+name+' norm';
    exec(command, function(error, stdout, stderr) {
      console.log('wrote '+name);
    });
    mediaryFiles.push(name);
  }
}

var command = 'sox --combine concatenate -v 1.0';
for (var i = 0; i < mediaryFiles.length; i++) {
  command += ' '+mediaryFiles[i];
}
command += ' ./final.mp3 norm';

exec(command, function(error, stdout, stderr) {
  console.log('wrote final');
});

//exec(command, function(error, stdout, stderr) {
//  console.log(stdout);
//  console.log(stderr);
//  console.log(error);
//});


