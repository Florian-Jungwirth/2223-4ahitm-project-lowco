import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {TitleService} from '../services/title.service';
import {SurveyService} from '../services/survey.service';
import {Capacitor, registerPlugin} from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import {BluetoothSerial} from "@speedengineering/capacitor-bluetooth-serial"

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

import {
  FirebaseMessaging,
  GetTokenOptions,
} from "@capacitor-firebase/messaging";
import {environment} from 'src/environments/environment';
import {CoordinateModel} from '../models/coordinate.model';
import {LocalNotifications, ScheduleOptions} from '@capacitor/local-notifications';
import {JoinedUserSurveyModel} from "../models/userSurvey.model";
import { SurveyModel } from '../models/survey.model';
import { BehaviorSubject } from 'rxjs';
import {HomePage} from "./home/home.page";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
  providers: [HomePage]
})
export class PagesPage {
  isLocationModalOpen = false;
  isChangeVehicleModalOpen = false;
  title = "";
  locomotionSurveys: JoinedUserSurveyModel[] = []
  locomotionValue: number = 0
  reload = false
  showBackButton = false
  showBluetoothSymbol = false

  constructor(
    private router: Router,
    private surveyService: SurveyService,
    private titleService: TitleService,
    private navCtrl: NavController,
    private home: HomePage
  ) {

    connectedEmitter.subscribe(data => {
      this.showBluetoothSymbol = data
    })

    this.getMostLikelyVehicle = this.getMostLikelyVehicle.bind(this);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = this.router.url !== '/lowco';
      }
    });

    this.titleService.title.subscribe((data: string) => {
      this.title = data;
    })

    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", {event});
    });

    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", JSON.stringify(event));
    });

    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", JSON.stringify(event));

      if (Capacitor.getPlatform() === "web") {
        navigator.serviceWorker.addEventListener("message", (event: any) => {
          console.log("serviceWorker message: ", {event});
          const notification = new Notification(event.data.notification.title, {
            body: event.data.notification.body,
          });
          notification.onclick = (event) => {
            console.log("notification clicked: ", {event});
          };
        });
      }
    })

    this.getToken().then(this.requestPermissions)

    LocalNotifications.addListener('localNotificationReceived', () => {
      if (bluetoothMessage) {
        this.surveyService.addValueToUserSurvey(2, Math.random() * 10000).subscribe(() => {
          this.surveyService.getActiveQuicksHome()
        })
      }
    })

    LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {

      if (payload.notification.id == 1 && payload.actionId == 'tap' && !payload.notification.extra.bluetooth) {
        this.getSurveysOfFortbewegung();
        this.isChangeVehicleModalOpen = true;
        this.locomotionValue = payload.notification.extra;
      }
    })
  }

  goBack() {
    this.navCtrl.back();
  }

  getMostLikelyVehicle = () => {
    mostLikelyVehicle = getVehicle(60);
    return mostLikelyVehicle;
  };

  getSurveysOfFortbewegung() {
    this.surveyService.getSurveysOfCategory(1).subscribe((userSurveys: JoinedUserSurveyModel[]) => {
      this.locomotionSurveys = userSurveys;
    })
  }

  saveLocationModalValue(id: number) {
    if (this.locomotionValue != 0) {
      this.surveyService.addValueToUserSurvey(id, this.locomotionValue * 1000).subscribe(() => {
        this.surveyService.getActiveQuicksHome()
      })
    }
    this.isLocationModalOpen = false;
    this.isChangeVehicleModalOpen = false;
  }

  templateNotification() {
    let distance = 3;
    sendNotification(`Fahrt wurde beendet (${distance.toFixed(2).replace('.', ',')}km)`, 'Klicken, um Fortbewegungsmittel auszuwählen.', distance)
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const options: GetTokenOptions = {
      vapidKey: environment.firebase.vapidKey,
    };
    if (Capacitor.getPlatform() === "web") {
      options.serviceWorkerRegistration =
        await navigator.serviceWorker.register("firebase-messaging-sw.js");
    }
    const {token} = await FirebaseMessaging.getToken(options);
    console.log(token);
  }
}

function getDistanceBetweenTwoPoints(previousCoord: CoordinateModel, currentCoord: CoordinateModel) {
  if (previousCoord.lat == currentCoord.lat && previousCoord.lon == currentCoord.lon || previousCoord.lat == -1) {
    return 0;
  }

  const radlat1 = (Math.PI * previousCoord.lat) / 180;
  const radlat2 = (Math.PI * currentCoord.lat) / 180;

  const theta = previousCoord.lon - currentCoord.lon;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}

async function sendNotification(title: string, body: string, distance: number) {
  let options: ScheduleOptions = {
    notifications: [
      {
        title,
        body,
        extra: distance,
        id: 1
      }
    ]
  }

  await LocalNotifications.schedule(options)
}

