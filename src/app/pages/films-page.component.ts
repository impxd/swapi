import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { catchError, merge, of, partition, share, startWith, map } from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'
import { HttpErrorResponse } from '@angular/common/http'

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

          <tr *ngIf="vm.error" class="error">
            <td colspan="5">{{ vm.error }}</td>
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

          tbody tr.error {
            td {
              text-align: center;
              color: var(--error);
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
    const filmsRequest$ = this.swapi.fetchFilms().pipe(
      map((response) => response.results),
      catchError((error: HttpErrorResponse) => of(error)),
      share()
    )

    const [filmsError$, filmsSuccess$] = partition(
      filmsRequest$,
      (value): value is HttpErrorResponse => value instanceof HttpErrorResponse
    )

    const films$ = merge(filmsSuccess$, filmsError$.pipe(map(() => []))).pipe(
      startWith(null)
    )

    const error$ = filmsError$.pipe(
      map(() => 'Network connection error'),
      startWith(null)
    )

    this.vm$ = viewModel({
      films$,
      error$,
    })
  }
}
