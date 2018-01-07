var fs = require('fs');

var negotiate = function (videoFile) {
	console.log("negotiating");

	//converts file 
	cloudconvert = new (require('cloudconvert'))('hwcepP9agCGP-8xWIa-lqjhc8KnPjAtnegMRNSy3q1qDHLow25ckwIueVyx73PWXr2oV0b9MxkBRoskc9VPVZg');

	fs.createReadStream(videoFile)
	.pipe(cloudconvert.convert({
 	 "inputformat": "webm",
  	"outputformat": "flac",
 	 "input": "upload",
 	 "wait": "true"
	}))

.pipe(fs.createWriteStream('outputfile.flac')).on('finish', function(file){
console.log("converted"); 

// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = 'bamboo-depth-158505';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = 'outputfile.flac';

// The audio file's encoding and sample rate
const options = {
  encoding: 'FLAC',
  sampleRate: 48000
};

// Detects speech in the audio file
speechClient.recognize(fileName, options)
.then((results) => {
  const transcription = results[0];
  fs.writeFile('log.txt', transcription, function (err) {
    if (err) {
      console.log(err);
  // append failed
	}

  console.log(`Transcription: ${transcription}`);
});
});


//fs.unlinkSync('../../downloads/video.webm');
});

};

// var negotiate = function () {
// 
//   if(fs.existsSync('../../downloads/video.webm')){
//   	console.log("if");
// 	//var fs = require('fs'),
// 	//converts file
// 	cloudconvert = new (require('cloudconvert'))('hwcepP9agCGP-8xWIa-lqjhc8KnPjAtnegMRNSy3q1qDHLow25ckwIueVyx73PWXr2oV0b9MxkBRoskc9VPVZg');
// 
// 	fs.createReadStream('../../downloads/video.webm')
// 	.pipe(cloudconvert.convert({
//  	 "inputformat": "webm",
//   	"outputformat": "flac",
//  	 "input": "upload",
//  	 "wait": "true"
// 	}))
// 
// .pipe(fs.createWriteStream('outputfile.flac')).on('finish', function(file){
// console.log("converted");
// 
// // Imports the Google Cloud client library
// const Speech = require('@google-cloud/speech');
// 
// // Your Google Cloud Platform project ID
// const projectId = 'bamboo-depth-158505';
// 
// // Instantiates a client
// const speechClient = Speech({
//   projectId: projectId
// });
// 
// // The name of the audio file to transcribe
// const fileName = 'outputfile.flac';
// 
// // The audio file's encoding and sample rate
// const options = {
//   encoding: 'FLAC',
//   sampleRate: 48000
// };
// 
// // Detects speech in the audio file
// speechClient.recognize(fileName, options)
// .then((results) => {
//   const transcription = results[0];
//   fs.writeFile('log.txt', transcription, function (err) {
//     if (err) {
//   // append failed
// } else {
//   // done
// }
// })
//   console.log(`Transcription: ${transcription}`);
// });
// });
// 
// fs.unlinkSync('../../downloads/video.webm');
// };
// 
// setTimeout(negotiate, 1000);
// console.log("else");
// };





//open webpage
var http = require('http');
var express = require('express'); var app = express();

app.use( express.static( __dirname + '/FrontEnd'));

app.get( '/', function( req, res ) {
    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

//app.listen(8080);

var server = http.createServer(app);

server.listen(8080);
console.log('page on http://localhost:8080');

//socket.io
var io  = require('socket.io').listen(server),
    dl  = require('delivery'),
    fs  = require('fs');

    //server.listen(5001);
 
io.on('connection', function(socket){
	socket.emit("connect");
	//console.log("client connected");
  var delivery = dl.listen(socket);
  delivery.on('receive.success',function(file){
    var params = file.params;
    console.log("file recieved");
    //negotiate(file);
     fs.writeFile(file.name,file.buffer, function(err){
       if(err){
         console.log('File could not be saved.');
       }else{

         console.log('File saved.');

         //negotiate(file);
      };
    });
     negotiate(file.name);
  });
});

//negotiate();