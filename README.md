# 🎨 Mood Color Guesser

An interactive web game that uses AI-powered facial expression detection to match colors with your mood! Express your emotions through facial expressions and see how well you can match target colors.

## 🚀 Features

- **Real-time facial expression detection** using TensorFlow.js and MediaPipe
- **Mood-to-color mapping** based on facial landmarks analysis
- **Interactive gameplay** with multiple phases
- **Responsive design** that works on desktop and mobile
- **Score tracking** to monitor your progress
- **Beautiful gradient UI** with smooth animations

## 🎮 How to Play

1. **Start the Game**: Click "Start Game" to begin
2. **Memorize Phase**: A target color will be displayed for 5 seconds - remember it!
3. **Expression Phase**: Express the mood you think matches that color:
   - **Sad expressions** → Lower/darker colors
   - **Happy expressions** → Higher/brighter colors
4. **Submit**: Click "Submit My Guess" or wait for the timer
5. **Results**: See how close your mood matched the target color!

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI/ML**: TensorFlow.js, MediaPipe Face Landmarks Detection
- **Camera**: WebRTC getUserMedia API
- **Styling**: CSS Grid, Flexbox, CSS Animations

## 🎯 Game Mechanics

The game analyzes your facial expressions using 468 facial landmarks to determine your mood:

- **Mouth curvature** (smile/frown detection)
- **Eye aspect ratio** (squinting/wide eyes)
- **Mouth corner positioning** (upward/downward)
- **Lip separation** (open/closed mouth)

Your detected mood is then mapped to a color position on a dynamically generated color spectrum.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/fmeyer/MoodColorGuesser.git
   ```

2. Open `index.html` in a modern web browser

3. Allow camera access when prompted

4. Start playing!

## 📋 Requirements

- Modern web browser with WebRTC support
- Camera access
- JavaScript enabled
- Stable internet connection (for loading TensorFlow.js models)

## 🎨 Screenshots

The game features a beautiful gradient interface with:
- Smooth color transitions
- Responsive grid layout
- Real-time webcam display
- Interactive timer and scoring

## 🔧 Development

The game is built with vanilla JavaScript and requires no build process. Simply open `index.html` in a browser to start developing.

### File Structure
```
MoodColorGuesser/
├── index.html          # Main HTML structure
├── script.js           # Game logic and AI processing
├── style.css          # Styling and animations
├── README.md          # This file
└── LICENSE           # License information
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow.js** team for the amazing machine learning library
- **MediaPipe** for facial landmark detection
- **WebRTC** for camera access capabilities

---

**Ready to test your emotional color intuition? Give it a try!** 🎨😊