import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { ENVIRONMENTS } from "./data/environments.data.js";
import { getSvgIcon } from "./services/icons.service.js";
import { getSoundBase, getUser, setStorage, setUser } from "./services/storage.service..js";
import { showToast } from "./services/toast.service.js";
import { convertMillisecondsToTime, convertTimeToMilliseconds, getCompactTimeString, getFullTimeString, getFullTimeStringFromMilliseconds, getRandomIntegerBetween, logAppInfos, roundToDecimals, setHTMLTitle } from "./utils/UTILS.js";

/* ########################################################### */
/* VARIABLES */
/* ########################################################### */
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');

/* ########################################################### */
/* FUNCTIONS */
/* ########################################################### */

// USER INTERACTIONS //////////////////////////////////////
const onMuteButtonClick = (soundName) => {
  //console.log(soundName);
  let button = document.getElementById(`${soundName}MuteButton`);
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.muted = !slider.muted;
      if (slider.muted) {
        button.classList.add('active');
        button.innerHTML = 'muted';
      } else {
        button.classList.remove('active');
        button.innerHTML = 'mute';
      }
    }
  }
  setUser(user);
}
window.onMuteButtonClick = onMuteButtonClick;

const onEditButtonClick = (soundName) => {
  //console.log(soundName);
  //let button = document.getElementById(`${soundName}EditButton`);
  document.getElementById('editPage').innerHTML = `${getSoundDetailsScreen(getSoundByName(soundName))}`;
  document.getElementById('editPage').classList.remove('disabled');
}
window.onEditButtonClick = onEditButtonClick;

const onAbsoluteVolumeSliderInput = (soundName) => {
  const sliderIhm = document.getElementById('absoluteVolumeSlider');
  const value = sliderIhm.value;
  //console.log(value);
  document.getElementById('absoluteVolumeValue').innerHTML = `${value}%`;
  
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.absolute_volume = value;
      updateEffectiveRange(slider.relative_min_volume, slider.relative_max_volume, value);
    }
  }
  setUser(user);
}
window.onAbsoluteVolumeSliderInput = onAbsoluteVolumeSliderInput;

const onRelativeMaxVolumeSliderInput = (soundName) => {
  let userSlider = getUserSliderBySoundName(soundName);
  const sliderIhm = document.getElementById('relativeMaxVolumeSlider');
  const value = sliderIhm.value;
  if (Number(value) >= Number(userSlider.relative_min_volume)) {
    //console.log(value);
    document.getElementById('relativeMaxVolumeValue').innerHTML = `${value}%`;
    
    let user = getUser();
    for (let slider of user.sliders) {
      if (slider.name === soundName) {
        slider.relative_max_volume = value;
        updateEffectiveRange(slider.relative_min_volume, value, slider.absolute_volume);
      }
    }
    setUser(user);
  } else {
    sliderIhm.value = userSlider.relative_min_volume;
  }
}
window.onRelativeMaxVolumeSliderInput = onRelativeMaxVolumeSliderInput;

const onRelativeMinVolumeSliderInput = (soundName) => {
  let userSlider = getUserSliderBySoundName(soundName);
  const sliderIhm = document.getElementById('relativeMinVolumeSlider');
  const value = sliderIhm.value;

  if (Number(value) <= Number(userSlider.relative_max_volume)) {
    //console.log(value);
    document.getElementById('relativeMinVolumeValue').innerHTML = `${value}%`;
    
    let user = getUser();
    for (let slider of user.sliders) {
      if (slider.name === soundName) {
        slider.relative_min_volume = value;
        updateEffectiveRange(value, slider.relative_max_volume, slider.absolute_volume);
      }
    }
    setUser(user);

  } else {
    sliderIhm.value = userSlider.relative_max_volume;
  }
}
window.onRelativeMinVolumeSliderInput = onRelativeMinVolumeSliderInput;

const onRepetitionFrequencySliderInput = (soundName) => {
  const sliderIhm = document.getElementById('repetitionFrequencySlider');
  const value = sliderIhm.value;
  //console.log(value);

  document.getElementById('repetitionFrequencyValue').innerHTML = `${value}%`;
  
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.repetition_frequency = value;
    }
  }
  setUser(user);
}
window.onRepetitionFrequencySliderInput = onRepetitionFrequencySliderInput;

