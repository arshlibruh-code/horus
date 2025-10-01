// horus AI Assistant - Simple Voice ID Interface
// CONFIG is already loaded from config.js

// Simple response caching
const responseCache = new Map();

// Voice mapping is now handled by audio.js module

// Audio generation is now handled by audio.js module
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
  
  // Check cache first - simple optimization
  const cacheKey = userInput.toLowerCase().trim();
  if (responseCache.has(cacheKey)) {
    console.log('Using cached response!');
    const cachedResponse = responseCache.get(cacheKey);
    
    // Add to chat immediately
    addMessageToChat(cachedResponse, 'ai');
    
    // Process for audio using audio.js (keep tags for ElevenLabs)
    const sentences = cachedResponse
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2))
      .filter(s => s.length > 0);
    
    if (sentences.length > 0) {
      const selectedAgent = document.getElementById('agentSelect').value;
      const voiceId = AudioModule.voices[selectedAgent];
      
      // Use audio.js streaming playback
      await AudioModule.streamingAudioPlayback(sentences, voiceId, selectedAgent);
    }
    
    return cachedResponse;
  }
  
  // Create streaming UI
  const messagesContainer = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = '<strong>AI:</strong> <span class="streaming-text"></span>';
  messagesContainer.appendChild(messageDiv);
  const streamingText = messageDiv.querySelector('.streaming-text');
  
  try {
    // Get AI response from ai.js
    const response = await AI.getAIResponse(userInput);
    
    // Update UI with clean text (no tags)
    const cleanResponse = response
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2))
      .map(line => line.replace(/\[[^\]]+\]/g, ''))
      .join(' ');
    
    streamingText.textContent = cleanResponse;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Cache the response
    responseCache.set(cacheKey, response);
    
    // Process for audio using audio.js (keep tags for ElevenLabs)
    const sentences = response
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2))
      .filter(s => s.length > 0);
    
    if (sentences.length > 0) {
      const selectedAgent = document.getElementById('agentSelect').value;
      const voiceId = AudioModule.voices[selectedAgent];
      
      // Use audio.js streaming playback
      await AudioModule.streamingAudioPlayback(sentences, voiceId, selectedAgent);
    }
    
    return response;
  } catch (error) {
    console.error('AI Error:', error);
    streamingText.textContent = 'Sorry, I encountered an error.';
    addMessageToChat('Sorry, I encountered an error.', 'ai');
  }
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
// TTS generation is now handled by audio.js module
// Audio context is now handled by audio.js module

// Audio player variables are now handled by audio.js module

// Audio player initialization is now handled by audio.js module

// Audio player functions are now handled by audio.js module
// Audio analysis functions are now handled by audio.js module
// Simple audio playback with HTML5 Audio
// Audio playback is now handled by audio.js module

// Progress animation functions are now handled by audio.js module
// Test function is now handled by audio.js module
// Main play function - now uses hybrid approach
async function playSelected() {
  const aiToggle = document.getElementById('aiToggle').classList.contains('active');
  const selectedAgent = document.getElementById('agentSelect').value;
  const voiceId = voices[selectedAgent];
  
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
      
      // Start Perlin animation
      startPerlinLoading(loadingDiv);
      
      // Fade in after a small delay
      setTimeout(() => {
        loadingDiv.classList.add('visible');
      }, 10);
      
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
    
    try {
      // For manual mode, process with audio.js streaming
      const sentences = text
        .split(/(?<=[.!?])\s+(?=\[)/) // Split after punctuation, before tags
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      if (sentences.length > 0) {
        // Use audio.js streaming playback (keeps tags for ElevenLabs)
        await AudioModule.streamingAudioPlayback(sentences, voiceId, selectedAgent);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}
// Toggle AI mode functionality
function toggleAIMode() {
  const aiToggle = document.getElementById('aiToggle');
  const textSelect = document.getElementById('textSelect');
  const playBtn = document.getElementById('playBtn');
  const inputArea = document.querySelector('.input-area');
  const responseTypeLabel = document.querySelector('label[for="textSelect"]');
  
  if (aiToggle.classList.contains('active')) {
    // Turn OFF AI mode
    aiToggle.classList.remove('active');
    aiToggle.textContent = 'AI MODE';
    textSelect.disabled = false;
    textSelect.style.display = 'block';
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
    responseTypeLabel.textContent = 'Response Type';
    playBtn.textContent = '▶';
    // Show the response controls container (includes play button)
    document.querySelector('.response-controls').style.display = 'flex';
    inputArea.style.display = 'none';
    // Remove AI mode class from container
    document.querySelector('.container').classList.remove('ai-mode');
    // Hide orb when AI mode is off
    destroyOrb();
    // Hide messages div when AI mode is off
    document.getElementById('messages').style.display = 'none';
    // Reset audio player when switching modes
    if (AudioModule.currentAudio) {
      AudioModule.currentAudio.pause();
      AudioModule.currentAudio = null;
      AudioModule.hideAudioPlayer();
    }
  } else {
    // Turn ON AI mode
    aiToggle.classList.add('active');
    aiToggle.textContent = 'AI MODE ON';
    textSelect.style.display = 'none';
    responseTypeLabel.textContent = 'Response type is being controlled by AI';
    // Hide the entire response controls container (includes play button)
    document.querySelector('.response-controls').style.display = 'none';
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
    // Focus the input box automatically
    setTimeout(() => {
      document.getElementById('messageInput').focus();
    }, 100);
  }
}
// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('horus AI system loaded');
    // Initialize audio player
    AudioModule.initAudioPlayer();
    // Setup AI toggle
    document.getElementById('aiToggle').addEventListener('click', toggleAIMode);
    // Auto-activate AI mode on load
    setTimeout(() => {
        toggleAIMode();
    }, 100);
    // Setup keyboard shortcut for AI toggle (Shift+L)
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
            e.preventDefault();
            toggleAIMode();
        }
    });
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

// Audio queue processing functions are now handled by audio.js module

// Perlin loading animation is now handled by orb.js module
