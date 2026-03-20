# Build Android APK locally

## Prerequisites

- **Node.js** (already used for the app)
- **Java JDK 17** – [Adoptium](https://adoptium.net/) or install via Android Studio
- **Android SDK** – easiest: install [Android Studio](https://developer.android.com/studio) and use its SDK; set `ANDROID_HOME` to the SDK path (e.g. `C:\Users\<You>\AppData\Local\Android\Sdk`)

## Quick build (debug APK, no signing)

Good for testing on device or emulator:

```bash
npm run build:apk:debug
```

Output: `android\app\build\outputs\apk\debug\app-debug.apk`

Install on a device: copy the APK and open it, or use `adb install android\app\build\outputs\apk\debug\app-debug.apk`.

## Release APK (for distribution)

```bash
npm run build:apk
```

Output: `android\app\build\outputs\apk\release\app-release.apk`

**First time:** Release builds must be signed. If the build asks for a keystore:

1. Create a keystore (one-time):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore android\app\my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add to `android/gradle.properties` (do not commit real passwords):
   ```properties
   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
   MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
   ```
3. Ensure `android/app/build.gradle` uses these (Expo prebuild may already configure signing).

## Regenerating native project

If you change `app.config.js` or add/remove native modules:

```bash
npm run prebuild:android
```

Then run `build:apk:debug` or `build:apk` again.

## Troubleshooting

- **"ANDROID_HOME not set"** – Set the env var to your Android SDK path (e.g. in Android Studio: File → Settings → Appearance & Behavior → System Settings → Android SDK → "Android SDK location").
- **"JAVA_HOME not set"** – Point it to your JDK 17 (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`).
- **Prebuild fails** – Run `npx expo prebuild --platform android --clean` and fix any reported errors (e.g. missing config).
