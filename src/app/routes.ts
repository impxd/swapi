import { Routes } from '@angular/router'
import { FilmsPageComponent } from 'src/app/pages/films-page.component'
import { StarshipsPageComponent } from 'src/app/pages/starships-page.component'

export const routes = {
  HOME: '/',
  FILMS: '/films',
  STARSHIPS: '/starships',
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
  {
    path: 'starships',
    component: StarshipsPageComponent,
  },
]
