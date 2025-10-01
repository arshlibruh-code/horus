/**
 * AUDIO.JS - ElevenLabs Integration & Audio Processing
 * Handles TTS generation, audio playback, and audio controls
 * Updated: Fixed voiceSettings declaration - v2.0
 */

// ============================================================================
// CONFIGURATION & STATE
// ============================================================================

// Voice mapping with different voice IDs
const voices = {
  horus: 'JBFqnCBsd6RMkjVDRZzb', // JARVIS-like voice for horus
  liam: 'TX3LPaxmHKxFdv7VOQHJ', // Current voice for liam
  jason: '5kMbtRSEKIkRZSdXxrZg', // Jason voice
  bruh: 'MSwNgeU7k5EwCzAzV4O9', // Bruh voice
  viraj: 'iWNf11sz1GrUE4ppxTOL'  // VIRAJ voice for radio app
};

// Voice settings for different agents
const audioVoiceSettings = {
  horus: {
    stability: 0.5,        // Natural - balanced
    similarity_boost: 0.8  // Clear, professional
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
  return audioVoiceSettings[agent] || audioVoiceSettings.horus;
}

// Audio context for Web Audio API
let audioContext = null;

// Audio player state
let currentAudio = null;
let audioPlayer = null;
let lastAudioData = null; // Store last audio for download
let progressBar = null;
let replayBtn = null;
let progressAnimation = null;

// Audio queue system
let audioQueue = [];
let isPlaying = false;

// ============================================================================
// AUDIO CONTEXT MANAGEMENT
// ============================================================================

/**
 * Get or create audio context
 * @returns {AudioContext} - Audio context instance
 */
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AUDIO: Audio context created');
    }
    return audioContext;
}

// ============================================================================
// ELEVENLABS TTS INTEGRATION
// ============================================================================

/**
 * Generate speech from text using ElevenLabs API
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - ElevenLabs voice ID
 * @param {string} agent - Agent name for voice settings
 * @returns {Promise<ArrayBuffer>} - Audio buffer
 */
async function generateSpeech(text, voiceId, agent) {
    console.log('AUDIO: Starting TTS generation');
    console.log('AUDIO: Text (WITH emotional tags):', text);
    console.log('AUDIO: Voice ID:', voiceId);
    console.log('AUDIO: Agent:', agent);
    
    const startTime = Date.now();
    
    try {
        // Get voice settings for agent
        const settings = getVoiceSettings(agent);
        console.log('AUDIO: Voice settings:', settings);
        
        // Prepare request body
        const requestBody = {
            text: text,
            model_id: 'eleven_v3',
            voice_settings: {
                stability: settings.stability,
                similarity_boost: settings.similarity_boost
            }
        };
        
        console.log('AUDIO: Calling ElevenLabs API...');
        
        // Make API call
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
            console.error('AUDIO: API Error:', errorText);
            throw new Error(`ElevenLabs API Error: ${response.status} - ${errorText}`);
        }
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`AUDIO: TTS generation complete in ${duration}s`);
        
        const audioBuffer = await response.arrayBuffer();
        console.log('AUDIO: Audio buffer size:', audioBuffer.byteLength, 'bytes');
        
        // Store audio data for download
        lastAudioData = audioBuffer;
        
        return audioBuffer;
        
    } catch (error) {
        console.error('AUDIO: Error generating speech:', error);
        throw error;
    }
}

/**
 * Generate multiple audio files in parallel
 * @param {Array<string>} sentences - Array of text sentences
 * @param {string} voiceId - ElevenLabs voice ID
 * @param {string} agent - Agent name
 * @returns {Promise<Array<ArrayBuffer>>} - Array of audio buffers
 */
