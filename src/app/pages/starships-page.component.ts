import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { map, of, switchMap } from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'

@Component({
  standalone: true,
  selector: 'app-starships-page',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
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
        </thead>
        <tbody>
          <tr *ngFor="let starship of vm.starships">
            <td>{{ starship.name }}</td>
            <td>{{ starship.model }}</td>
            <td>{{ starship.manufacturer }}</td>
            <td>{{ starship.length }}</td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styles: [
    `
      app-starships-page {
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
      switchMap((queryParams) =>
        this.swapi
          .fetchStarships(queryParams.get('fromFilm'))
          .pipe(map((response) => response.results))
      )
    )

    this.vm$ = viewModel({
      starships$,
    })
  }
}
