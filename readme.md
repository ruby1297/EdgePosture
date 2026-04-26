# EdgePosture: AI-Powered Smart Nursing Assistant

> **Final Project for "Introduction to Smart Nursing" (Spring 2026)**
> **Developer:** Ruby Hsieh (YZU CSIE)

[![Platform](https://img.shields.io/badge/Platform-Web-brightgreen.svg)](https://ruby1297.github.io/EdgePosture/)
[![Framework](https://img.shields.io/badge/Framework-TensorFlow.js-orange.svg)](https://www.tensorflow.org/js)

---

## Project Overview

In the field of **Smart Nursing**, preventing Musculoskeletal Disorders (MSDs) among healthcare professionals and office workers is a critical challenge. **EdgePosture** is a computer-vision-based web application designed to combat the negative effects of prolonged sitting.

The system acts as a "Digital Wellness Coach," using **Edge Computing** to detect physical postures and guide users through science-backed stretching routines, followed by a gamified mental break.

## Key Features

- **Smart Dashboard**: A sleek, real-time clock and countdown display that serves as a desktop utility.
- **Intelligent Reminder**: Automatically triggers a full-screen alert after a set duration (default: 1 hour; set to 10 seconds for demo purposes).
- **AI Yoga Coach**:
  - Utilizes **TensorFlow.js** and **Teachable Machine** for real-time skeletal pose detection.
  - Randomly assigns challenges: **Tree Pose**, **Downward Dog**, or **Warrior Pose**.
  - **Advanced Training Logic**: Users must hold the pose for **15 seconds** for **3 sets**, with a **10-second rest period** between sets.
- **Privacy-First Design**: All image processing is done locally in the browser. No video data is ever uploaded to a server, ensuring user privacy in sensitive environments (like nursing stations).
- **Gamified Reward**: Upon completing the physical challenge, the system unlocks a **Nonogram** logic puzzle to provide a mental reset.

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript.
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js).
- **Model Training**: Google Teachable Machine (Pose Project).
- **Deployment**: GitHub Pages.

## Project Structure

```text
/EdgePosture
├── index.html          # Main interface (Dashboard, Modal, & Containers)
├── style.css           # UI/UX and layout styling
├── reminder.js         # Countdown logic and modal triggers
├── yoga.js             # AI model loading, Webcam control, and 15s/3-set state machine
├── /model              # Offline TensorFlow.js model files (model.json, weights.bin, etc.)
├── /images             # Reference images for yoga poses (tree.jpg, warrior.jpg, etc.)
└── /nonograms          # Integrated logic puzzle game folder
```