async function generateMultipleAudio(sentences, voiceId, agent) {
    console.log('AUDIO: Generating multiple audio files in parallel');
    console.log('AUDIO: Number of sentences:', sentences.length);
    console.log('AUDIO: Sentences:', sentences);
    
    const startTime = Date.now();
    
    try {
        // Generate all audio files simultaneously
        const audioPromises = sentences.map((sentence, index) => {
            console.log(`AUDIO: Starting generation for sentence ${index + 1}/${sentences.length}:`, sentence);
            return generateSpeech(sentence, voiceId, agent);
        });
        
        const audioBuffers = await Promise.all(audioPromises);
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`AUDIO: All ${sentences.length} audio files generated in ${duration}s`);
        
        return audioBuffers;
        
    } catch (error) {
        console.error('AUDIO: Error generating multiple audio files:', error);
        throw error;
    }
}

// ============================================================================
// AUDIO PLAYBACK
// ============================================================================

/**
 * Play audio buffer with comprehensive controls
 * @param {ArrayBuffer} audioBuffer - Audio data to play
 * @returns {Promise<void>} - Resolves when audio finishes
 */
async function playAudio(audioBuffer) {
    console.log('AUDIO: Starting audio playback');
    console.log('AUDIO: Audio buffer size:', audioBuffer.byteLength, 'bytes');
    
    return new Promise((resolve, reject) => {
        try {
            // Convert ArrayBuffer to Blob URL
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);
            console.log('AUDIO: Created blob URL for playback');
            
            // Create HTML5 Audio element
            currentAudio = new Audio(audioUrl);
            console.log('AUDIO: Created audio element');
            
            // Convert ArrayBuffer to Web Audio Buffer for analysis
            const audioContext = getAudioContext();
            audioContext.decodeAudioData(audioBuffer.slice()).then(webAudioBuffer => {
                console.log('AUDIO: Decoded audio data for analysis');
                
                // Show audio player
                showAudioPlayer();
                
                // Setup audio events
                currentAudio.addEventListener('ended', () => {
                    console.log('AUDIO: Audio playback ended');
                    replayBtn.textContent = '▶';
                    updateOrbScale(1);
                    stopProgressAnimation();
                    // Clean up blob URL
                    URL.revokeObjectURL(audioUrl);
                    resolve(); // Resolve when audio finishes
                });
                
                // Play audio
                console.log('AUDIO: Starting audio playback');
                
                // Fade out loading indicator when audio starts
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.style.transition = 'opacity 0.5s ease-out';
                    loadingIndicator.style.opacity = '0';
                    setTimeout(() => {
                        if (loadingIndicator.parentNode) {
                            loadingIndicator.parentNode.removeChild(loadingIndicator);
                        }
                    }, 500);
                }
                
                currentAudio.play();
                replayBtn.textContent = '⏸';
                
                // Start smooth progress animation
                startProgressAnimation();
                
                // Update orb during playback with real audio analysis
                const updateOrb = () => {
                    if (currentAudio && !currentAudio.paused) {
                        // Real audio analysis using Web Audio Buffer
                        const progress = currentAudio.currentTime / currentAudio.duration;
                        const volume = analyzeAudioRealtime(webAudioBuffer, currentAudio.currentTime, 0.1);
                        const scale = 0.8 + (volume * 2.0);
                        updateOrbScale(scale);
                        updateOrbIntensity(volume);
                        requestAnimationFrame(updateOrb);
                    }
                };
                updateOrb();
                
            }).catch(reject);
            
        } catch (error) {
            console.error('AUDIO: Error in audio playback:', error);
            reject(error);
        }
    });
}

/**
 * Play multiple audio files sequentially
 * @param {Array<ArrayBuffer>} audioBuffers - Array of audio buffers
 * @returns {Promise<void>} - Resolves when all audio finishes
 */
