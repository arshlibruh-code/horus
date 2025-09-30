// horus AI Assistant - Simple Voice ID Interface
// CONFIG is already loaded from config.js
// Voice mapping with different voice IDs
const voices = {
  horus: 'JBFqnCBsd6RMkjVDRZzb', // JARVIS-like voice for horus
  liam: 'TX3LPaxmHKxFdv7VOQHJ', // Current voice for liam
  jason: '5kMbtRSEKIkRZSdXxrZg', // Jason voice
  bruh: 'MSwNgeU7k5EwCzAzV4O9', // Bruh voice
  viraj: 'iWNf11sz1GrUE4ppxTOL'  // VIRAJ voice for radio app
};
// Voice settings per agent (v3 only allows 0.0, 0.5, 1.0 for stability)
const voiceSettings = {
  horus: {
    stability: 1.0,        // Robust - consistent, confident like JARVIS
    similarity_boost: 0.5  // Less clone-like, more personality
  },
  liam: {
    stability: 0.0,        // Creative - more varied, natural
    similarity_boost: 0.8  // More like the original voice
  },
  jason: {
    stability: 0.5,        // Natural - balanced
    similarity_boost: 0.7  // Good similarity
  },
  bruh: {
    stability: 0.0,        // Creative - casual, varied
    similarity_boost: 0.6  // Less formal
  },
  viraj: {
    stability: 0.5,        // Natural - radio DJ style
    similarity_boost: 0.8  // Clear, professional
  }
};
// Get voice settings for agent
function getVoiceSettings(agent) {
  return voiceSettings[agent] || voiceSettings.horus;
}
// Add message to chat window
function addMessageToChat(message, type) {
  const messagesContainer = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  if (type === 'user') {
    messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
  } else {
    // Remove tags from AI messages for display
    const cleanMessage = message.replace(/\[[^\]]+\]/g, '');
    messageDiv.innerHTML = `<strong>AI:</strong> ${cleanMessage}`;
  }
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// Get AI response from Perplexity with streaming
async function getAIResponse(userInput) {
  console.log('Getting AI response for:', userInput);
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {role: 'system', content: 'You are an emotional text analyzer. Your job is to analyze the user\'s message and respond with emotional tags that match the tone and language. ANALYSIS PROCESS: 1. Read the user\'s message carefully 2. Identify the emotional tone (happy, sad, angry, excited, etc.) 3. Match the user\'s energy level (high, medium, low) 4. Consider the formality level (casual, professional, intimate) 5. Add appropriate emotional tags throughout your response. TAG PLACEMENT RULES: - Place tags at natural speech breaks - Use 3-5 tags per response - Match tag intensity to user\'s tone - Vary tags to show emotional range. EXAMPLES: User: "hey there sweety" → [warmly] Hey there! [playfully] That\'s so sweet! [cheerfully] How are you doing? User: "I\'m really frustrated" → [worried] I understand your frustration. [calm] Let me help you work through this. [confidently] We can figure this out together. User: "OMG that\'s amazing!" → [excited] That\'s fantastic news! [laughs] I\'m so happy for you! [cheerfully] Tell me more about it! AVAILABLE TAGS: [excited], [calm], [whispers], [laughs], [nervous], [cheerfully], [playfully], [confidently], [worried], [chuckles], [sighs], [gasps], [hesitates], [warmly], [casually]. RESPOND IN ONE PARAGRAPH WITH EMOTIONAL TAGS THROUGHOUT. Keep under 300 characters.'},
        {role: 'user', content: userInput}
      ],
      max_tokens: 100,
      stream: true
    })
  });
  
  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }
  
  // Handle streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';
  
  // Create AI message element for streaming
  const messagesContainer = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = '<strong>AI:</strong> <span class="streaming-text"></span>';
  messagesContainer.appendChild(messageDiv);
  const streamingText = messageDiv.querySelector('.streaming-text');
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            // Streaming complete
            streamingText.textContent = fullResponse.replace(/\[[^\]]+\]/g, '');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return fullResponse;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              // Update UI with streaming text
              streamingText.textContent = fullResponse.replace(/\[[^\]]+\]/g, '');
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  
  return fullResponse;
}
// Removed second Perplexity call - keeping it simple
// 15 Text Categories with 5 Audio Tags Each
const textCategories = {
  greetings: `[cheerfully] Hello there! [excited] Great to see you! [warmly] Welcome back! [playfully] Hey buddy! [calm] Good to meet you!`,
  goodbyes: `[warmly] See you later! [playfully] Catch you soon! [calm] Take care now! [cheerfully] Until next time! [whispers] Bye for now!`,
  happy: `[laughs] That's fantastic! [excited] I'm thrilled! [cheerfully] This is wonderful! [playfully] Amazing news! [giggles] So happy!`,
  sad: `[sorrowful] I'm so sorry... [whispers] That's heartbreaking... [calm] I understand your pain... [tired] This is difficult... [sighs] My condolences.`,
  tension: `[nervous] This is concerning... [hesitates] I'm worried... [flatly] This is serious... [whispers] Something's wrong... [anxiously] I'm not sure...`,
  excited: `[excited] This is incredible! [laughs] I can't believe it! [playfully] This is so cool! [cheerfully] Amazing! [giggles] So exciting!`,
  anxious: `[nervous] I'm not sure... [hesitates] Maybe we should... [worried] I'm concerned... [anxiously] What if... [whispers] I'm scared...`,
  thinking: `[humming] Hmm, let me think... [pauses] Let me process... [calm] Interesting question... [slowly] Let me analyze... [hesitates] Um, let me consider...`,
  confident: `[confidently] I've got this! [assuredly] No problem! [calm] I can handle this... [cheerfully] Easy peasy! [playfully] Piece of cake!`,
  surprised: `[gasps] Really? [excited] No way! [amazed] That's unexpected! [laughs] You're kidding! [playfully] Get out of here!`,
  frustrated: `[frustrated] This is annoying... [sighs] I'm getting tired... [flatly] Not again... [tired] This is exhausting... [grumbles] Seriously?`,
  relieved: `[sigh of relief] Finally! [calm] That's better... [cheerfully] Much better now! [laughs] Thank goodness! [playfully] Crisis averted!`,
  mysterious: `[whispers] I know something... [mysteriously] There's more... [chuckles] You'll see... [playfully] Wait and watch... [secretively] Shh, listen...`,
  professional: `[formally] I've prepared the report... [calm] Shall I proceed? [confidently] I've noted your request... [assuredly] Consider it done... [professionally] I'll handle this.`,
  casual: `[chuckles] Hey dude! [playfully] What's up? [relaxed] Just hanging out... [cheerfully] How's it going? [casually] Not much, you?`
};
// Eleven v3 TTS with simple voice settings
async function textToSpeech(text, voiceId, agent) {
  console.log(`Playing ${agent} voice...`);
  console.log(`Text: ${text}`);
  const startTime = Date.now();
  console.log('Waiting for ElevenLabs API response...');
  const settings = getVoiceSettings(agent);
  const requestBody = {
    text: text,
    model_id: 'eleven_v3',
    voice_settings: {
      stability: settings.stability,
      similarity_boost: settings.similarity_boost
    }
  };
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': CONFIG.ELEVENLABS_API_KEY
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`API Response Time: ${duration}s`);
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
// Analyze audio buffer for volume
function analyzeAudio(audioBuffer) {
  const samples = audioBuffer.getChannelData(0);
  let sum = 0;
  // Calculate RMS (Root Mean Square) for volume
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  return rms;
}
// Real-time audio analysis
function analyzeAudioRealtime(audioBuffer, startTime, duration) {
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor((startTime + duration) * sampleRate);
  let sum = 0;
  let count = 0;
  for (let i = startSample; i < Math.min(endSample, samples.length); i++) {
    sum += samples[i] * samples[i];
    count++;
  }
  if (count === 0) {
    return 0;
  }
  const rms = Math.sqrt(sum / count);
  return rms;
}
// Simple audio playback with real-time visualizer
async function playAudio(audioBuffer) {
  try {
  const audioContext = getAudioContext();
  const audioBufferSource = audioContext.createBufferSource();
  const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
  audioBufferSource.buffer = audioBufferDecoded;
  audioBufferSource.connect(audioContext.destination);
    // Simple real-time analysis using elapsed time
    const startTime = Date.now();
    const duration = audioBufferDecoded.duration * 1000; // Convert to ms
    // Update orb every 10ms during playback
    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) { 
         
        
        clearInterval(updateInterval);
        updateOrbScale(1); // Reset to normal size
        return;
      }
      // Convert elapsed time to audio position
      const audioTime = elapsed / 1000; // Convert back to seconds
      const volume = analyzeAudioRealtime(audioBufferDecoded, audioTime, 0.05);
      const scale = 0.3 + (volume * 3.0); // Map volume to scale 0.3-3.3 (much more dramatic)
      updateOrbScale(scale);
      // Also update intensity for more visual effect
      updateOrbIntensity(volume * 2.0);
    }, 10);
    
    // Hide loading indicator when audio actually starts
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
      loadingElement.remove();
    }
    
    audioBufferSource.start();
  } catch (error) {
    console.error('Audio playback error:', error);
    throw error;
  }
}
// Test function
async function testAudioTags() {
  try {
    const audioBuffer = await textToSpeech(testText);
    await playAudio(audioBuffer);
  } catch (error) {
    console.error(' Error:', error);
  }
}
// Play selected audio
async function playSelected() {
  const aiToggle = document.getElementById('aiToggle').classList.contains('active');
  const selectedAgent = document.getElementById('agentSelect').value;
  const voiceId = voices[selectedAgent];
  let text;
  if (aiToggle) {
    // AI Mode - get user input from textarea
    const userInput = document.getElementById('messageInput').value;
    if (!userInput.trim()) {
      console.error('Please enter a message for AI mode');
      return;
    }
    try {
      // Add user message to chat
      addMessageToChat(userInput, 'user');
      
      // Show loading indicator immediately
      const messagesContainer = document.getElementById('messages');
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'loadingIndicator';
      loadingDiv.className = 'loading-indicator';
      messagesContainer.appendChild(loadingDiv);
      
      // Get AI response with streaming (already adds to chat)
      text = await getAIResponse(userInput);
    } catch (error) {
      console.error('AI Error:', error.message);
      return;
    }
  } else {
    // Manual Mode - use selected text category
    const selectedText = document.getElementById('textSelect').value;
    text = textCategories[selectedText];
  }
  try {
    const audioBuffer = await textToSpeech(text, voiceId, selectedAgent);
      await playAudio(audioBuffer);
    } catch (error) {
    console.error('Error:', error.message);
  }
}
// Toggle AI mode functionality
function toggleAIMode() {
  const aiToggle = document.getElementById('aiToggle');
  const textSelect = document.getElementById('textSelect');
  const playBtn = document.getElementById('playBtn');
  const inputArea = document.querySelector('.input-area');
  if (aiToggle.classList.contains('active')) {
    // Turn OFF AI mode
    aiToggle.classList.remove('active');
    aiToggle.textContent = 'AI MODE';
    textSelect.disabled = false;
    textSelect.innerHTML = `
      <option value="greetings" selected>Greetings</option>
      <option value="goodbyes">Goodbyes</option>
      <option value="happy">Happy</option>
      <option value="sad">Sad</option>
      <option value="tension">Tension</option>
      <option value="excited">Excited</option>
      <option value="anxious">Anxious</option>
      <option value="thinking">Thinking</option>
      <option value="confident">Confident</option>
      <option value="surprised">Surprised</option>
      <option value="frustrated">Frustrated</option>
      <option value="relieved">Relieved</option>
      <option value="mysterious">Mysterious</option>
      <option value="professional">Professional</option>
      <option value="casual">Casual</option>
    `;
    playBtn.textContent = '▶';
    playBtn.style.display = 'flex';
    inputArea.style.display = 'none';
    // Remove AI mode class from container
    document.querySelector('.container').classList.remove('ai-mode');
    // Hide orb when AI mode is off
    destroyOrb();
    // Hide messages div when AI mode is off
    document.getElementById('messages').style.display = 'none';
  } else {
    // Turn ON AI mode
    aiToggle.classList.add('active');
    aiToggle.textContent = 'AI MODE ON';
    textSelect.disabled = true;
    textSelect.innerHTML = '<option>AI is controlling response type</option>';
    playBtn.style.display = 'none';
    inputArea.style.display = 'flex';
    // Add AI mode class to container
    document.querySelector('.container').classList.add('ai-mode');
    // Show orb when AI mode is on
    initOrb();
    // Reset orb for smooth fade in
    if (orb) {
      orb.reset();
    }
    // Show messages div when AI mode is on
    document.getElementById('messages').style.display = 'block';
  }
}
// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('horus AI system loaded');
    // Hide input area and messages on load (AI mode starts OFF)
    document.querySelector('.input-area').style.display = 'none';
    document.getElementById('messages').style.display = 'none';
    // Setup AI toggle
    document.getElementById('aiToggle').addEventListener('click', toggleAIMode);
    // Setup Enter key for input
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const aiToggle = document.getElementById('aiToggle').classList.contains('active');
            if (aiToggle) {
                playSelected();
                // Clear input field after sending
                this.value = '';
            }
        }
    });
    // Setup Send button (only for manual mode)
    document.getElementById('sendBtn').addEventListener('click', function() {
        const aiToggle = document.getElementById('aiToggle').classList.contains('active');
        if (!aiToggle) {
            playSelected();
        }
    });
    // Don't initialize orb by default - only when AI mode is on
});
