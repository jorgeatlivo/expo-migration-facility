
![Livo logo](./assets/store/livo.svg)


# Livo Facilities
This is an app for facilities, meant to help them create and manage shifts on the go. This app is a companion to the Livo Management Portal.


## Get started

1. **Install dependencies**
   ```bash
   yarn install
   ```
2. **Prebuild native code**

   ```bash
   npx expo prebuild
   ```
3. **Populate iOS Dev profile**
* Open `./ios/LivoFacilities.xcodeproj` project on xCode
* On the left column, selectLivoFacilities and, under **Targets**, duplicate _LivoFacilities_ as _LivoFacilities Dev_.
* On _LivoFacilities Dev_, go to **Build Settings** and change the following data:
  * **Product bundle identifier**: Append `.com` to the end to distinguish it from the prod bundle.
  * **Icon**: Change it from _AppIcon_ to _AppIcon Dev_

4. **Install the app on your device or emulator**

   ```bash
   # If you're using an iPhone:
   yarn ios
   # If you're using an Android device:
   yarn android
   ```

5. **If it's already installed, run the app**
   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Create builds of the app

#### First step
* Be sure to update app version and build number on `app.config.js`
* Run npx expo prebuild to update native configs before building the app

#### To upload to Firebase
* IOS
   ```bash
   # Development build
   yarn ipa/dev
   # Production build
   yarn ipa/prod
   ```
* Android
    ```bash
    # Development build
    yarn apk/dev
    # Production build
    yarn apk/prod
     ```
#### To upload to the stores
* IOS
  * Archive the app on xCode and select **"Upload to App Store"**
* Android
  * Create an app bundle and upload it to the store
      ```bash
       yarn aab/prod
       ```