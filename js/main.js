import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { ENVIRONMENTS } from "./data/environments.data.js";
import { getSvgIcon } from "./services/icons.service.js";
import { getEnvironmentSoundBase, getSoundBase, getTheme, getUser, isExpanded, setExpanded, setStorage, setTheme, setUser } from "./services/storage.service..js";
import { showToast } from "./services/toast.service.js";
import { convertMillisecondsToTime, convertTimeToMilliseconds, getCompactTimeString, getFullTimeString, getFullTimeStringFromMilliseconds, getRandomIntegerBetween, logAppInfos, roundToDecimals, setHTMLTitle } from "./utils/UTILS.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');

let PLAYING_AUDIO_ARRAY = [];
let eventsBankArray = [];
let eventsPacksBankArray = [];

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

// USER INTERACTIONS ##########################################################

// HOMEPAGE ===============================================
// Settings ------------------------------------------------
const onSettingsButtonClick = () => {
  document.getElementById('settingsPage').classList.remove('disabled');
  setSettingsPage();
}
window.onSettingsButtonClick = onSettingsButtonClick;

const onCloseSettingsClick = () => {
  document.getElementById('settingsPage').classList.add('disabled');
}
window.onCloseSettingsClick = onCloseSettingsClick;

const onColorBlocClick = (value) => {
  setTheme(value);
  setIhmTheme(value);
  const colorBlocs = document.getElementsByClassName('setting-color-bloc');
  for (let button of colorBlocs) {
    if (button.getAttribute('id') === value) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  }
}
window.onColorBlocClick = onColorBlocClick;

const onEnvButtonClick = (envName) => {
  for (let environment of ENVIRONMENTS) {
    if (environment.name == envName) {
      setEnvPage(environment);
      break;
    }
  }
}
window.onEnvButtonClick = onEnvButtonClick;


// ENVIRONMENT SCREEN =====================================

// Header -------------------------------------------------
const onHomeClick = () => {
  for (let soundFile of PLAYING_AUDIO_ARRAY) {
    //console.log(soundFile);
    soundFile.audio.pause();
  }
  for (let event of eventsBankArray) {
    //console.log(event);
    event.bank.stop();
  }
  for (let eventsPack of eventsPacksBankArray) {
    //console.log(eventsPack);
    eventsPack.bank.stop();
  }
  PLAYING_AUDIO_ARRAY = [];
  eventsBankArray = [];
  eventsPacksBankArray = [];

  setHomepage();
}
window.onHomeClick = onHomeClick;

const onConsoleButtonClick = () => {
  document.getElementById('consolePage').classList.remove('disabled');
}
window.onConsoleButtonClick = onConsoleButtonClick;

// Console ------------------------------------------------
const onCloseConsoleClick = () => {
  document.getElementById('consolePage').classList.add('disabled');
}
window.onCloseConsoleClick = onCloseConsoleClick;

