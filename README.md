# Behavioral Task - Center for Conflict and Cooperation

This repository contains a web-based behavioral experiment implemented for the Center for Conflict and Cooperation. The experiment is a simple Go/No-Go reaction time task that can be hosted as a static website.

## Experiment Overview

The task presents participants with colored squares (green and red) and requires them to:
- **Press SPACEBAR** when they see a **GREEN** square (Go trials)
- **Do NOT respond** when they see a **RED** square (No-Go trials)

### Experiment Structure

1. **Welcome Screen** - Introduction to the task
2. **Instructions** - Detailed explanation of the task requirements
3. **Practice Trials** - 4 practice trials with feedback
4. **Main Experiment** - 40 trials (60% Go trials, 40% No-Go trials)
5. **Results Screen** - Performance summary and data download

## Features

- **Standalone Implementation**: No external dependencies, works offline
- **OSF Data Saving**: Automatically saves data to OSF via DataPipe (experimentId: "Cb1DhSdND5ek")
- **CSV Download**: Manual download button for participant data
- **Responsive Design**: Clean, professional interface
- **Performance Metrics**: Accuracy and reaction time statistics

## Technical Details

- Pure HTML/CSS/JavaScript implementation
- No external library dependencies
- Compatible with modern web browsers
- Can be hosted as a static website (e.g., GitHub Pages)

## Hosting

To host this experiment:

1. Upload all files to a web server or static hosting service
2. Access via `index.html`
3. No additional setup required

## Data Collection

- **Automatic**: Data is automatically sent to OSF via DataPipe
- **Manual**: Participants can download their data as a CSV file
- **Format**: CSV with columns for trial number, stimulus color, response, reaction time, accuracy, etc.

## Files

- `index.html` - Main experiment page
- `experiment.js` - Experiment logic and data handling
- `style.css` - Styling and layout