const onSkipFrequencySliderInput = (soundName) => {
  const sliderIhm = document.getElementById('skipFrequencySlider');
  const value = sliderIhm.value;
  //console.log(value);

  document.getElementById('skipFrequencyValue').innerHTML = `${value}%`;
  
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.skip_frequency = value;
    }
  }
  setUser(user);
}
window.onSkipFrequencySliderInput = onSkipFrequencySliderInput;

const onCloseDetailsClick = () => {
  document.getElementById('editPage').innerHTML = ``;
  document.getElementById('editPage').classList.add('disabled');
}
window.onCloseDetailsClick = onCloseDetailsClick;

// DATA ///////////////////////////////////////////////////
const getSoundByName = (soundName) => {
  const soundBase =  getSoundBase();

  for (let sound of soundBase) {
    if (sound.name === soundName) {
      return sound;
    }
  }
  return null;
}

const getUserSliderBySoundName = (soundName) => {
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      return slider;
    }
  }
  return null;
}

// IHM ////////////////////////////////////////////////////

// ENVIRONMENT SCREEN =====================================
const getSoundBloc = (sound) => {
  const userSlider = getUserSliderBySoundName(sound.name);

  return `
    <div class="sound-bloc">
      <span class="connection"></span>
      <!--<span class="dot"></span>-->
      <span class="sound-name">${sound.name}</span>
      <img class="sound-type-icon" src="./medias/images/${sound.type == 'Background' ? 'background' : sound.type == 'Event' ? 'event' : 'events-pack' }.png"/>
      <div class="buttons-group">
        <button id="${sound.name}MuteButton" class="mute-button ${userSlider.muted ? 'active' : ''}" onclick="onMuteButtonClick('${sound.name}')">${userSlider.muted ? 'muted' : 'mute'}</button>
        <button id="${sound.name}EditButton" onclick="onEditButtonClick('${sound.name}')">edit</button>
      </div>
    </div>
  `;
}

const getCategoryBloc = (category) => {
  let soundBlocsStr = '';
  for (let sound of category.sounds) {
    soundBlocsStr += getSoundBloc(sound);
  }

  return `
    <div class="category-container">
      <div class="category-header">
        <span>${category.name}</span>
        <input type="checkbox" class="category-checkbox" name="" id="" checked>
      </div>

      ${soundBlocsStr}
    </div>
  `;
}

