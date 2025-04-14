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
                src: 'jpn-police-01-a.mp3',
                duration: 17500,
              },
              {
                src: 'jpn-police-01-b.mp3',
                duration: 17500,
              },
              {
                src: 'jpn-police-01-c.mp3',
                duration: 17500,
              },
              {
                src: 'jpn-police-02-a.mp3',
                duration: 10500,
              },
              {
                src: 'jpn-police-02-b.mp3',
                duration: 10500,
              },
              {
                src: 'jpn-police-02-c.mp3',
                duration: 10500,
              },
              {
                src: 'jpn-police-03-a.mp3',
                duration: 14500,
              },
              {
                src: 'jpn-police-03-b.mp3',
                duration: 14500,
              },
              {
                src: 'jpn-police-03-c.mp3',
                duration: 14500,
              },
            ],
          },
          /* {
            name: 'Police alert',
            type: 'Event',
            audio_file: {
              src: 'police-alert.mp3',
              duration: 6000,
            },
          }, */
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
            name: 'Overseeker',
            type: 'Event',
            audio_file:{
              src: 'overseeker.mp3',
              duration: 34500,
            },
          },
          {
            name: 'Aircraft 01',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'aircraft-01-a.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-01-b.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-01-c.mp3',
                duration: 7500,
              },
            ],
          },
          {
            name: 'Aircraft 02',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'aircraft-02-a.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-02-b.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-02-c.mp3',
                duration: 7500,
              },
            ],
          },
          {
            name: 'Aircraft 03',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'aircraft-03-a.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-03-b.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-03-c.mp3',
                duration: 7500,
              },
            ],
          },
          {
            name: 'Aircraft 04',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'aircraft-04-a.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-04-b.mp3',
                duration: 7500,
              },
              {
                src: 'aircraft-04-c.mp3',
                duration: 7500,
              },
            ],
          },
          {
            name: 'Aircraft 05',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'aircraft-05-a.mp3',
                duration: 11500,
              },
              {
                src: 'aircraft-05-b.mp3',
                duration: 11500,
              },
              {
                src: 'aircraft-05-c.mp3',
                duration: 11500,
              },
            ],
          },
          {
            name: 'Podracer',
            type: 'Events pack',
            audio_files_pack: [
              {
                src: 'pod-s-01-a.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-01-b.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-01-c.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-02-a.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-02-b.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-02-c.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-03-a.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-03-b.mp3',
                duration: 6000,
              },
              {
                src: 'pod-s-03-c.mp3',
                duration: 6000,
              },
            ],
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