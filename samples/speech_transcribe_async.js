/**
 * Copyright 2019, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

function main(
  filepath = 'path/to/audio.raw',
  encoding = 'LINEAR16',
  sampleRateHertz = 16000,
  languageCode = 'en-US'
) {
  // [START speech_transcribe_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const filepath = 'path/to/audio.raw';
  // const encoding = 'LINEAR16';
  // const sampleRateHertz = 16000;
  // const languageCode = 'en-US';

  // Imports the Google Cloud Speech API client library.
  const speech = require('@google-cloud/speech');

  // Import other required libraries.
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);

  // Creates a client.
  const client = new speech.SpeechClient();

  async function transcribeAsync() {
    // Get the bytes of the file.
    const fileBytes = Buffer.from(await readFile(filepath)).toString('base64');

    const request = {
      audio: {
        content: fileBytes,
      },
      config: {
        // Encoding of the audio file, e.g. 'LINEAR16'.
        encoding: encoding,
        // Sample rate in Hertz of the audio data sent.
        sampleRateHertz: sampleRateHertz,
        // BCP-47 language code, e.g. 'en-US'.
        languageCode: languageCode,
      },
    };

    // Detects speech in the audio file using a long-running operation. You can
    // wait for now, or get its results later.
    const [operation] = await client.longRunningRecognize(request);

    // Wait for operation to complete.
    const [response] = await operation.promise();

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  }

  transcribeAsync(filepath, encoding, sampleRateHertz, languageCode);
  // [END speech_transcribe_async]
}

main(...process.argv.slice(2));
