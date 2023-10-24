import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnimationController, IonModal, NavController } from '@ionic/angular';
import { ModalService } from '../services/modal.service';
import { TitleService } from '../services/title.service';
import { SurveyService } from '../services/survey.service';
import { Capacitor, registerPlugin } from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

import {
  FirebaseMessaging,
  GetTokenOptions,
} from "@capacitor-firebase/messaging";
import { environment } from 'src/environments/environment';
import { Coordinate } from '../models/coordinate.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage {
  isModalOpen = false;
  unitBefore: any;
  valueBefore: any
  obj: any;
  @ViewChild('modal') modal: IonModal;
  units: any;
  title = "";
  token = "";
  // selectedBefore = null;
  //showNum = 0;

  constructor(
    private animationCtrl: AnimationController,
    private modalService: ModalService,
    private router: Router,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    private titleService: TitleService,
  ) {
    this.modalService.modalState.subscribe((obj) => {
      this.isModalOpen = true;
      this.obj = obj;
      this.obj.value = this.obj.value != null ? this.obj.value.toFixed(2) : '';
      this.units = Object.keys(obj.relevantMeasures);
      this.unitBefore = obj.unit
      this.valueBefore = obj.value
      // this.showNum = obj.value
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = this.router.url !== '/lowco';
      }
    });

    this.titleService.title.subscribe((data: string) => {
      this.title = data;
    })

    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", { event });
    });

    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", JSON.stringify(event));
    });

    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", JSON.stringify(event));

      if (Capacitor.getPlatform() === "web") {
        navigator.serviceWorker.addEventListener("message", (event: any) => {
          console.log("serviceWorker message: ", { event });
          const notification = new Notification(event.data.notification.title, {
            body: event.data.notification.body,
          });
          notification.onclick = (event) => {
            console.log("notification clicked: ", { event });
          };
        });
      }
    })
    
    this.getToken().then(this.requestPermissions)
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    if (root != null) {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);
      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    } else {
      return null;
    }
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    let ret = this.enterAnimation(baseEl);
    if (ret != null) {
      return ret.direction('reverse');
    }
    return null;
  };

  okModal() {

    if (this.valueBefore != this.obj.value || this.obj.unit != this.unitBefore) {
      this.surveyService.updateUserSurvey(
        this.obj.id,
        this.obj.value * this.obj.relevantMeasures[this.obj.unit],
        this.obj.unit
      );
      this.modalService.updateValue(this.obj.id, this.obj.value, this.obj.unit);
    }
    this.isModalOpen = false;
  }

  showBackButton: boolean = false;

  goBack() {
    // this.location.back();
    this.navCtrl.back();
  }

  changeInput(e: any) {
    this.obj.unit = e.target.value
    //   if(this.selectedBefore == null) {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.obj.unit]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   } else {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.selectedBefore]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   }

    //   this.selectedBefore = e.target.value
  }

  dismiss() {
    this.isModalOpen = false;
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
    const { token } = await FirebaseMessaging.getToken(options);
    console.log(token);

    this.token = token;
  }

}

function getDistanceBetweenTwoPoints(previousCoord: Coordinate, currentCoord: Coordinate) {
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

let previousCoordinates: Coordinate = { lat: -1, lon: -1 }
let distance = 0;
let isDriving = false;
let drivingStartTime: Date | null = null;
let lastSpeedUpdate: Date | null = null;
const speedLimit = 25;

BackgroundGeolocation.addWatcher(
  {
    backgroundMessage: "Cancel to prevent battery drain.",

    backgroundTitle: "Tracking You.",

    requestPermissions: true,

    stale: false,

    distanceFilter: 5
  },
  function callback(location, error) {
    if (error) {
      if (error.code === "NOT_AUTHORIZED") {
        if (window.confirm(
          "This app needs your location, " +
          "but does not have permission.\n\n" +
          "Open settings now?"
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

    let currentCoord = { lat: location?.latitude || 0, lon: location?.longitude || 0 }

    if (location != undefined && location.speed != null) {
      let speedInKMH = location.speed * 3.6
      console.log("speed: " + (location.speed * 3.6))

      if (speedInKMH > speedLimit) {
        // Die Geschwindigkeitsgrenze ist überschritten, Benutzer ist in Bewegung.
        if (!isDriving) {
          // Neue Fahrt beginnt.
          isDriving = true;
          drivingStartTime = new Date();
          console.log("Fahrt wurde gestartet");
        }
        lastSpeedUpdate = new Date();
        console.log("Fährt noch immer");
      } else {
        // Die Geschwindigkeit ist unter der Grenze.
        if (isDriving) {
          // Der Benutzer war vorher in Bewegung.
          const currentTime = new Date();
          if (lastSpeedUpdate) {
            const timeDifference = currentTime.getTime() - lastSpeedUpdate.getTime();

            if (timeDifference >= 5 * 60 * 1000) {
              // Wenn die Geschwindigkeit 5 Minuten oder länger unter der Grenze bleibt, nehme an, dass die Fahrt beendet ist.
              // Sende dem Benutzer eine Benachrichtigung.
              console.log("Fahrt wurde beendet");

              isDriving = false;
            }
          }
        }
      }
    }

    distance += getDistanceBetweenTwoPoints(previousCoordinates, currentCoord)
    console.log(distance);
    console.log(previousCoordinates.lat + ' ' + previousCoordinates.lon);


    console.log("------------------------------");
    previousCoordinates = currentCoord
    return;

  }
).then(function after_the_watcher_has_been_added(watcher_id) {
  // BackgroundGeolocation.removeWatcher({
  //   id: watcher_id
  // });
  console.log("watcher added");

});