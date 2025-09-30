// Simple test script with 10 different audio tags
// CONFIG is already loaded from config.js

// Test text with 10 different audio tags
const testText = `[excited] Yo bro! [chuckles] What's up my dude? [playfully] Let's hang out and code some cool stuff! [whispers] I've got some sick ideas for you. [laughs] This is gonna be epic! [nervous] Hope you like my personality. [cheerfully] I'm always here for you man! [sigh] Sometimes I get tired of being so awesome. [deadpan] That was a joke. [calm] But seriously, I'm your AI buddy now.`;

// Thinking audio for when processing
const thinkingText = `[humming] Hmm, let me think about that... [humming] Um, let me process this... [humming] Hmmm, interesting question... [humming] Let me analyze this for you... [humming] Hmm, that's a good point... [humming] Um, let me think... [humming] Hmmm, let me consider this... [humming] Um, that's a tricky one... [humming] Hmm, let me process... [humming] Um, let me think about that...`;

// Eleven v3 TTS with audio tags
async function textToSpeech(text, voiceId = 'TX3LPaxmHKxFdv7VOQHJ') {
  console.log('🎤 Converting text to speech:', text);
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': CONFIG.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_v3', // Latest v3 alpha
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      },
      output_format: 'mp3_44100_128' // Required for v3 audio tags
    })
  });
  
  console.log('✅ Audio generated successfully');
  return response.arrayBuffer();
}

// Audio context reuse
let audioContext = null;
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Simple audio playback
async function playAudio(audioBuffer) {
  console.log('🔊 Playing audio...');
  const audioContext = getAudioContext();
  const audioBufferSource = audioContext.createBufferSource();
  const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
  audioBufferSource.buffer = audioBufferDecoded;
  audioBufferSource.connect(audioContext.destination);
  audioBufferSource.start();
  console.log('🎵 Audio playback started');
}

// Test function
async function testAudioTags() {
  console.log('🚀 Testing 10 different audio tags...');
  console.log('📝 Test text:', testText);
  
  try {
    const audioBuffer = await textToSpeech(testText);
    await playAudio(audioBuffer);
    console.log('🎉 Test complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Auto-run test when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 horus AI system loaded');
  console.log('🔧 Running audio tag test...');
  
  // Add play button
  const playButton = document.createElement('button');
  playButton.textContent = '🎵 Play horus Audio Test';
  playButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1000;
  `;
  
  // Add thinking button
  const thinkingButton = document.createElement('button');
  thinkingButton.textContent = '🤔 Play Thinking Audio';
  thinkingButton.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1000;
  `;
  
  playButton.addEventListener('click', async () => {
    try {
      console.log('🚀 Testing 10 different audio tags...');
      console.log('📝 Test text:', testText);
      
      const audioBuffer = await textToSpeech(testText);
      await playAudio(audioBuffer);
      console.log('🎉 Test complete!');
    } catch (error) {
      console.error('❌ Error playing test audio:', error);
    }
  });
  
  thinkingButton.addEventListener('click', async () => {
    try {
      console.log('🤔 Playing thinking audio...');
      console.log('📝 Thinking text:', thinkingText);
      
      const audioBuffer = await textToSpeech(thinkingText);
      await playAudio(audioBuffer);
      console.log('🎉 Thinking audio complete!');
    } catch (error) {
      console.error('❌ Error playing thinking audio:', error);
    }
  });
  
  document.body.appendChild(playButton);
  document.body.appendChild(thinkingButton);
  console.log('🎵 Click the blue button to play audio!');
  console.log('🤔 Click the green button to play thinking audio!');
});
