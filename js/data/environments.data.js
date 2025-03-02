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
              duration: 1337000,
            },
          },
          {
            name: 'Indoor Rain',
            type: 'Background',
            audio_file: {
              src: 'indoor-rain.mp3',
              duration: 980030,
            },
          },
          {
            name: 'Outdoor Wind',
            type: 'Background',
            audio_file: {
              src: 'outdoor-wind.mp3',
              duration: 158000,
            },
          },
        ],
      },
      // City ambiance ========================================================
      {
        name: 'City ambiance',
        sounds: [
          {
            name: 'City speaker (female)',
            type: 'Events pack',
            audio_files_pack: [ 
              {
                src: 'city-speaker-f-01.mp3',
                duration: 19000,
              },
              {
                src: 'city-speaker-f-02.mp3',
                duration: 17000,
              },
              {
                src: 'city-speaker-f-03.mp3',
                duration: 31000,
              },
              {
                src: 'city-speaker-f-04.mp3',
                duration: 17000,
              },
              {
                src: 'city-speaker-f-05.mp3',
                duration: 19000,
              },
              {
                src: 'city-speaker-f-06.mp3',
                duration: 20000,
              },
            ],
          },
          {
            name: 'City speaker (male)',
            type: 'Events pack',
            audio_files_pack: [ 
              {
                src: 'city-speaker-m-01.mp3',
                duration: 14000,
              },
              {
                src: 'city-speaker-m-02.mp3',
                duration: 13000,
              },
              {
                src: 'city-speaker-m-03.mp3',
                duration: 10000,
              },
              {
                src: 'city-speaker-m-04.mp3',
                duration: 29000,
              },
              {
                src: 'city-speaker-m-05.mp3',
                duration: 8000,
              },
            ],
          },
          {
            name: 'Police patrol',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'police-01.mp3',
                duration: 21000,
              },
              {
                src: 'police-02.mp3',
                duration: 15000,
              },
              {
                src: 'police-03.mp3',
                duration: 21000,
              },
              {
                src: 'police-03.mp3',
                duration: 23000,
              },
            ],
          },
          {
            name: 'Police alert',
            type: 'Event',
            audio_file: {
              src: 'police-alert.mp3',
              duration: 6000,
            },
          },
          {
            name: 'Distant crowd',
            type: 'Background',
            audio_file: {
              src: 'distant-crowd.mp3',
              duration: 770000,
            },
          },
        ],
      },
      // Vehicles ========================================================
      {
        name: 'Vehicles',
        sounds: [
          {
            name: 'Huge spaceship',
            type: 'Event',
            audio_file:{
              src: 'huge-spaceship.mp3',
              duration: 34500,
            },
          },
          {
            name: 'Spaceship 01',
            type: 'Event',
            audio_file:{
              src: 'spaceship-01.mp3',
              duration: 13000,
            },
          },
          {
            name: 'Spaceship 02',
            type: 'Event',
            audio_file:{
              src: 'spaceship-02.mp3',
              duration: 14000,
            },
          },
          {
            name: 'Spaceship 03',
            type: 'Event',
            audio_file:{
              src: 'spaceship-03.mp3',
              duration: 14000,
            },
          },
          {
            name: 'Spaceship 04',
            type: 'Event',
            audio_file:{
              src: 'spaceship-04.mp3',
              duration: 14000,
            },
          },
          {
            name: 'Spaceship 05',
            type: 'Event',
            audio_file:{
              src: 'spaceship-05.mp3',
              duration: 15000,
            },
          },
        ],
      },
    ]
  },
  /* {
    name: 'Mountain Cabin',
    categories: []
  },
  {
    name: 'Dinotopia\'s Waterfall City',
    categories: []
  }, */
];