async function sendNotificationBluetooth(title: string, body: string, distance: number) {
  let options: ScheduleOptions = {
    notifications: [
      {
        title,
        body,
        extra: {bluetooth: true, distance},
        id: 1
      }
    ]
  }

  await LocalNotifications.schedule(options)
}

function getVehicle(this: any, velocity: number){
  if(velocity >= 25 && velocity <= 35){
    return this.locomotionSurveys[3];
    //Bike
  }
  else if(velocity > 35 && velocity <= 55){
    return this.locomotionSurveys[1];
    //Public Transport
  }
  else if(velocity > 55 && velocity <= 500){
    return this.locomotionSurveys[0];
    //Car
  }
  else if(velocity > 500){
    return this.locomotionSurveys[2];
    //Plane
  }
}

let startTime = Date.now();
let mostLikelyVehicle: SurveyModel = {} as SurveyModel;
let previousCoordinates: CoordinateModel = {lat: -1, lon: -1}
let distance = 0;
let isDriving = false;
let connectedToCarWithBluetooth = false;
let connectedEmitter = new BehaviorSubject<boolean>(false)
let bluetoothMessage = false
let timeout: any = undefined;
const speedLimit = 25;

BluetoothSerial.addListener("onConnectionChange", (connectionState) => {
  if (connectionState.state == 'CONNECTED' && connectionState.device) {
    let connectedDevice = connectionState.device;
    console.log('Connected: ' + JSON.stringify(connectedDevice));

    BluetoothSerial.getPairedDevices().then((data) => {
      for (const device of data.devices) {
        if (device.address == connectedDevice.address) {
          console.log('found: ' + JSON.stringify(device));
          if (device.class == 1056 || device.class == 1028) {//TODO: Remove second class
            console.log('CAAr');
            isDriving = true;
            connectedEmitter.next(true)
            connectedToCarWithBluetooth = true;
          }
        }
      }
    })
  } else if(connectionState.state == 'DISCONNECTED') {
    console.log('Other event: ' + JSON.stringify(connectionState))
    clearTimeout(timeout)
    sendNotificationBluetooth(`Fahrt wurde beendet (${distance.toFixed(2).replace('.', ',')}km)`, 'Klicken, um Fortbewegungsmittel auszuwählen.', distance)
    connectedToCarWithBluetooth = false;
    bluetoothMessage = true
    isDriving = false;
    distance = 0;
    connectedEmitter.next(false)
  }

  //wearable headphones: 1028
  //car: 1056
  //https://developer.android.com/reference/android/bluetooth/BluetoothClass.Device#AUDIO_VIDEO_CAR_AUDIO

})

BackgroundGeolocation.addWatcher(
  {
    backgroundMessage: "Stoppe die App um Akku zu sparen.",

    backgroundTitle: "LowCO2 greift auf deinen Standort zu",

    requestPermissions: true,

    stale: false,

    distanceFilter: 5
  },
  function callback(location, error) {
    if (error) {
      if (error.code === "NOT_AUTHORIZED") {
        if (window.confirm(
          "Diese App braucht deinen Standort, " +
          "hat aber keine Erlaubnis darauf zuzugreifen.\n\n" +
          "Einstellungen öffnen?"
        )) {
          BackgroundGeolocation.openSettings();
        }
      }
      return console.error(error);
    }

    // if (location?.simulated) {
    //   window.alert("Your location seems to be simulated.")
    //   return;
    // }

    let currentCoord = {lat: location?.latitude || 0, lon: location?.longitude || 0}

    if (location != undefined && location.speed != null) {
      let speedInKMH = location.speed * 3.6
      console.log("speed: " + (location.speed * 3.6))

      if (speedInKMH > speedLimit) {
        if (!isDriving) {
          isDriving = true;
          startTime = Date.now();
          console.log("Fahrt wurde gestartet");
        } else {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            console.log("Fahrt wurde beendet");
            let endTime = Date.now();
            let averageVelocity = (endTime-startTime)/distance;

            mostLikelyVehicle =  getVehicle(averageVelocity);

            sendNotification(`Fahrt wurde beendet (${distance.toFixed(2).replace('.', ',')}km)`, 'Klicken, um Fortbewegungsmittel auszuwählen.', distance)

            isDriving = false;
            distance = 0;
          }, 1000 * 120)
          console.log("Fährt noch immer");
        }
      }
    }

    if (isDriving) {

      distance += getDistanceBetweenTwoPoints(previousCoordinates, currentCoord)
      console.log(distance);
      console.log(previousCoordinates.lat + ' ' + previousCoordinates.lon);

      console.log("------------------------------");
      previousCoordinates = currentCoord
    }
    return;
  }
).then(function after_the_watcher_has_been_added(watcher_id) {
  // BackgroundGeolocation.removeWatcher({
  //   id: watcher_id
  // });
  console.log("watcher added");

});
