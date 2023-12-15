import {UserModel} from "./models/user.model";

export const API_URL = 'https://student.cloud.htl-leonding.ac.at/lowco2/'
export const API2_URL = 'http://localhost:3000/'

export const USER: UserModel = {
  id: 1,
  firstname: 'Florian',
  lastname: 'Jungwirth',
  metric: true,
  email: 'florian22jungwirth@gmail.com',
  isAdmin: true,
  username: 'flo'
}

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