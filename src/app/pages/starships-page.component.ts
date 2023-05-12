import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router'
import {
  catchError,
  distinctUntilChanged,
  filter,
  share,
  map,
  of,
  startWith,
  switchMap,
  partition,
  merge,
} from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  standalone: true,
  selector: 'app-starships-page',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Model</td>
            <td>Manufacturer</td>
            <td>Length</td>
          </tr>

          <div
            class="progress-bar"
            [style.display]="vm.starships == null ? 'block' : 'none'"
          >
            <div></div>
          </div>
        </thead>
        <tbody>
          <tr
            *ngFor="let starship of vm.starships"
            [class.selected]="vm.selectedItem === starship.id"
          >
            <a
              [routerLink]="[routes.STARSHIP_EDIT]"
              [queryParams]="{ starship: starship.id }"
              queryParamsHandling="merge"
            >
              <td>{{ starship.name }}</td>
              <td>{{ starship.model }}</td>
              <td>{{ starship.manufacturer }}</td>
              <td>{{ starship.length }}</td>
            </a>
          </tr>

          <tr *ngIf="vm.error" class="error">
            <td colspan="5">{{ vm.error }}</td>
          </tr>
        </tbody>
      </table>

      <aside [class.open]="vm.showEdit">
        <a
          [routerLink]="[routes.STARSHIPS]"
          [queryParams]="{ starship: null }"
          queryParamsHandling="merge"
        >
          ✕
        </a>
        <router-outlet />
      </aside>
    </ng-container>
  `,
  styles: [
    `
      app-starships-page {
        display: flex;

        > table {
          min-height: 880px;
          overflow-x: clip;

          thead {
            position: relative;

            .progress-bar {
              position: absolute;
            }
          }

          tbody tr {
            &:not(.error):hover {
              background-color: #dddddd;
            }

            &.selected {
              background-color: #cdcdcd;
            }

            &.error {
              td {
                text-align: center;
                color: var(--error);
              }
            }

            a {
              display: contents;
              color: inherit;
            }
          }
        }

        aside {
          width: 0px;
          max-width: 250px;
          transform: translateX(100px);
          opacity: 0;
          transition: transform, opacity 100ms ease-in-out;

          &.open {
            width: 100%;
            transform: translateX(0);
            opacity: 1;
            margin-left: 1.5rem;
          }

          a {
            float: right;
            margin-top: 1px;
            margin-left: 8px;
            font-size: 1.3rem;
            font-weight: bold;
            color: inherit;
          }
        }
      }
    `,
  ],
})
export class StarshipsPageComponent {
  readonly routes = routes

  readonly swapi = inject(SwapiService)
  readonly route = inject(ActivatedRoute)

  readonly vm$

  constructor() {
    const starshipsRequest$ = this.route.queryParamMap.pipe(
      map((queryParams) => queryParams.get('fromFilm')),
      distinctUntilChanged(),
      switchMap((fromFilm) =>
        this.swapi.fetchStarships(fromFilm).pipe(
          map((response) => response.results),
          catchError((error: HttpErrorResponse) => of(error))
        )
      ),
      share()
    )

    const [starshipsError$, starshipsSuccess$] = partition(
      starshipsRequest$,
      (value): value is HttpErrorResponse => value instanceof HttpErrorResponse
    )

    const starships$ = merge(
      starshipsSuccess$,
      starshipsError$.pipe(map(() => []))
    ).pipe(startWith(null))

    const error$ = starshipsError$.pipe(
      map(() => 'Network connection error'),
      startWith(null)
    )

    const showEdit$ = this.route.queryParamMap.pipe(
      map((queryParams) => queryParams.has('starship'))
    )

    const selectedItem$ = this.route.queryParamMap.pipe(
      map((queryParams) => queryParams.get('starship'))
    )

    this.vm$ = viewModel({
      starships$,
      error$,
      showEdit$,
      selectedItem$,
    })
  }
}