// Sound blocs --------------------------------------------
const onMuteButtonClick = (soundName) => {
  //console.log(soundName);
  let button = document.getElementById(`${soundName}MuteButton`);
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.muted = !slider.muted;

      let soundBase = getSoundBase();
      let sound = soundBase.filter(e => e.name === soundName)[0];

      for (let obj of PLAYING_AUDIO_ARRAY) {
        if (obj.src !== undefined && obj.name === sound.name) {
          obj.audio.muted = slider.muted;
        }
      }

      if (slider.muted) {
        button.classList.add('active');
        button.innerHTML = 'mute';
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

// SOUND DETAILS SCREEN ====================================
const onAbsoluteVolumeSliderInput = (soundName) => {
  const sliderIhm = document.getElementById('absoluteVolumeSlider');
  const sound = getSoundByName(soundName);
  const value = sliderIhm.value;
  //console.log(value);
  document.getElementById('absoluteVolumeValue').innerHTML = `${value}%`;
  
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.absolute_volume = value;
      updateEffectiveRange(slider.relative_min_volume, slider.relative_max_volume, value);
      updateCurrentAbsoluteVolume(sound.name, value);
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
  let longestDuration = 0;
  let sound = getSoundByName(soundName);
  if (sound.type === 'Event') {
    longestDuration = sound.audio_file.duration;
  } else {
    for (let index = 0; index < sound.audio_files_pack.length; index++) {
      const element = sound.audio_files_pack[index];
      if (element.duration > longestDuration) {
        longestDuration = element.duration;
      }
    }
  }

  document.getElementById('repetitionFrequencyValue').innerHTML = `${value}%`;
  document.getElementById('realDelayValue').innerHTML = `${getFullTimeStringFromMilliseconds(getRealDelay(value, longestDuration))}`;
  
  let user = getUser();
  for (let slider of user.sliders) {
    if (slider.name === soundName) {
      slider.repetition_frequency = value;
    }
  }
  setUser(user);

  for (let event of eventsBankArray) {
    if (event.name === soundName) {
      event.bank.updateDelay(value);
    }
  }

  for (let eventPack of eventsPacksBankArray) {
    if (eventPack.name === soundName) {
      eventPack.bank.updateDelay(value);
    }
  }
}
window.onRepetitionFrequencySliderInput = onRepetitionFrequencySliderInput;

const onSkipFrequencySliderInput = (soundName) => {
  const sliderIhm = document.getElementById('skipFrequencySlider');
  const value = sliderIhm.value;
  //console.log(value);

  document.getElementById('skipFrequencyValue').innerHTML = `${value}%`;
  document.getElementById('infoSkipFrequencyValue').innerHTML = `${100 - value}%`;
  
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

// DATA #######################################################################

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

// IHM RENDER #################################################################

// HOMEPAGE ===============================================

const setHomepage = () => {
  setHTMLTitle(APP_NAME)
  renderHomepageHeader();
  let str = '<div class="homepage-container">';
  for (let environment of ENVIRONMENTS) {
    str += `<button class="solid env-button" onclick="onEnvButtonClick('${environment.name}')">${environment.name}</button>`;
  }
  str += '</div>';
  MAIN.innerHTML = str;
}

const renderHomepageHeader = () => {
  HEADER.innerHTML = `<p>SLEEPWAVE 2 (dev) v ${APP_VERSION}</p><button onclick="onSettingsButtonClick()" class="outlined">settings</button>`;
}

// SETTINGS ===============================================

const setSettingsPage = () => {
  const user = getUser();

  const element = document.getElementById('settingsContent');

  element.innerHTML = `
    <div class="setting-bloc">
      <span>theme</span>
      <div class="color-buttons-container">
        <button id="green" class="setting-color-bloc green ${getTheme() == 'green' ? 'selected' : ''}" onclick="onColorBlocClick('green')"></button>
        <button id="aqua" class="setting-color-bloc aqua ${getTheme() == 'aqua' ? 'selected' : ''}" onclick="onColorBlocClick('aqua')"></button>
        <button id="blue" class="setting-color-bloc blue ${getTheme() == 'blue' ? 'selected' : ''}" onclick="onColorBlocClick('blue')"></button>
        <button id="pink" class="setting-color-bloc pink ${getTheme() == 'pink' ? 'selected' : ''}" onclick="onColorBlocClick('pink')"></button>
        <button id="yellow" class="setting-color-bloc yellow ${getTheme() == 'yellow' ? 'selected' : ''}" onclick="onColorBlocClick('yellow')"></button>
        <button id="orange" class="setting-color-bloc orange ${getTheme() == 'orange' ? 'selected' : ''}" onclick="onColorBlocClick('orange')"></button>
        <button id="white" class="setting-color-bloc white ${getTheme() == 'white' ? 'selected' : ''}" onclick="onColorBlocClick('white')"></button>
      </div>
      <div class="color-buttons-container" style="margin-top: 16px;">
        <button id="h3oplus" class="setting-color-bloc h3oplus ${getTheme() == 'h3oplus' ? 'selected' : ''}" onclick="onColorBlocClick('h3oplus')"></button>
        <button id="hulk" class="setting-color-bloc hulk ${getTheme() == 'hulk' ? 'selected' : ''}" onclick="onColorBlocClick('hulk')"></button>
      </div>
    </div>
  <hr>
    <div class="setting-bloc">
      <span>categories</span>
      <div class="setting-bloc-buttons-container">
        <button id="expanded" class="${isExpanded() ? 'solid' : 'outlined'}" onclick="onExpandSettingClick('expanded')">Expanded by default</button>
        <button id="collapsed" class="${isExpanded() ? 'outlined' : 'solid'}" onclick="onExpandSettingClick('collapsed')">Collapsed by default</button>
      </div>
    </div>
        `;
}

const onExpandSettingClick = (value) => {
  setExpanded(value == 'expanded');
  if (value == 'expanded') {
    document.getElementById('expanded').classList.remove('outlined');
    document.getElementById('expanded').classList.add('solid');
    document.getElementById('collapsed').classList.remove('solid');
    document.getElementById('collapsed').classList.add('outlined');
  } else {
    document.getElementById('collapsed').classList.remove('outlined');
    document.getElementById('collapsed').classList.add('solid');
    document.getElementById('expanded').classList.remove('solid');
    document.getElementById('expanded').classList.add('outlined');
  }
}
window.onExpandSettingClick = onExpandSettingClick;

const setIhmTheme = () => {
  const user = getUser();
  let value = '';
  for (let setting of user.parameters) {
    if (setting.id == 'theme') {
      value = setting.value;
    }
  }

  switch (value) {
    case 'green':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-green)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-green-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-green-filter)`);
      break;
    case 'orange':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-orange)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-orange-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-orange-filter)`);
      break;
    case 'blue':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-blue)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-blue-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-blue-filter)`);
      break;
    case 'aqua':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-aqua)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-aqua-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-aqua-filter)`);
      break;
    case 'pink':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-pink)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-pink-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-pink-filter)`);
      break;
    case 'yellow':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-yellow)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-yellow-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-yellow-filter)`);
      break;
    case 'white':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-white)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-white-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-white-filter)`);
      break;
    case 'h3oplus':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-aqua)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-aqua-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-orange-filter)`);
      break;
    case 'hulk':
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-green)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-green-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-pink-filter)`);
      break;
    default:
      document.querySelector(':root').style.setProperty('--primary', `var(--nostromo-green)`);
      document.querySelector(':root').style.setProperty('--primary-alpha', `var(--nostromo-green-alpha)`);
      document.querySelector(':root').style.setProperty('--primary-filter', `var(--nostromo-green-filter)`);
      break;
  }
}

// ENVIRONMENT SCREEN =====================================

const setEnvPage = (environment) => {
  setHTMLTitle(environment.name);
  document.getElementById('consoleContent').innerHTML = '';

  renderEnvironmentHeader(environment);
  MAIN.innerHTML = getEnvironmentCategoryBlocs(environment);
  createEnvironmentPlayingAudioArray(environment.name);
}

const renderEnvironmentHeader = (environment) => {
  HEADER.innerHTML = `
    <button class="home-button" onclick="onHomeClick()"><img class="main-logo" src="./medias/images/logo.png" /></button>
    <p>${environment.name}</p>
    <!-- <button class="logs-button" onclick="onConsoleButtonClick()"></button> -->
    <button class="outlined" onclick="onConsoleButtonClick()">logs</button>`;
}

const getSoundBloc = (sound) => {
  const userSlider = getUserSliderBySoundName(sound.name);

  return `
    <div class="sound-bloc">
      <span class="connection1"></span>
      <span class="connection2"></span>
      <span class="sound-name">${sound.name}</span>
      <img class="sound-type-icon" src="./medias/images/${sound.type == 'Background' ? 'background' : sound.type == 'Event' ? 'event' : 'events-pack' }.png"/>
      <div class="buttons-group">
        <button id="${sound.name}MuteButton" class="mute-button ${userSlider.muted ? 'active' : ''}" onclick="onMuteButtonClick('${sound.name}')">${userSlider.muted ? 'mute' : 'mute'}</button>
        <button id="${sound.name}EditButton" class="solid" onclick="onEditButtonClick('${sound.name}')">edit</button>
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
        <input type="checkbox" class="category-checkbox" name="" id="" ${isExpanded() ? 'checked' : ''}>
      </div>

      ${soundBlocsStr}
    </div>
  `;
}

const getEnvironmentCategoryBlocs = (environment) => {
  let categoryBlocsStr = '';
  for (let category of environment.categories) {
    categoryBlocsStr += getCategoryBloc(category);
  }

  return `${categoryBlocsStr}`;
}
// SOUND DETAILS SCREEN ===================================

const getSoundDetailsScreen = (sound) => {
  document.querySelector(':root').style.setProperty('--min-value', `0%`);
  document.querySelector(':root').style.setProperty('--max-value', `0%`);

  let longestDuration = 0;

  const slider = getUserSliderBySoundName(sound.name);
  // files
  let audioFilesStr = '';
  if (sound.type == 'Background') {
    longestDuration = sound.audio_file.duration;
    audioFilesStr += `<div class="space-between-line"><span>${sound.audio_file.src}</span><span>${getFullTimeStringFromMilliseconds(sound.audio_file.duration) }</span></div>`;
  } else if (sound.type == 'Event') {
    longestDuration = sound.audio_file.duration;
    audioFilesStr += `<div class="space-between-line"><span>${sound.audio_file.src}</span><span>${getFullTimeStringFromMilliseconds(sound.audio_file.duration) }</span></div>`;
  } else if (sound.type == 'Events pack') {
    for (let index = 0; index < sound.audio_files_pack.length; index++) {
      const element = sound.audio_files_pack[index];
      if (element.duration > longestDuration) {
        longestDuration = element.duration;
      }
      audioFilesStr += `<div class="space-between-line"><span>${index + 1}.${element.src}</span><span>${getFullTimeStringFromMilliseconds(element.duration) }</span></div>`;
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
        <div class="space-between-line" style="margin-bottom: 8px;">
          <span style="display: flex; justify-content: flex-start; align-items: center">
            <img src="./medias/images/info.png" style="filter: var(--primary-filter); height: 16px; margin-right: 8px;" />
            <span>Effective volume range</span>
          </span>
          <span id="effectiveRangeValue">75%-85%</span>
        </div>
      `}

      <!-- <button class="solid">Play at max range</button> -->

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

        <div class="space-between-line" style="margin-bottom: 8px;">
          <span style="display: flex; justify-content: flex-start; align-items: center">
            <img src="./medias/images/info.png" style="filter: var(--primary-filter); height: 16px; margin-right: 8px;" />
            <span>
              <span>
                <span id="infoSkipFrequencyValue">${100 - slider.skip_frequency}%</span> chance to be played every
              </span>
              <br>
              <span id="realDelayValue">${getFullTimeStringFromMilliseconds(getRealDelay(slider.repetition_frequency, longestDuration))}</span>
            </span>
            
          </span>
        </div>
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
  }
}

