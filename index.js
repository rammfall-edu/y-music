const audio = document.querySelector('audio');
const playButton = document.querySelector('.player__btn');
const muteButton = document.querySelector('.sound__btn');
const audioDuration = document.querySelector('.timeline__all');
const currentTime = document.querySelector('.timeline__current');
const rangePicker = document.querySelector('.range-timeline');
const player = document.querySelector('.player');
const soundInput = document.querySelector('.sound__input');

/**
 * @type {'paused'|'played'}
 */
let playState = 'paused';
/**
 * @type {'sound'|'muted'}
 */
let soundState = 'sound';
audio.volume = soundInput.value / 100;
let volumeBefore = audio.volume;
let ref = null;

function whilePlaying() {
  currentTime.innerHTML = calcTime(audio.currentTime);
  const percent = (audio.currentTime / audio.duration) * 100;
  rangePicker.value = percent;
  player.style.setProperty('--seek-before-width', `${percent}%`);

  ref = requestAnimationFrame(whilePlaying);
}

audio.addEventListener('loadedmetadata', () => {
  audioDuration.innerText = calcTime(audio.duration);
});

playButton.addEventListener('click', async () => {
  const pausedClassName = 'player__btn--paused';
  if (playState === 'paused') {
    await audio.play();
    requestAnimationFrame(whilePlaying);
    playButton.classList.add(pausedClassName);
    playState = 'played';
    return;
  }

  await audio.pause();
  cancelAnimationFrame(ref);
  playButton.classList.remove(pausedClassName);
  playState = 'paused';
});

muteButton.addEventListener('click', () => {
  const mutedClassName = 'sound__btn--mute';
  if (soundState === 'sound') {
    soundInput.value = 0;
    audio.volume = 0;
    muteButton.classList.add(mutedClassName);
    soundState = 'muted';
    return;
  }

  soundInput.value = volumeBefore * 100;
  audio.volume = volumeBefore;
  muteButton.classList.remove(mutedClassName);
  soundState = 'sound';
});

soundInput.addEventListener('input', () => {
  const { value } = soundInput;
  audio.volume = value / 100;
  volumeBefore = value / 100;
});

audio.load();

function calcTime(duration) {
  const durationDate = new Date(duration * 1000);

  return `${durationDate.getMinutes().toString().padStart(2, '0')}:${durationDate.getSeconds().toString().padStart(2, '0')}`;
}
