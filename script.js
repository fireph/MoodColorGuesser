class MoodColorGuesser {
    constructor() {
        this.webcam = document.getElementById('webcam');
        this.canvas = document.getElementById('canvas');
        this.colorBox = document.getElementById('colorBox');
        this.detectedColorBox = document.getElementById('detectedColorBox');
        this.timer = document.getElementById('timer');
        this.scoreSection = document.getElementById('scoreSection');
        this.targetColorBox = document.getElementById('targetColorBox');
        this.yourColorBox = document.getElementById('yourColorBox');
        this.scoreDisplay = document.getElementById('score');
        this.playAgainBtn = document.getElementById('playAgain');
        this.startGameBtn = document.getElementById('startGame');
        this.submitGuessBtn = document.getElementById('submitGuess');
        this.gameStatus = document.getElementById('gameStatus');
        this.phaseTitle = document.getElementById('phaseTitle');
        this.phaseInstructions = document.getElementById('phaseInstructions');
        this.webcamSection = document.getElementById('webcamSection');
        
        this.model = null;
        this.startColor = null;
        this.endColor = null;
        this.targetColor = null;
        this.detectedColor = null;
        this.gamePhase = 'waiting'; // waiting, showing, matching, results
        this.currentScore = 0;
        this.totalScore = 0;
        this.gamesPlayed = 0;
        this.detectionRunning = false;
        this.countdownInterval = null;
        
        this.initializeGame();
    }
    
    async initializeGame() {
        this.setupEventListeners();
        await this.loadModel();
    }
    
    setupEventListeners() {
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.playAgainBtn.addEventListener('click', () => this.startGame());
        this.submitGuessBtn.addEventListener('click', () => this.submitGuess());
    }
    
    async loadModel() {
        try {
            this.model = await faceLandmarksDetection.load(
                faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
            );
            console.log('Face detection model loaded successfully');
            this.phaseTitle.textContent = 'Ready to Play!';
            this.phaseInstructions.textContent = 'Face detection loaded. Click Start Game to begin.';
        } catch (error) {
            console.error('Error loading face detection model:', error);
            this.phaseTitle.textContent = 'Error';
            this.phaseInstructions.textContent = 'Could not load face detection. Please refresh the page.';
        }
    }
    
    async startGame() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.detectionRunning = false;
        this.gameStatus.classList.add('hidden');
        this.scoreSection.classList.remove('show');
        
        await this.setupWebcam();
        this.generateColorRange();
        this.generateTargetColor();
        this.showColorPhase();
    }
    
    async setupWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            this.webcam.srcObject = stream;
            
            return new Promise((resolve) => {
                this.webcam.onloadedmetadata = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error accessing webcam:', error);
            alert('Please allow camera access to play the game');
        }
    }
    
    generateColorRange() {
        this.startColor = {
            hue: Math.floor(Math.random() * 360),
            saturation: 50 + Math.floor(Math.random() * 40),
            lightness: 30 + Math.floor(Math.random() * 40)
        };
        
        this.endColor = {
            hue: Math.floor(Math.random() * 360),
            saturation: 50 + Math.floor(Math.random() * 40),
            lightness: 30 + Math.floor(Math.random() * 40)
        };
        
        this.startColor.hsl = `hsl(${this.startColor.hue}, ${this.startColor.saturation}%, ${this.startColor.lightness}%)`;
        this.endColor.hsl = `hsl(${this.endColor.hue}, ${this.endColor.saturation}%, ${this.endColor.lightness}%)`;
        
        console.log('Generated color range:', this.startColor, 'to', this.endColor);
    }
    
    generateTargetColor() {
        const targetPosition = Math.random();
        
        this.targetColor = this.interpolateColors(this.startColor, this.endColor, targetPosition);
        this.targetColor.position = targetPosition;
        
        console.log('Generated target color at position', targetPosition, ':', this.targetColor);
    }
    
    interpolateColors(color1, color2, t) {
        const hue1 = color1.hue;
        const hue2 = color2.hue;
        
        let hueDiff = hue2 - hue1;
        if (Math.abs(hueDiff) > 180) {
            if (hueDiff > 0) {
                hueDiff -= 360;
            } else {
                hueDiff += 360;
            }
        }
        
        const interpolatedHue = (hue1 + hueDiff * t + 360) % 360;
        const interpolatedSaturation = color1.saturation + (color2.saturation - color1.saturation) * t;
        const interpolatedLightness = color1.lightness + (color2.lightness - color1.lightness) * t;
        
        return {
            hue: Math.round(interpolatedHue),
            saturation: Math.round(interpolatedSaturation),
            lightness: Math.round(interpolatedLightness),
            hsl: `hsl(${Math.round(interpolatedHue)}, ${Math.round(interpolatedSaturation)}%, ${Math.round(interpolatedLightness)}%)`
        };
    }
    
    showColorPhase() {
        this.gamePhase = 'showing';
        this.phaseTitle.textContent = 'Memorize This Color!';
        this.phaseInstructions.textContent = 'Remember this color - you need to match it with your expression';
        this.webcamSection.style.display = 'none';
        this.submitGuessBtn.classList.add('hidden');
        
        this.colorBox.style.backgroundColor = this.targetColor.hsl;
        this.detectedColorBox.style.backgroundColor = '#f0f0f0';
        
        let countdown = 5;
        this.timer.textContent = countdown;
        
        this.countdownInterval = setInterval(() => {
            countdown--;
            this.timer.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                this.matchingPhase();
            }
        }, 1000);
    }
    
    matchingPhase() {
        this.gamePhase = 'matching';
        this.phaseTitle.textContent = 'Match the Color!';
        this.phaseInstructions.textContent = 'Express the mood that matches the color you just saw';
        this.webcamSection.style.display = 'flex';
        this.webcamSection.style.flexDirection = 'column';
        this.webcamSection.style.alignItems = 'center';
        
        this.submitGuessBtn.classList.remove('hidden');
        
        this.colorBox.style.backgroundColor = '#f0f0f0';
        this.detectedColorBox.style.backgroundColor = '#f0f0f0';
        
        let countdown = 20;
        this.timer.textContent = countdown;
        
        this.countdownInterval = setInterval(() => {
            countdown--;
            this.timer.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                this.detectionRunning = false;
                this.showResults();
            }
        }, 1000);
        
        this.startFaceDetection();
    }
    
    async startFaceDetection() {
        this.detectionRunning = true;
        
        const detectFaces = async () => {
            if (this.gamePhase !== 'matching' || !this.detectionRunning) return;
            
            try {
                const predictions = await this.model.estimateFaces({
                    input: this.webcam,
                    returnTensors: false,
                    flipHorizontal: false
                });
                
                if (predictions.length > 0) {
                    const face = predictions[0];
                    const mood = this.analyzeFacialExpression(face);
                    this.updateDetectedColor(mood);
                    console.log('Detected mood:', mood.toFixed(2));
                } else {
                    console.log('No face detected');
                    this.detectedColorBox.style.backgroundColor = '#cccccc';
                }
            } catch (error) {
                console.error('Face detection error:', error);
                this.detectedColorBox.style.backgroundColor = '#ffcccc';
            }
            
            if (this.gamePhase === 'matching' && this.detectionRunning) {
                setTimeout(detectFaces, 50);
            }
        };
        
        setTimeout(detectFaces, 100);
    }
    
    submitGuess() {
        if (this.gamePhase !== 'matching') return;
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.detectionRunning = false;
        this.showResults();
    }
    
    analyzeFacialExpression(face) {
        if (!face.scaledMesh || face.scaledMesh.length === 0) {
            return 0.5;
        }
        
        const landmarks = face.scaledMesh;
        
        const leftMouthCorner = landmarks[61];
        const rightMouthCorner = landmarks[291];
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        const noseTip = landmarks[1];
        
        const mouthCenterX = (leftMouthCorner[0] + rightMouthCorner[0]) / 2;
        const mouthCenterY = (leftMouthCorner[1] + rightMouthCorner[1]) / 2;
        const lipCenterY = (upperLip[1] + lowerLip[1]) / 2;
        
        const mouthWidth = Math.abs(rightMouthCorner[0] - leftMouthCorner[0]);
        const mouthHeight = Math.abs(upperLip[1] - lowerLip[1]);
        const mouthCurvature = mouthCenterY - lipCenterY;
        
        let happiness = 0.5;
        
        if (mouthCurvature < -2) {
            happiness += 0.4;
        } else if (mouthCurvature > 2) {
            happiness -= 0.3;
        }
        
        const mouthAspectRatio = mouthHeight / mouthWidth;
        if (mouthAspectRatio > 0.5) {
            happiness += 0.2;
        }
        
        const leftEyeInner = landmarks[133];
        const leftEyeOuter = landmarks[33];
        const rightEyeInner = landmarks[362];
        const rightEyeOuter = landmarks[263];
        
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];
        
        const leftEyeHeight = Math.abs(leftEyeTop[1] - leftEyeBottom[1]);
        const rightEyeHeight = Math.abs(rightEyeTop[1] - rightEyeBottom[1]);
        const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;
        
        const leftEyeWidth = Math.abs(leftEyeOuter[0] - leftEyeInner[0]);
        const rightEyeWidth = Math.abs(rightEyeOuter[0] - rightEyeInner[0]);
        const avgEyeWidth = (leftEyeWidth + rightEyeWidth) / 2;
        
        const eyeAspectRatio = avgEyeHeight / avgEyeWidth;
        
        if (eyeAspectRatio < 0.2) {
            happiness += 0.1;
        }
        
        if (leftMouthCorner[1] < upperLip[1] && rightMouthCorner[1] < upperLip[1]) {
            happiness += 0.2;
        }
        
        if (leftMouthCorner[1] > lowerLip[1] && rightMouthCorner[1] > lowerLip[1]) {
            happiness -= 0.3;
        }
        
        return Math.max(0, Math.min(1, happiness));
    }
    
    updateDetectedColor(mood) {
        this.detectedColor = this.interpolateColors(this.startColor, this.endColor, mood);
        this.detectedColor.mood = mood;
        
        this.detectedColorBox.style.backgroundColor = this.detectedColor.hsl;
    }
    
    showResults() {
        this.gamePhase = 'results';
        this.phaseTitle.textContent = 'Results!';
        this.phaseInstructions.textContent = 'How well did you match the target color?';
        this.timer.textContent = '';
        
        this.submitGuessBtn.classList.add('hidden');
        
        if (!this.detectedColor) {
            this.detectedColor = {
                hue: 0,
                saturation: 50,
                lightness: 50,
                hsl: 'hsl(0, 50%, 50%)'
            };
        }
        
        const score = this.calculateScore();
        this.currentScore = score;
        this.totalScore += score;
        this.gamesPlayed++;
        
        this.targetColorBox.style.backgroundColor = this.targetColor.hsl;
        this.yourColorBox.style.backgroundColor = this.detectedColor.hsl;
        this.scoreDisplay.textContent = `Score: ${score}/100`;
        
        this.scoreSection.classList.add('show');
        this.gameStatus.classList.remove('hidden');
        
        const avgScore = Math.round(this.totalScore / this.gamesPlayed);
        this.gameStatus.innerHTML = `
            <p>Round Score: ${score}/100</p>
            <p>Average Score: ${avgScore}/100 (${this.gamesPlayed} games)</p>
            <button id="startGame">Play Again</button>
        `;
    }
    
    calculateScore() {
        if (!this.detectedColor || !this.targetColor) {
            return 0;
        }
        
        const positionDiff = Math.abs(this.targetColor.position - this.detectedColor.mood);
        
        let score;
        if (positionDiff <= 0.05) {
            score = 100;
        } else if (positionDiff <= 0.15) {
            score = 95 - (positionDiff - 0.05) * 50;
        } else if (positionDiff <= 0.25) {
            score = 90 - (positionDiff - 0.15) * 60;
        } else if (positionDiff <= 0.35) {
            score = 80 - (positionDiff - 0.25) * 50;
        } else if (positionDiff <= 0.45) {
            score = 70 - (positionDiff - 0.35) * 60;
        } else if (positionDiff <= 0.6) {
            score = 60 - (positionDiff - 0.45) * 80;
        } else {
            score = Math.max(0, 40 - (positionDiff - 0.6) * 100);
        }
        
        console.log(`Score calculation: target position ${this.targetColor.position.toFixed(3)}, detected mood ${this.detectedColor.mood.toFixed(3)}, difference ${positionDiff.toFixed(3)}, score ${Math.round(score)}`);
        
        return Math.round(score);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MoodColorGuesser();
});