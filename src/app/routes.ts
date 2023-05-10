import { Routes } from '@angular/router'
import { FilmsPageComponent } from 'src/app/pages/films-page.component'
import { StarshipsPageComponent } from 'src/app/pages/starships-page.component'

export const routes = {
  HOME: '/',
  FILMS: '/films',
  STARSHIPS: '/starships',
  STARSHIP_EDIT: '/starships/edit',
} as const

export const routerRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'films',
  },
  {
    path: 'films',
    component: FilmsPageComponent,
  },
  {
    path: 'starships',
    component: StarshipsPageComponent,
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('src/app/pages/starship-edit-page.component').then(
            (m) => m.StarshipEditPageComponent
          ),
      },
    ],
  },
]
