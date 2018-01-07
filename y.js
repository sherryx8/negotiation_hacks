var fs = require('fs');

var negotiate = function() {
	console.log("hi")
    if (fs.existsSync('../../downloads/video.webm')) {
        //var fs = require('fs'),
        console.log("Point A")
        cloudconvert = new(require('cloudconvert'))('-WgHxJEKKYb2us305bs6tPqMOU4Yk_g7la5f6wz_3_vtwPeLbV2itvwdyZJtGeS9t6i34O_g7WXg5GrHMfZIrQ');
        console.log("Point B")
        fs.createReadStream('../../downloads/video.webm')
            .pipe(cloudconvert.convert({
                "inputformat": "webm",
                "outputformat": "flac",
                "input": "upload",
                "wait": "true"
            }))

            .pipe(fs.createWriteStream('outputfile.flac')).on('finish', function(file) {

                  console.log("B2");
                // Imports the Google Cloud client library
                const Speech = require('@google-cloud/speech');

                // Your Google Cloud Platform project ID
                const projectId = 'bamboo-depth-158505';

                const speechClient = Speech({
                    projectId: projectId
                });
                console.log("Point C")

                // The name of the audio file to transcribe
                const fileName = 'outputfile.flac';

                // The audio file's encoding and sample rate
                const options = {
                    encoding: 'FLAC',
                    sampleRate: 48000
                };
                console.log("Point D")

                // Detects speech in the audio file
                speechClient.recognize(fileName, options)
                    .then((results) => {

                        const transcription = results[0];
                        fs.writeFile('log.txt', transcription, function(err) {
                            if (err) {
                                // append failed
                            } else {
                                // done
                            }
                        })
                        console.log(`Transcription: ${transcription}`);
                        fs.unlinkSync('../../downloads/video.webm');
                        setTimeout(negotiate, 1000);


                    });
            });

    } else {
        setTimeout(negotiate, 1000);
    }

};
negotiate();
