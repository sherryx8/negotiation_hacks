var fs = require('fs');
var feedback = "no feedback yet";

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
var transcription = "like like like"; 
// Detects speech in the audio file
 speechClient.recognize(fileName, options)
 .then((results) => {
   transcription = results[0];
   fs.writeFile('log.txt', transcription, function (err) {
     if (err) {
       console.log(err);
   // append failed
 	}

  console.log(`Transcription: ${transcription}`);
  feedback = judge(parse(transcription));
  console.log(feedback);
  fs.writeFile('feedback.txt', feedback, function (err){
    if (err){console.log(err);}
  });
  //console.log(fs.get(feedback.txt));
  //socket.emit()
});
});


//fs.unlinkSync('../../downloads/video.webm');
});
 
};


function judge(cList){
    response = ""

    response += check_ums(cList);
    response += '\n' + check_likes(cList);
    response += '\n' + check_profanity(cList);
    response += '\n' + check_threat(cList);
    response += '\n' + check_fam(cList);

    return response;
  }


function check_ums(clist){
  var counter = 0;
  for(i = 0; i < clist.length; i++){
    if(clist[i] === "um"){
      counter++;
    }
  }

  if (counter > (0.10*clist.length)){
    return "Using the word 'um' over and over is detracting from your message.\n";
  }else if (counter > (0.50*clist.length)){
    return "It seems like you are using several filler words. We suggest taking a deep breath instead of saying a word like 'um'.\n";
  }else{
    return "You did a great job speaking fluently and clearly.\n";
  }

}

function check_likes(clist){
  var counter = 0;
  for(i = 0; i < clist.length; i++){
    if(clist[i] === "like"){
      counter++;
    }
  }
  if (counter > (0.10*clist.length)){
    return "Using the word 'like' is making your pitch weaker.";
  }else if (counter > (0.50*clist.length)){
    "We suggest you use the word 'like' less frequently.";
  }else{
    return "Nice job avoiding using the common filler word 'like'!";
  }
}


function check_profanity(clist){
  var profanity = ["shit", "fuck", "fucking","damn", "bitch", "tits", "screwed", "hell", "piss", "bastard", "shut up", "stupid", "ass"];
  for(i = 0; i < clist.length; i++){
    if (profanity.includes(clist[i])){
      return "Please refrain from using profanity while negotiating.";
    }
  }
  return "Your language is appropriate for this conversation.";
}

function check_threat(clist){
  var threats =  ["leave", "quit", "abandon"];
  for(i = 0; i < clist.length; i++){
    if (threats.includes(clist[i])){
      return "We advise that you are more positive in your conversation instead of threatening to quit.";
    }
  }
  return "Good job in staying positive!";
}

function check_fam(clist){
  var fam = ["family", "kids", "kid", "child", "children", "husband", "mom", "mother"];
  var counter = 0;
  for(i = 0; i < clist.length; i++){
    if (fam.includes(clist[i])){
      counter ++;
    }
  } 
  if(counter > 0.05*clist.length){
    return "Family is important, but we want to hear about your achievements and goals!";
  } else{
    return "You sound very self-motivated and confident!";
  }
}

function parse(transcription){
  var cList = transcription.split(" ");

    for(i = 0; i < transcription.length-1; i++){
      if( transcription.substr(i, 2)==="  "){
        cList.push("um");
      }
    }

    return cList
}



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

app.get('/getfeedback', function(req, res){
  console.log("getfeedback request recieved");
  res.send(feedback);
  console.log("feedback sent");
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

  
  socket.emit("heres ur feedback", feedback);
  
  // delivery.on('delivery.connect',function(delivery){
  //   //console.log("deliv connected");
  //   delivery.sendAsText({
  //     name: 'feedback.txt',
  //     path : './feedback.txt',
  //   });

  //   
  //   delivery.on('send.success',function(file){
  //     console.log('File successfully sent to client!');
  //   });

  // });

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