// LOGGING ####################################################################

const logPlaying = (src, volume, isMuted) => {
  const logger = document.getElementById('consoleContent');
  if (isMuted) {
    //console.log('Muted');
    logger.innerHTML = `<span class="log muted"><span>mute</span><span>${src}</span><span style="min-width: 24px"></span></span>${logger.innerHTML}`;
  } else {
    //console.log('Not muted');
    logger.innerHTML = `<span class="log active"><span>play</span><span>${src}</span><span>${roundToDecimals(volume * 100, 0)}%</span></span>${logger.innerHTML}`;
  }
}

const logSkipped = (src) => {
  //console.log('Skipped');
  const logger = document.getElementById('consoleContent');
  logger.innerHTML = `<span class="log skipped"><span>skip</span><span>${src}</span><span style="min-width: 24px"></span></span>${logger.innerHTML}`;
}

// PLAYING CONFIGURATION ######################################################

const createEnvironmentPlayingAudioArray = (envName) => {
  PLAYING_AUDIO_ARRAY = [];
  eventsBankArray = [];
  eventsPacksBankArray = [];

  let soundBase = getEnvironmentSoundBase(envName);

  for (let sound of soundBase) {
    if (sound.type === 'Background') {
      let obj = {
        type: sound.type,
        name: sound.name,
        src: sound.audio_file.src,
        audio: new Audio(`./medias/audio/${sound.audio_file.src}`),
        duration: sound.audio_file.duration,
      }
      PLAYING_AUDIO_ARRAY.push(obj);
    } else if (sound.type === 'Event') {
      let obj = {
        type: sound.type,
        name: sound.name,
        src: sound.audio_file.src,
        audio: new Audio(`./medias/audio/${sound.audio_file.src}`),
        duration: sound.audio_file.duration,
      }
      PLAYING_AUDIO_ARRAY.push(obj);
    } else if (sound.type === 'Events pack') {
      for (let audio of sound.audio_files_pack) {
        let obj = {
          type: sound.type,
          name: sound.name,
          src: audio.src,
          audio: new Audio(`./medias/audio/${audio.src}`),
          duration: audio.duration,
        };
        PLAYING_AUDIO_ARRAY.push(obj)
      }
    }
  }

  for (let obj of PLAYING_AUDIO_ARRAY) {
    if (obj.src !== undefined) {
      let slider = getUserSliderBySoundName(obj.name);
      obj.audio.volume = slider.absolute_volume / 100;
      obj.audio.muted = slider.muted;
    }
  }

  //console.log(PLAYING_AUDIO_ARRAY);
  
  // BACKGROUND SOUNDS ============================================
  playBackgroundSoundsArray();

  // EVENTS =========================================================

  let tempArray1 = soundBase.filter(sound => sound.type === 'Event');

  for (let soundPack of tempArray1) {
    let bank = createAudioPlayer(soundPack);

    eventsBankArray.push({
      name: soundPack.name,
      bank: bank
    });
  }

  for (let event of eventsBankArray) {
    event.bank.start();
  }


  // EVENTS PACKS =================================================

  let tempArray2 = soundBase.filter(sound => sound.type === 'Events pack');

  for (let soundPack of tempArray2) {
    let bank = createAudioPlayer(soundPack);

    eventsPacksBankArray.push({
      name: soundPack.name,
      bank: bank
    });
  }

  for (let eventPack of eventsPacksBankArray) {
    eventPack.bank.start();
  }
}

