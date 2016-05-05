"use strict"; 

const worker = require("streaming-worker");
const through = require('through');
const path = require("path");

var addon_path = path.join(__dirname, "build/Release/even_odd_worker");

const receiver = worker(addon_path, {name:"receiver"});
const source = worker(addon_path, {name: "source", start:5});

// Build stream from source emitter - streams output from source addon
var source_stream = source.build_output_stream();

// Build input stream around the receiver so it can accept data over stream interface
var receiver_input_stream = receiver.build_input_stream(
    function () {
        receiver.toAddon.emit('data', -1);
    });

// Pipe output from source to input of receiver.
source_stream.pipe(receiver_input_stream);

// Pipe output of receiver to stdout
var receiver_output_stream = receiver.build_output_stream()
                        .pipe(through(function(data) {
                            console.log("Output:  " + data[0] + " -> " + data[1]);
                        }));

// Emit some data to source addon to start generating sequences
source.toAddon.emit("start", 10);
source.toAddon.emit("start", -1);


// Build input stream which converts to emission events for the receiver.
/*var through = require('through');
var receiver_input_stream = through(function write(data) {
    if ( data[0] == "close"){
        this.end();
    }
    else {
        receiver.toAddon.emit(data[0], data[1]);
    }
  },
  // Need to close the receiver stream - this needs to be customizeable
  // since the receiver addon might be looking for another sentinal
  function end () { //optional
    receiver.toAddon.emit('data', -1);
  })
*/




/*
receiver.fromAddon.on('error', function(e) {
    console.log(e);
});
receiver.fromAddon.on('close', function(){
    console.log("receiver emitter has closed");
});
*/

/*
source.fromAddon.on('close', function() {
    console.log("Source Emitter closed");
})*/
/*
receiver.fromAddon.on('even_event', function(value){
    console.log("EVEN:  " + value);
});
receiver.fromAddon.on('odd_event', function(value){
    console.log("ODD:   " + value);
});
*/

/*
setTimeout(function() {
    sw.toAddon.emit("start", 50);
    sw.toAddon.emit("start", 36);
    sw.toAddon.emit("start", -1);
}, 5000);
*/






/*
sw.fromAddon.on('even_event', function(value){
    console.log("EVEN:  " + value);
});

sw.fromAddon.on('odd_event', function(value){
    console.log("ODD:   " + value);
});
*/

