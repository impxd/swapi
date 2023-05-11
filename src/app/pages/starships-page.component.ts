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
            [routerLink]="[routes.STARSHIP_EDIT]"
            [queryParams]="{ starship: starship.id }"
            queryParamsHandling="merge"
            [class.selected]="vm.selectedItem === starship.id"
          >
            <td>{{ starship.name }}</td>
            <td>{{ starship.model }}</td>
            <td>{{ starship.manufacturer }}</td>
            <td>{{ starship.length }}</td>
          </tr>
        </tbody>
      </table>

      <aside *ngIf="vm.showEdit">
        <router-outlet />
      </aside>
    </ng-container>
  `,
  styles: [
    `
      app-starships-page {
        display: flex;
        gap: 1.5rem;

        > table {
          overflow-x: clip;

          thead {
            position: relative;

            .progress-bar {
              position: absolute;
            }
          }

          tbody tr {
            cursor: pointer;

            &.selected,
            &:hover {
              background-color: #cdcdcd;
            }
          }
        }

        aside {
          width: 100%;
          max-width: 250px;
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