const playBackgroundSoundsArray = () => {
  for (let obj of PLAYING_AUDIO_ARRAY) {
    if (obj.src !== undefined && obj.type === 'Background') {
      obj.audio.loop = true;
      obj.audio.play();
      let time = getRandomIntegerBetween(0, (obj.duration / 1000));
      obj.audio.currentTime = time;
    }
  }
}

const playEventAudio = (soundName) => {
  const audio = PLAYING_AUDIO_ARRAY.find(e => e.name === soundName);
  let slider = getUserSliderBySoundName(audio.name);
  let randomSkip = getRandomIntegerBetween(0, 100);
  if (randomSkip > slider.skip_frequency) {
    if (slider.relative_min_volume != null && slider.relative_max_volume != null) {
      let minAbsoluteValue = roundToDecimals((slider.relative_min_volume / 100) * slider.absolute_volume, 2);
      let maxAbsoluteValue = roundToDecimals((slider.relative_max_volume / 100) * slider.absolute_volume, 2);
      let randomVolume = roundToDecimals(getRandomIntegerBetween(minAbsoluteValue, maxAbsoluteValue) / 100, 2);
      audio.audio.volume = randomVolume;
      audio.audio.play();
      logPlaying(audio.src, randomVolume, slider.muted);
    } 
  } else {
    logSkipped(audio.src);
  }
}

