import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'huishoudboekje-79473',
          appId: '1:859373289692:web:0726a7c3c61c831e483419',
          storageBucket: 'huishoudboekje-79473.appspot.com',
          apiKey: 'AIzaSyAzpcnNE2wPllB2Gi-lFUmlQkcMBFz4dEY',
          authDomain: 'huishoudboekje-79473.firebaseapp.com',
          messagingSenderId: '859373289692',
          measurementId: 'G-0RBEH7LYD4',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
  ],
};
