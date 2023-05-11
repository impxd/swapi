import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { map, merge, of, share, startWith } from 'rxjs'
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

          <div
            class="progress-bar"
            [style.display]="vm.films == null ? 'block' : 'none'"
          >
            <div></div>
          </div>
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
        > table {
          overflow-x: clip;

          thead {
            position: relative;

            .progress-bar {
              position: absolute;
            }
          }
        }
      }
    `,
  ],
})
export class FilmsPageComponent {
  readonly routes = routes

  readonly swapi = inject(SwapiService)

  readonly vm$

  constructor() {
    const films$ = this.swapi.fetchFilms().pipe(
      map((response) => response.results),
      startWith(null)
    )

    this.vm$ = viewModel({
      films$,
    })
  }
}
