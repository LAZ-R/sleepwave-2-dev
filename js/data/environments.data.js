export const ENVIRONMENTS = [
  {
    name: 'Neo Tōkyō Penthouse',
    categories: [
      // Weather ==============================================================
      {
        name: 'Weather',
        sounds: [
          {
            name: 'Outdoor Rain',
            type: 'Background',
            audio_file: {
              src: 'outdoor-rain.mp3',
              duration: 6000,
            },
          },
          {
            name: 'Outdoor Wind',
            type: 'Background',
            audio_file: {
              src: 'outdoor-wind.mp3',
              duration: 6000,
            },
          },
        ],
      },
      // City ambiance ========================================================
      {
        name: 'City ambiance',
        sounds: [
          {
            name: 'City speaker',
            type: 'Events pack',
            audio_files_pack: [ 
              {
                src: 'city-speaker-1.mp3',
                duration: 600,
              },
              {
                src: 'city-speaker-2.mp3',
                duration: 700,
              },
            ],
          },
          {
            name: 'Distant crowd',
            type: 'Background',
            audio_file: {
              src: 'distant-crowd.mp3',
              duration: 8465,
            },
          },
        ],
      },
      // Vehicles ========================================================
      {
        name: 'Vehicles',
        sounds: [
          {
            name: 'Spaceship 01',
            type: 'Event',
            audio_file:{
              src: 'spaceship-01.mp3',
              duration: 600,
            },
          },
          {
            name: 'Spaceship 02',
            type: 'Event',
            audio_file:{
              src: 'spaceship-02.mp3',
              duration: 600,
            },
          },
          {
            name: 'Spaceship 03',
            type: 'Event',
            audio_file:{
              src: 'spaceship-03.mp3',
              duration: 600,
            },
          },
        ],
      },
    ]
  },
];