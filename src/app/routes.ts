import { Routes } from '@angular/router'
import { FilmsPageComponent } from 'src/app/pages/films-page.component'

export const routes = {
  HOME: '/',
  FILMS: '/films',
} as const

export const routerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'films',
    pathMatch: 'full',
  },
  {
    path: 'films',
    component: FilmsPageComponent,
  },
]
