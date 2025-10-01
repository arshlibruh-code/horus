# horus - Highly Organized Response Utility System

Building my own JARVIS - a personal AI that will eventually manage my entire digital life.

![horus AI Demo](assets/demos/horus-demo.gif)

**[Download Audio Samples](assets/audio/)** - Hear horus AI responses with different emotional tones

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
- **Audio Download**: Download AI responses as MP3 files
- **Visualization**: Audio-reactive orb that shows AI "thinking"
- **Multiple Agents**: Different AI personalities to choose from
- **Modular Architecture**: Clean separation of AI, audio, and UI logic

## What's Planned

- **Memory System**: Remember conversations and preferences
- **File Management**: Read, organize, and manage your files
- **System Control**: Basic computer automation (open apps, manage windows)
- **Email Integration**: Read and manage your emails
- **Calendar Assistant**: Schedule and manage your time

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
