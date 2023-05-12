import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router'
import {
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'

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
            &:hover {
              background-color: #dddddd;
            }

            &.selected {
              background-color: #cdcdcd;
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
    const starships$ = this.route.queryParamMap.pipe(
      map((queryParams) => queryParams.get('fromFilm')),
      distinctUntilChanged(),
      switchMap((fromFilm) =>
        this.swapi
          .fetchStarships(fromFilm)
          .pipe(map((response) => response.results))
      ),
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
      showEdit$,
      selectedItem$,
    })
  }
}