async function playAudioSequentially(audioBuffers) {
    console.log('AUDIO: Starting sequential audio playback');
    console.log('AUDIO: Number of audio files:', audioBuffers.length);
    
    for (let i = 0; i < audioBuffers.length; i++) {
        console.log(`AUDIO: Playing audio ${i + 1}/${audioBuffers.length}`);
        await playAudio(audioBuffers[i]);
        console.log(`AUDIO: Finished playing audio ${i + 1}/${audioBuffers.length}`);
    }
    
    console.log('AUDIO: All audio files played successfully');
}

/**
 * Streaming audio playback with continuous processing and sequential playback.
 * Processes sentences in parallel (max 5 concurrent) and plays them in order.
 * @param {Array<string>} sentences - Array of sentences with emotional tags.
 * @param {string} voiceId - ElevenLabs voice ID.
 * @param {string} agent - Agent name for voice settings.
 * @returns {Promise<void>}
 */
async function streamingAudioPlayback(sentences, voiceId, agent) {
    console.log(`AUDIO: Starting streaming audio playback for ${sentences.length} sentences`);
    
    const readyQueue = new Array(sentences.length).fill(null);
    let nextToPlay = 0;
    let currentlyPlaying = false;
    let processingIndex = 0;
    let completedCount = 0;
    
    const playNextInSequence = async () => {
        if (currentlyPlaying || nextToPlay >= sentences.length) return;
        if (!readyQueue[nextToPlay]) return;
        
        currentlyPlaying = true;
        console.log(`AUDIO: Playing audio ${nextToPlay + 1}/${sentences.length}`);
        await playAudio(readyQueue[nextToPlay]);
        nextToPlay++;
        currentlyPlaying = false;
        
        // Try to play next immediately
        playNextInSequence();
    };
    
    const processNext = async () => {
        if (processingIndex >= sentences.length) return;
        const currentIndex = processingIndex++;
        
        console.log(`AUDIO: Processing sentence ${currentIndex + 1}/${sentences.length}: ${sentences[currentIndex]}`);
        const audioBuffer = await generateSpeech(sentences[currentIndex], voiceId, agent);
        readyQueue[currentIndex] = audioBuffer;
        completedCount++;
        
        console.log(`AUDIO: Sentence ${currentIndex + 1} completed (${completedCount}/${sentences.length})`);
        
        // Try to play immediately if it's the next in sequence
        playNextInSequence();
        
        // Start next processing immediately if there are more sentences
        if (processingIndex < sentences.length) {
            processNext();
        }
    };
    
    // Start first 5 processes immediately
    console.log(`AUDIO: Starting processing for first ${Math.min(5, sentences.length)} sentences`);
    for (let i = 0; i < Math.min(5, sentences.length); i++) {
        processNext();
    }
    
    // Wait for all processing to complete
    while (completedCount < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Wait for all audio to finish playing
    while (nextToPlay < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('AUDIO: Streaming audio playback completed!');
}

// ============================================================================
// AUDIO CONTROLS
// ============================================================================

/**
 * Initialize audio player elements
 */
// Download last audio as MP3 file
function downloadLastAudio() {
    if (!lastAudioData) {
        console.log('AUDIO: No audio data to download');
        return;
    }
    
    console.log('AUDIO: Downloading last audio response...');
    
    // Create blob from audio data
    const blob = new Blob([lastAudioData], { type: 'audio/mpeg' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horus-response-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.mp3`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('AUDIO: Download started');
}

function initAudioPlayer() {
    console.log('AUDIO: Initializing audio player');
    
    audioPlayer = document.getElementById('audioPlayer');
    progressBar = document.getElementById('progressBar');
    replayBtn = document.getElementById('replayBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (!audioPlayer || !progressBar || !replayBtn) {
        console.error('AUDIO: Required audio player elements not found');
        return;
    }
    
    // Setup replay button
    replayBtn.addEventListener('click', togglePlay);
    
    // Setup download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadLastAudio);
    }
    
    // Setup progress bar with drag support
    const progressContainer = document.querySelector('.audio-progress');
    if (progressContainer) {
        progressContainer.addEventListener('click', seekTo);
        progressContainer.addEventListener('mousedown', startDrag);
    }
    
    console.log('AUDIO: Audio player initialized successfully');
}

/**
 * Show audio player
 */
function showAudioPlayer() {
    if (audioPlayer) {
        audioPlayer.style.display = 'flex';
        setTimeout(() => {
            audioPlayer.classList.add('visible');
        }, 10);
    }
}

/**
 * Hide audio player
 */
function hideAudioPlayer() {
    if (audioPlayer) {
        audioPlayer.classList.remove('visible');
        setTimeout(() => {
            audioPlayer.style.display = 'none';
        }, 500);
    }
}

/**
 * Toggle play/pause
 */
function togglePlay() {
    if (currentAudio && !currentAudio.paused) {
        console.log('AUDIO: Pausing audio');
        currentAudio.pause();
        stopProgressAnimation();
        replayBtn.textContent = '▶';
    } else if (currentAudio) {
        console.log('AUDIO: Resuming audio');
        currentAudio.play();
        startProgressAnimation();
        replayBtn.textContent = '⏸';
    }
}

/**
 * Seek to position
 * @param {Event} event - Click event
 */
function seekTo(event) {
    if (!currentAudio) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percentage * currentAudio.duration;
    
    console.log('AUDIO: Seeking to position:', seekTime, 'seconds');
    currentAudio.currentTime = seekTime;
}

/**
 * Start drag for seeking
 * @param {Event} event - Mouse down event
 */
function startDrag(event) {
    event.preventDefault();
    stopProgressAnimation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const updateDrag = (e) => {
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const seekTime = percentage * currentAudio.duration;
        currentAudio.currentTime = seekTime;
        updateProgressBar();
    };
    
    document.addEventListener('mousemove', updateDrag);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', updateDrag);
        if (currentAudio && !currentAudio.paused) {
            startProgressAnimation();
        }
    });
}

// ============================================================================
// PROGRESS ANIMATION
// ============================================================================

/**
 * Start smooth progress animation
 */
function startProgressAnimation() {
    if (progressAnimation) return;
    
    const animate = () => {
        if (currentAudio && progressBar && !currentAudio.paused) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = progress + '%';
            progressAnimation = requestAnimationFrame(animate);
        } else {
            progressAnimation = null;
        }
    };
    progressAnimation = requestAnimationFrame(animate);
}

/**
 * Stop progress animation
 */
function stopProgressAnimation() {
    if (progressAnimation) {
        cancelAnimationFrame(progressAnimation);
        progressAnimation = null;
    }
}

/**
 * Update progress bar immediately
 */
function updateProgressBar() {
    if (currentAudio && progressBar) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressBar.style.width = progress + '%';
    }
}

// ============================================================================
// AUDIO ANALYSIS
// ============================================================================

/**
 * Analyze audio buffer for volume
 * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
 * @returns {number} - RMS volume value
 */
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

/**
 * Real-time audio analysis
 * @param {AudioBuffer} audioBuffer - Audio buffer
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {number} - Volume value
 */
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

// ============================================================================
// EXPORTS
// ============================================================================

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        generateSpeech,
        generateMultipleAudio,
        playAudio,
        playAudioSequentially,
        streamingAudioPlayback,
        initAudioPlayer,
        showAudioPlayer,
        hideAudioPlayer,
        togglePlay,
        seekTo,
        startDrag,
        analyzeAudio,
        analyzeAudioRealtime,
        downloadLastAudio
    };
} else {
    // Browser environment - functions are globally available
    window.AudioModule = {
        voices,
        generateSpeech,
        generateMultipleAudio,
        playAudio,
        playAudioSequentially,
        streamingAudioPlayback,
        initAudioPlayer,
        showAudioPlayer,
        hideAudioPlayer,
        togglePlay,
        seekTo,
        startDrag,
        analyzeAudio,
        analyzeAudioRealtime,
        downloadLastAudio
    };
}
