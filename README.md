# horus - Highly Organized Response Utility System

Building my own JARVIS - a personal AI that will eventually manage my entire digital life.

![horus AI Demo](assets/demos/horus-demo.gif)

## Listen to horus in Action

Experience horus AI responses with different emotional tones and personalities:

### Recent AI Responses
<audio controls>
  <source src="assets/audio/horus-response-2025-10-01T21-05-48.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
*Latest horus response - Professional tone*

<audio controls>
  <source src="assets/audio/horus-response-2025-10-01T21-05-26.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
*AI response with emotional context*

<audio controls>
  <source src="assets/audio/horus-response-2025-10-01T21-04-25.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
*Longer AI conversation with streaming*

## The Vision

I want my own JARVIS. Not just another chatbot, but a real AI companion that:
- Controls my devices and manages my digital world
- Helps me create and build things
- Handles my routine tasks and organization
- Learns my patterns and grows with me
- Feels like talking to a real person

This is the foundation for that dream.

## Why I'm Building This

Current AI assistants suck. They're cold, impersonal, and can't actually help manage your life. I want something that feels human and can actually take care of my digital existence.

horus is my attempt to build that.

## What It Does Now

- **AI Chat**: Real-time streaming chat with emotional responses
- **Voice**: ElevenLabs v3 with emotional audio tags and streaming playback
- **Visualization**: Audio-reactive orb that shows AI "thinking"
- **Multiple Agents**: Different AI personalities to choose from
- **Modular Architecture**: Clean separation of AI, audio, and UI logic
- **Testing Suite**: Comprehensive module testing for development

## Current Progress

### Recently Completed (Latest Update)
- **Modular Architecture**: Refactored monolithic code into clean, focused modules
- **Streaming AI Responses**: Real-time text display with Perplexity integration
- **Audio-Reactive Visualization**: Orb responds dynamically to voice patterns
- **Enhanced Voice System**: ElevenLabs v3 with emotional audio tags
- **Development Tools**: Comprehensive testing suite and module validation
- **Performance Optimization**: Response caching and smooth animations

### In Progress
- Fine-tuning audio-visual synchronization
- Expanding AI agent personalities
- Improving error handling and edge cases

### Next Steps
- Device integration capabilities
- File management features
- Advanced learning algorithms
- Multi-modal interactions (voice + text + visual)

## Quick Start

1. **Clone and setup**
   ```bash
   git clone https://github.com/arshlibruh-code/horus.git
   cd horus
   ```

2. **Add your API keys to config.js**
   ```bash
   # Add ELEVENLABS_API_KEY and PERPLEXITY_API_KEY
   ```

3. **Run it**
   ```bash
   npx serve .
   # or
   python3 -m http.server 3000
   ```

4. **Open http://localhost:3000**
5. **Test modules**: Open `test.html` for development testing

## The JARVIS Dream

Eventually, horus will:
- **Manage My Digital World**: Control my devices, manage my files, handle my communications
- **Help Me Create**: Assist with coding, writing, design, and creative projects
- **Learn My Patterns**: Understand my preferences, anticipate my needs
- **Grow With Me**: Become more capable and personalized over time
- **Feel Human**: Emotional intelligence, personality, and genuine companionship

This is just the beginning of building my personal AI companion.

## Files

### Core Application
- `index.html` - The main interface
- `script.js` - UI orchestrator and event handling
- `ai.js` - AI response generation (Perplexity)
- `audio.js` - Audio processing and playback (ElevenLabs)
- `orb.js` - Audio-reactive visualization
- `style.css` - Styling and animations
- `config.js` - API keys
- `test.html` - Module testing console

### Assets
- `assets/demos/` - Demo GIFs and videos
- `assets/audio/` - Downloaded AI response audio files

## License

MIT - do whatever you want with it.

---

**Building my own JARVIS, one step at a time.**
