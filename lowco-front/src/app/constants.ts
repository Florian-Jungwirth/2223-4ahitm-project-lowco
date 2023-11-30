export const API_URL = 'https://student.cloud.htl-leonding.ac.at/lowco2/'
// export const API_URL = 'http://localhost:3000/'

export const USER_ID = 1;
export enum Types {
  Einfach = 'e',
  Anzahl = 'a'
}

export const MEASUREMENTS = [
  {
    name: 'd',
    fullName: 'Distanz',
    units: {
      metrisch: {
        m: 1,
        km: 1000
      },
      imperial: {
        mi: 1609.344,
        ft: 0.3048
      }
    }
  },
  {
    name: 'a',
    fullName: 'Anzahl'
  },
  {
    name: 'z',
    fullName: 'Zeit',
    units: {
      h: 3600,
      min: 60,
      s: 1
    }
  }
]

export const SERVER_URL_NEU = 'http://localhost:3000/'
