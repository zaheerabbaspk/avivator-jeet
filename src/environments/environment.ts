// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDTlNxxosnCe8zzCltcKTwd5ArzMjt4MfU",
    authDomain: "avivatorjeet.firebaseapp.com",
    projectId: "avivatorjeet",
    storageBucket: "avivatorjeet.firebasestorage.app",
    messagingSenderId: "205180824902",
    appId: "1:205180824902:web:03b6cfa5f43977b0cb0947",
    measurementId: "G-G16QTCMTKV"
  },
  googleClientId: "205180824902-in0ppnfajro5u4hniane6436kki57ek7.apps.googleusercontent.com",
  backendUrl: 'https://backend-production-67ab.up.railway.app',
  supabase: {
    url: 'https://zdkccjutalnqugfccujg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka2NjanV0YWxucXVnZmNjdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Mjg5ODAsImV4cCI6MjA5MjEwNDk4MH0.GXDELsyTpMZgqhgAN8mlKDAETTFM7XEU7NP2Cy95fgE'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
