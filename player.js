var exec = require('child_process').exec;
var fs   = require('fs');
var sys  = require('sys');

// make sure we have a filename
if (process.argv.length != 3) {
  console.log('usage: node player.js <filename>');
  process.exit();
} 

// this script will produce a single sox command, which will comprise the whole piece
var command  = 'play';
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
  command += subcommand;
}

fs.writeFile('command.txt', command, function(err) {
  if (err) console.log(err);
});

