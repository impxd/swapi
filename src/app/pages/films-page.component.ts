import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { map, of } from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'

@Component({
  standalone: true,
  selector: 'app-films-page',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <table>
        <thead>
          <tr>
            <td>Title</td>
            <td>Director</td>
            <td>Producer</td>
            <td>Release date</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let film of vm.films">
            <td>{{ film.title }}</td>
            <td>{{ film.director }}</td>
            <td>{{ film.producer }}</td>
            <td>{{ film.release_date }}</td>
            <td>
              <a
                [routerLink]="[routes.STARSHIPS]"
                [queryParams]="{ fromFilm: film.id }"
              >
                Starships
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styles: [
    `
      app-films-page {
      }
    `,
  ],
})
export class FilmsPageComponent {
  readonly routes = routes
  readonly swapi = inject(SwapiService)

  readonly vm$

  constructor() {
    const films$ = this.swapi
      .fetchFilms()
      .pipe(map((response) => response.results))

    this.vm$ = viewModel({
      films$,
    })
  }
}
