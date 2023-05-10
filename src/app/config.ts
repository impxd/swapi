import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { routerRoutes } from './routes'

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routerRoutes)],
}