const playEventsPackRandomAudio = (audioList) => {
  if (audioList.length === 0) return;

  const randomAudio = audioList[getRandomIntegerBetween(0, audioList.length - 1)];
  let slider = getUserSliderBySoundName(randomAudio.name);
  let randomSkip = getRandomIntegerBetween(0, 100);
  if (randomSkip > slider.skip_frequency) {
    if (slider.relative_min_volume != null && slider.relative_max_volume != null) {
      let minAbsoluteValue = roundToDecimals((slider.relative_min_volume / 100) * slider.absolute_volume, 2);
      let maxAbsoluteValue = roundToDecimals((slider.relative_max_volume / 100) * slider.absolute_volume, 2);
      let randomVolume = roundToDecimals(getRandomIntegerBetween(minAbsoluteValue, maxAbsoluteValue) / 100, 2);
      randomAudio.audio.volume = randomVolume;
      randomAudio.audio.play();
      logPlaying(randomAudio.src, randomVolume, slider.muted);
    } 
  } else {
    logSkipped(randomAudio.src);
  }
}

function getRealDelay(repetitionFrequency, longuestDuration) {
  if (repetitionFrequency === 0) { 
    repetitionFrequency = 1; 
  }

  let invertedFreq = (101 - repetitionFrequency); // Garde une échelle de 1 à 100

  let alpha = 1.5;  // Ajuste la pente de la courbe exponentielle
  let k = 0.02;    // Ajuste l’amplitude du facteur exponentiel

  let finalDelay = longuestDuration * (1 + k * Math.pow(invertedFreq, alpha));
  //console.log(finalDelay);
  return finalDelay;
}

