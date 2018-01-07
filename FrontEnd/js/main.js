'use strict';

/* globals MediaRecorder */

// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


if(getBrowser() == "Chrome"){
	var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome
}else if(getBrowser() == "Firefox"){
	var constraints = {audio: true,video: {  width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 }}}; //Firefox
}

var recBtn = document.querySelector('button#rec');
var pauseResBtn = document.querySelector('button#pauseRes');
var stopBtn = document.querySelector('button#stop');

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');

videoElement.controls = false;

function errorCallback(error){
	console.log('navigator.getUserMedia error: ', error);
}

/*
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var sourceBuffer;
*/

var mediaRecorder;
var chunks = [];
var count = 0;

function startRecording(stream) {
	log('Recording...');
	if (typeof MediaRecorder.isTypeSupported == 'function'){
		/*
			MediaRecorder.isTypeSupported is a function announced in 
			https://developers.google.com/web/updates/2016/01/mediarecorder 
			and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
		*/
		if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
		  var options = {mimeType: 'video/webm;codecs=h264'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		  var options = {mimeType: 'video/webm;codecs=vp9'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		  var options = {mimeType: 'video/webm;codecs=vp8'};
		}
		// log('Using '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream, options);
	}else{
		// log('Using default codecs for browser');
		mediaRecorder = new MediaRecorder(stream);
	}

	pauseResBtn.textContent = "Pause";

	mediaRecorder.start(10);
 
	var url = window.URL || window.webkitURL;
	//videoElement.src = url ? url.createObjectURL(stream) : stream;
	//videoElement.play();
	videoElement.controls = false;
	
	mediaRecorder.ondataavailable = function(e) {
		//log('Data available...');
		//console.log(e.data);
		//console.log(e.data.type);
		//console.log(e);
		chunks.push(e.data);
	};

	mediaRecorder.onerror = function(e){
		log('Error: ' + e);
		console.log('Error: ', e);
	};


	mediaRecorder.onstart = function(){
		// log('Started & state = ' + mediaRecorder.state);
	};

	mediaRecorder.onstop = function(){
		
		 log('Stopped  & state = ' + mediaRecorder.state);

		var blob = new Blob(chunks, {type: "video/webm"});	
		chunks = [];

		var videoURL = window.URL.createObjectURL(blob);

		downloadLink.href = videoURL;
		videoElement.src = videoURL;
		downloadLink.innerHTML = 'Download your pitch';

		// var rand =  Math.floor((Math.random() * 10000000));
		var name  = "video.webm" ;

		downloadLink.setAttribute( "download", name);
		downloadLink.setAttribute( "name", name);
		
	};

	mediaRecorder.onpause = function(){
		log('Paused & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onresume = function(){
		log('Resumed  & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onwarning = function(e){
		log('Warning: ' + e);
	};
}

//function handleSourceOpen(event) {
//  console.log('MediaSource opened');
//  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
//  console.log('Source buffer: ', sourceBuffer);
//}

function onBtnRecordClicked (){
	log("Recording ...");
	 if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
		alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}else {
		navigator.getUserMedia(constraints, startRecording, errorCallback);
		recBtn.disabled = true;
		pauseResBtn.disabled = false;
		stopBtn.disabled = false;
	}
}

function onBtnStopClicked(){
	
	
	
	mediaRecorder.stream.getTracks().forEach(function(track){track.stop();}); 

	bufferToDataUrl(function(dataUrl) {
   		var file = dataUrlToFile(dataUrl);
    	console.log(file);
    	//sendVideo(file);
    	//negotiate(file);
	});	
	videoElement.controls = true;

	recBtn.disabled = false;
	pauseResBtn.disabled = true;
	stopBtn.disabled = true;
	mediaRecorder.stop();
	
}

function onPauseResumeClicked(){
	if(pauseResBtn.textContent === "Pause"){
		console.log("pause");
		pauseResBtn.textContent = "Resume";
		mediaRecorder.pause();
		stopBtn.disabled = true;
	}else{
		console.log("resume");
		pauseResBtn.textContent = "Pause";
		mediaRecorder.resume();
		stopBtn.disabled = false;
	}
	recBtn.disabled = true;
	pauseResBtn.disabled = false;
}


function log(message){
	dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
}


//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}

	return browserName;
}


function bufferToDataUrl(callback) {
  var blob = new Blob(chunks, {type: 'video/webm'});

  var reader = new FileReader();
  reader.onload = function() {callback(reader.result);};
  reader.readAsDataURL(blob);
}


function dataUrlToFile(dataUrl) {
  var binary = atob(dataUrl.split(',')[1]),
  data = [];

  for (var i = 0; i < binary.length; i++)
    data.push(binary.charCodeAt(i));

  return new File([new Uint8Array(data)], 'video.webm', {
    type: 'video/webm'
  });
}
 

 var vfile;

function sendVideo(file){
	//var io = require('socket.io-client')
	vfile = file;
	console.log(vfile.name);
  var socket = io.connect('http://localhost:8080', {reconnect: true});
  console.log("sending");

  socket.on('connect', function(){
  	console.log("connected");
  	console.log(vfile.name);
    var delivery = new Delivery(socket);
 	
    delivery.on('delivery.connect',function(delivery){  
    	console.log('deliveryattempt')
    	console.log(vfile.name);
    	var extraParams = {foo: 'bar'};
        delivery.send(vfile, extraParams);
       
    });
 
    delivery.on('send.success',function(fileUID){
      console.log("file was successfully sent.");
    });
  });
};

function negotiate(videoFile) {
	console.log("negotiating");

	var fs = require('fs'),
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
  // append failed
	}

  console.log(`Transcription: ${transcription}`);
});
});

//fs.unlinkSync('../../downloads/video.webm');
});

};



 
