const timeDisplay = document.getElementById('time-display');
const textTimeDisplay = document.getElementById('text-time-display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const clearBtn = document.getElementById('clearBtn');
const lapFooter = document.getElementById('lapFtr');

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];

// Returns raw time parts from ms
const getTimeParts = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return { hours, minutes, seconds, centiseconds };
}

const formatTimeClock = ({ hours, minutes, seconds, centiseconds }) => {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  const cs = String(centiseconds).padStart(2, '0');
  return `${h}:${m}:${s}.${cs}`;
}

const formatTimeText = ({ hours, minutes, seconds, _centiseconds }) => {
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  }
  if (seconds > 0 || parts.length === 0) { 
    parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  }

  return parts.join(', ');
}

const updateDisplay = () => {
  const currentTime = Date.now() - startTime + elapsedTime;
  const timeParts = getTimeParts(currentTime);

  timeDisplay.textContent = formatTimeClock(timeParts);
  textTimeDisplay.textContent = formatTimeText(timeParts);
}

const start = () => {
  if (!timerInterval) {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
  }
}

const pause = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime += Date.now() - startTime;
  }
}

const reset = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  startTime = 0;
  timeDisplay.textContent = "00:00:00.00";
  textTimeDisplay.textContent = "";
  laps = [];
  updateLaps();
}

const lap = () => {
  if (!timerInterval) return;
  const currentTime = Date.now() - startTime + elapsedTime;
  const timeParts = getTimeParts(currentTime);
  laps.unshift(formatTimeClock(timeParts));
  updateLaps();
}

const clearLaps = () => {
  laps = [];
  updateLaps();
}

const updateLaps = () => {
  const lapList = document.getElementById('lap-list');
  lapList.innerHTML = '';

  if (laps.length === 0) {
    lapFooter.textContent = 'Lap history will show here';
  } else {
    lapFooter.textContent = '';
    laps.forEach((lapTime, i) => {
      const li = document.createElement('li');
      li.textContent = `Lap ${laps.length - i}: ${lapTime}`;
      lapList.appendChild(li);
    });
  }
}

startBtn.onclick = start;
pauseBtn.onclick = pause;
resetBtn.onclick = reset;
lapBtn.onclick = lap;
clearBtn.onclick = clearLaps;
