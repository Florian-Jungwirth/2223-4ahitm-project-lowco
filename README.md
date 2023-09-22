# LowCo2

### Zeiterfassung
https://docs.google.com/spreadsheets/d/1ciXUxWBHKJaS97QTnzsY2lcP2Up7ShhN_Ap_1lQG9ig/edit#gid=0
### Notion
https://www.notion.so/invite/a55dcb1446b5d7f186334f34f69612358946839b

### Create iOS
- ionic cap add ios
- npm run build
- npx cap sync
- ionic capacitor copy ios
- ionic cap open ios (Opens XCode)

### Create Android
#### Prerequisites
- Android SDK
- Android Studio
- Ionic Capacitor (Comes with Ionic)

#### Steps
- Create AVD (Android Virtual Device in Android Studio
- In the project folder, run: `ionic capacitor add android`
- When you have implemented some changes that you wish to see, run `ionic capacitor copy android`
- Open the Android Folder that has been generated in your project Folder in Android Studio
- Run
  - If you want to do a live reload, run: `ionic capacitor run android -l --external`

Android tutorial in detail: https://ionicframework.com/docs/developing/android#set-up-an-android-device

In case of an error with BoxGeometry (after running npm install in lowco-back and lowco-front), go into BoxGeometry.d.ts and remove the parameters object
