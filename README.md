# horus - Highly Organized Response Utility System

An advanced AI assistant with realistic voice and thinking audio capabilities, built with ElevenLabs v3 and Perplexity AI.

## 🎯 Features

- **Realistic Voice**: ElevenLabs v3 with emotional audio tags
- **Thinking Audio**: Human-like "hmm, um, let me think..." sounds
- **JARVIS-style Personality**: Confident, witty, and efficient responses
- **Dynamic Audio Tags**: Context-aware emotional expressions
- **Professional Architecture**: Clean, modular codebase

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/11labs.git
   cd 11labs
   ```

2. **Set up API keys**
   ```bash
   npm run setup
   # Edit config.js with your actual API keys
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the application**
   ```bash
   npx serve .
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### API Keys Required:
- **ElevenLabs API Key**: For text-to-speech with v3 model
- **Perplexity API Key**: For AI responses

### Environment Variables:
```bash
ELEVENLABS_API_KEY=your_elevenlabs_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here
```

## 🎵 Audio Features

### Voice Settings:
- **Model**: ElevenLabs v3 (alpha)
- **Voice**: Liam (TX3LPaxmHKxFdv7VOQHJ)
- **Audio Tags**: [excited], [chuckles], [whispers], [laughs], etc.

### Thinking Audio:
- **Pre-recorded thinking sounds** for instant feedback
- **Context-aware thinking** based on query type
- **Human-like processing** with "hmm, um, let me think..."

## 🏗️ Architecture

```
11labs/
├── index.html          # Main interface
├── script.js           # Core AI logic
├── style.css           # Styling
├── instruction.json    # AI personality config
├── config.js           # API configuration
└── README.md           # Documentation
```

## 🎭 Personality System

The AI personality is configured in `instruction.json`:
- **System Prompt**: JARVIS-style instructions
- **Audio Tags**: Emotional expressions
- **Response Style**: Professional yet witty

## 🔒 Security

- **API keys** are stored in `.env` (gitignored)
- **No sensitive data** in the repository
- **Environment-based configuration**

## 🚀 Future Features

- [ ] Real-time conversation
- [ ] Multiple voice personalities
- [ ] Custom thinking audio library
- [ ] Voice command integration
- [ ] System control capabilities

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using ElevenLabs v3 and Perplexity AI**