function createAudioPlayer(soundPack) {
  let audioList = PLAYING_AUDIO_ARRAY.filter(obj => obj.name === soundPack.name);
  //console.log(audioList)
  let longuestDuration = 0;
  for (let obj of audioList) {
    if (obj.duration > longuestDuration) {
      longuestDuration = obj.duration;
    }
  }
  //console.log(longuestDuration);

  let slider = getUserSliderBySoundName(soundPack.name);
  let repetitionFrequency = slider.repetition_frequency;

  let realDelay = getRealDelay(repetitionFrequency, longuestDuration);
  let timer = null;

  function start() {
      if (timer) clearTimeout(timer);

      function tick() {
        if (soundPack.type === 'Event') {
          playEventAudio(soundPack.name);
        } else {
          playEventsPackRandomAudio(audioList);
        }
          timer = setTimeout(tick, realDelay);
      }

      timer = setTimeout(tick, realDelay);
  }

  function updateDelay(newRepetitionFrequency) {
      realDelay = getRealDelay(newRepetitionFrequency,longuestDuration);
      start(); // Redémarre avec le nouveau délai
  }

  function stop() {
      if (timer) clearTimeout(timer);
      timer = null;
  }

  return { start, updateDelay, stop };
}

const updateCurrentAbsoluteVolume = (name, value) => {
  for (let obj of PLAYING_AUDIO_ARRAY) {
    if (obj.name !== undefined && obj.name === name) {
      obj.audio.volume = value / 100;
    }
  }
}

// INITIALIZATION /////////////////////////////////////////////////////////////////////////////////

logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);
setStorage();

// EXECUTION //////////////////////////////////////////////////////////////////////////////////////
setIhmTheme();
setHomepage();