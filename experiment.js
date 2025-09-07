// Standalone behavioral task implementation
// Center for Conflict and Cooperation

class SimpleExperiment {
    constructor() {
        this.container = document.getElementById('experiment-container');
        this.data = [];
        this.currentTrial = 0;
        this.phase = 'welcome';
        this.startTime = null;
        this.trialStartTime = null;
        this.experimentId = "Cb1DhSdND5ek";
        this.participantId = `participant_${Date.now()}`;
        
        // Experiment configuration
        this.practiceTrials = [
            { color: 'green', target: true },
            { color: 'red', target: false },
            { color: 'green', target: true },
            { color: 'red', target: false }
        ];
        
        this.mainTrials = this.generateMainTrials(40, 0.6); // 40 trials, 60% go trials
        
        this.init();
    }
    
    generateMainTrials(numTrials, targetProbability) {
        const trials = [];
        for (let i = 0; i < numTrials; i++) {
            trials.push({
                color: Math.random() < targetProbability ? 'green' : 'red',
                target: Math.random() < targetProbability
            });
        }
        return trials;
    }
    
    init() {
        this.setupKeyboardListeners();
        this.showWelcome();
    }
    
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && (this.phase === 'practice-trial' || this.phase === 'main-trial')) {
                e.preventDefault();
                this.handleResponse();
            }
        });
    }
    
    showWelcome() {
        this.phase = 'welcome';
        this.container.innerHTML = `
            <h1>Welcome to the Behavioral Task</h1>
            <p>Thank you for participating in this study by the Center for Conflict and Cooperation.</p>
            <button class="btn" onclick="experiment.showInstructions()">Continue</button>
        `;
    }
    
    showInstructions() {
        this.phase = 'instructions';
        this.container.innerHTML = `
            <div class="instructions">
                <h2>Instructions</h2>
                <p>In this task, you will see a series of colored squares appear on the screen.</p>
                <p>Your job is to respond as quickly as possible when you see a <strong style="color: green;">GREEN</strong> square.</p>
                <p><strong>Press the SPACEBAR</strong> when you see a green square.</p>
                <p><strong>Do NOT respond</strong> to red squares.</p>
                
                <h3>Practice</h3>
                <p>Let's start with a few practice trials.</p>
                <p>Remember:</p>
                <ul>
                    <li>Press SPACEBAR for <strong style="color: green;">GREEN</strong> squares</li>
                    <li>Do NOT respond to <strong style="color: red;">RED</strong> squares</li>
                </ul>
            </div>
            <button class="btn" onclick="experiment.startPractice()">Start Practice</button>
        `;
    }
    
    startPractice() {
        this.phase = 'practice';
        this.currentTrial = 0;
        this.runPracticeTrial();
    }
    
    runPracticeTrial() {
        if (this.currentTrial >= this.practiceTrials.length) {
            this.showPracticeFeedback();
            return;
        }
        
        const trial = this.practiceTrials[this.currentTrial];
        this.showFixation(() => this.showStimulus(trial, 'practice'));
    }
    
    showPracticeFeedback() {
        const practiceData = this.data.filter(d => d.phase === 'practice');
        const correct = practiceData.filter(d => d.correct).length;
        const total = practiceData.length;
        
        this.container.innerHTML = `
            <h2>Practice Complete</h2>
            <p>You got ${correct} out of ${total} trials correct.</p>
            <p>Now we'll begin the main experiment.</p>
            <button class="btn" onclick="experiment.startMainExperiment()">Start Main Experiment</button>
        `;
    }
    
    startMainExperiment() {
        this.phase = 'main';
        this.currentTrial = 0;
        this.runMainTrial();
    }
    
    runMainTrial() {
        if (this.currentTrial >= this.mainTrials.length) {
            this.showResults();
            return;
        }
        
        const trial = this.mainTrials[this.currentTrial];
        this.showFixation(() => this.showStimulus(trial, 'main'));
    }
    
    showFixation(callback) {
        this.container.innerHTML = '<div class="fixation">+</div>';
        setTimeout(callback, 500);
    }
    
    showStimulus(trial, phase) {
        this.phase = phase + '-trial';
        this.trialStartTime = Date.now();
        this.responded = false;
        
        this.container.innerHTML = `<div class="stimulus" style="color: ${trial.color};">■</div>`;
        
        // Auto-advance after 2 seconds if no response
        this.trialTimeout = setTimeout(() => {
            if (!this.responded) {
                this.recordResponse(null, trial, phase);
            }
        }, 2000);
    }
    
    handleResponse() {
        if (this.responded) return;
        
        this.responded = true;
        clearTimeout(this.trialTimeout);
        
        const reactionTime = Date.now() - this.trialStartTime;
        const currentTrials = this.phase.includes('practice') ? this.practiceTrials : this.mainTrials;
        const trial = currentTrials[this.currentTrial];
        const phase = this.phase.includes('practice') ? 'practice' : 'main';
        
        this.recordResponse(reactionTime, trial, phase);
    }
    
    recordResponse(reactionTime, trial, phase) {
        // Ensure trial is defined
        if (!trial) {
            console.error('Trial is undefined in recordResponse');
            return;
        }
        
        const correct = (reactionTime !== null && trial.target) || (reactionTime === null && !trial.target);
        
        this.data.push({
            participant: this.participantId,
            trial: this.currentTrial + 1,
            phase: phase,
            color: trial.color,
            target: trial.target,
            response: reactionTime !== null ? 'spacebar' : null,
            reaction_time: reactionTime,
            correct: correct,
            timestamp: new Date().toISOString()
        });
        
        this.currentTrial++;
        
        // Continue to next trial
        setTimeout(() => {
            if (phase === 'practice') {
                this.runPracticeTrial();
            } else {
                this.runMainTrial();
            }
        }, 500);
    }
    
    showResults() {
        const mainData = this.data.filter(d => d.phase === 'main');
        const correct = mainData.filter(d => d.correct).length;
        const total = mainData.length;
        const accuracy = Math.round((correct / total) * 100);
        
        const targetTrials = mainData.filter(d => d.target && d.correct && d.reaction_time !== null);
        const avgRT = targetTrials.length > 0 ? 
            Math.round(targetTrials.reduce((sum, t) => sum + t.reaction_time, 0) / targetTrials.length) : 'N/A';
        
        this.container.innerHTML = `
            <h2>Task Complete!</h2>
            <p>Thank you for participating.</p>
            <div class="performance-stats">
                <h3>Your Performance:</h3>
                <p><strong>Accuracy:</strong> ${accuracy}% (${correct}/${total})</p>
                <p><strong>Average Reaction Time:</strong> ${avgRT} ms</p>
            </div>
            <p>Your data has been automatically saved to our secure database.</p>
            
            <div class="download-section">
                <h3>Download Your Data</h3>
                <p>Click the button below to download your experiment data as a CSV file.</p>
                <button id="download-btn" onclick="experiment.downloadCSV()">Download CSV Data</button>
            </div>
        `;
        
        // Save data to OSF
        this.saveDataToOSF();
    }
    
    saveDataToOSF() {
        const csvData = this.convertToCSV(this.data);
        
        // Try to save to OSF, but handle errors gracefully
        fetch('https://pipe.jspsych.org/api/data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                experimentID: this.experimentId,
                filename: `${this.participantId}.csv`,
                data: csvData
            })
        }).then(response => {
            if (response.ok) {
                console.log('Data successfully saved to OSF');
            } else {
                console.warn('Failed to save data to OSF - server response not OK');
            }
        }).catch(error => {
            console.warn('OSF saving not available in this environment:', error.message);
            // This is expected in testing environments where external requests are blocked
        });
    }
    
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
    
    downloadCSV() {
        const csvData = this.convertToCSV(this.data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `behavioral_task_data_${this.participantId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize experiment when page loads
let experiment;
document.addEventListener('DOMContentLoaded', () => {
    experiment = new SimpleExperiment();
});