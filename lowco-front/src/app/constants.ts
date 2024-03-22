import {UserModel} from "./models/user.model";
//export const API2_URL = 'http://localhost:8080/'
export const API2_URL = 'https://student.cloud.htl-leonding.ac.at/lowco2-neu/'
export const KEYCLOAK_URL_ADMIN = 'https://student.cloud.htl-leonding.ac.at/lowco2-keycloak/'
export const KEYCLOAK_URL_TOKEN = 'https://student.cloud.htl-leonding.ac.at/lowco2-keycloak/'
export const CLIENT_SECRET = 'HplXEhgvG5MH3vMHjuCdsTrUPfQ3iYOW'
export const CLIENT_ID = 'lowco2_client'
export const CLIENT_UUID = '75340221-2aa6-4349-bd27-51284929ac80'

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