const getEnvironmentIhm = (environment) => {
  let categoryBlocsStr = '';
  for (let category of environment.categories) {
    categoryBlocsStr += getCategoryBloc(category);
  }

  return `
    <span class="environment-header">Neo Tōkyō Penthouse</span>
    ${categoryBlocsStr}
  `;
}
// SOUND DETAILS SCREEN ===================================
const getSoundDetailsScreen = (sound) => {
  document.querySelector(':root').style.setProperty('--min-value', `0%`);
  document.querySelector(':root').style.setProperty('--max-value', `0%`);

  const slider = getUserSliderBySoundName(sound.name);
  // files
  let audioFilesStr = '';
  if (sound.type == 'Background') {
    audioFilesStr += `<div class="space-between-line"><span>${sound.audio_file.src}</span><span>${getFullTimeStringFromMilliseconds(sound.audio_file.duration) }</span></div>`;
  } else if (sound.type == 'Event') {
    audioFilesStr += `<div class="space-between-line"><span>${sound.audio_file.src}</span><span>${getFullTimeStringFromMilliseconds(sound.audio_file.duration) }</span></div>`;
  } else if (sound.type == 'Events pack') {
    for (let index = 0; index < sound.audio_files_pack.length; index++) {
      const element = sound.audio_files_pack[index];
      audioFilesStr += `<div class="space-between-line"><span>${index}. ${element.src}</span><span>${getFullTimeStringFromMilliseconds(element.duration) }</span></div>`;
    }
  }

  let str = `
    <div class="edit-header">
      <span>${sound.name}</span>
      <button class="" onclick="onCloseDetailsClick()">X</button>
    </div>

    <div class="edit-content">
      <span class="section-title">Type: ${sound.type}</span>
      ${audioFilesStr}

      <hr>

      <span class="section-title">Volume</span>
      ${sound.type == 'Background' ? '' : `
        <div class="space-between-line"><span>🛈 Effective volume range</span><span id="effectiveRangeValue">75%-85%</span></div>
      `}

      <button class="outlined">Play at max range</button>

      <div class="slider-container">
        <div class="space-between-line"><span>${sound.type == 'Background' ? 'Volume' : 'Absolute volume'}</span><span id="absoluteVolumeValue">${slider.absolute_volume}%</span></div>
        <input type="range" id="absoluteVolumeSlider" min="0" max="100" step="1" value="${slider.absolute_volume}" class="slider" oninput="onAbsoluteVolumeSliderInput('${sound.name}')"/>
      </div>

      ${sound.type == 'Background' ? '' : `
        <div class="slider-container">
          <div class="space-between-line"><span>Relative maximum volume</span><span id="relativeMaxVolumeValue">${slider.relative_max_volume}%</span></div>
          <input type="range" id="relativeMaxVolumeSlider" min="0" max="100" step="1" value="${slider.relative_max_volume}" class="slider" oninput="onRelativeMaxVolumeSliderInput('${sound.name}')"/>
        </div>
        <div class="slider-container">
          <div class="space-between-line"><span>Relative minimum volume</span><span id="relativeMinVolumeValue">${slider.relative_min_volume}%</span></div>
          <input type="range" id="relativeMinVolumeSlider" min="0" max="100" step="1" value="${slider.relative_min_volume}" class="slider" oninput="onRelativeMinVolumeSliderInput('${sound.name}')"/>
        </div>
  
        <hr>
  
        <span class="section-title">Frequency</span>
        <div class="slider-container">
          <span></span>
          <div class="space-between-line"><span>Repetition frequency</span><span id="repetitionFrequencyValue">${slider.repetition_frequency}%</span></div>
          <input type="range" id="repetitionFrequencySlider" min="0" max="100" step="1" value="${slider.repetition_frequency}" class="slider" oninput="onRepetitionFrequencySliderInput('${sound.name}')"/>
        </div>
        <div class="slider-container">
          <div class="space-between-line"><span>Random skip frequency</span><span id="skipFrequencyValue">${slider.skip_frequency}%</span></div>
          <input type="range" id="skipFrequencySlider" min="0" max="100" step="1" value="${slider.skip_frequency}" class="slider" oninput="onSkipFrequencySliderInput('${sound.name}')"/>
        </div>`}
    </div>

    <!--<div class="dual-button-bloc">
      <button class="outlined">Discard changes</button>
      <button class="solid">Save changes</button>
    </div>-->
  `;
  setTimeout(() => {
    updateEffectiveRange(slider.relative_min_volume, slider.relative_max_volume, slider.absolute_volume);
  }, 10);
  
  return str;
}

const updateEffectiveRange = (relativeMinValue, relativeMaxValue, absoluteValue) => {
  if (relativeMinValue != null && relativeMaxValue != null) {
    let minAbsoluteValue = roundToDecimals((relativeMinValue / 100) * absoluteValue, 2);
    let maxAbsoluteValue = roundToDecimals((relativeMaxValue / 100) * absoluteValue, 2);
    // Overlay
    document.querySelector(':root').style.setProperty('--min-value', `${minAbsoluteValue}%`);
    document.querySelector(':root').style.setProperty('--max-value', `${maxAbsoluteValue}%`);
    // Value
    document.getElementById('effectiveRangeValue').innerHTML = `${minAbsoluteValue}%-${maxAbsoluteValue}%`;

    
    /* const sliderMinVol = document.getElementById('relativeMinVolumeSlider');
    sliderMinVol.max = relativeMaxValue;
    const sliderMaxVol = document.getElementById('relativeMaxVolumeSlider');
    sliderMaxVol.min = relativeMinValue; */
  }
}

const onEnvButtonClick = (envName) => {
  for (let environment of ENVIRONMENTS) {
    if (environment.name == envName) {
      setEnvPage(environment);
      break;
    }
  }
}
window.onEnvButtonClick = onEnvButtonClick;

const setHomepage = () => {
  let str = '';
  for (let environment of ENVIRONMENTS) {
    str += `<button class="outlined env-button" onclick="onEnvButtonClick('${environment.name}')">${environment.name}</button>`;
  }
  MAIN.innerHTML = str;
}

const setEnvPage = (environment) => {
  MAIN.innerHTML = getEnvironmentIhm(environment);
}

/* ########################################################### */
/* INITIALIZATION */
/* ########################################################### */
logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);

setStorage();


/* ########################################################### */
/* EXECUTION */
/* ########################################################### */
setHomepage();
