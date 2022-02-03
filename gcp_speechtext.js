// Cloud Speech-to-Text API
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');
const speechClient = new speech.SpeechClient();

exports.gcp_speechText = function(d){
    const encoding = 'LINEAR16';
    const filename = d;
    const model = 'default';
    const sampleRateHertz = 16000;
    const languageCode = 'ja-jp';

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        model: model,
    };
    const audio = {
        content: fs.readFileSync(filename).toString('base64'),
    };
    process.stdout.write(audio);
    const request = {
        config: config,
        audio: audio,
    };

    const [response] = speechClient.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    process.stdout.write(`Transcription: ${transcription}`);
}