import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { filter, map, of, switchMap } from 'rxjs'
import { viewModel } from 'src/app/shared/utils'
import { SwapiService } from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'

@Component({
  standalone: true,
  selector: 'app-starship-edit-page',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h3>Edit Starship</h3>
      <hr />

      <form>
        <label>
          Name
          <i
            data-tooltip="The name of this starship. The common name, such as 'Death Star'."
          >
            ⓘ
          </i>
        </label>
        <input type="text" [value]="vm.form.name" />
        <span class="errormessage">-</span>

        <label>
          Model
          <i
            data-tooltip="The model or official name of this starship. Such as 'T-65 X-wing' or 'DS-1 Orbital Battle Station'."
          >
            ⓘ
          </i>
        </label>
        <textarea [value]="vm.form.model"></textarea>
        <span class="errormessage">-</span>

        <label>
          Manufacturer
          <i
            data-tooltip="The manufacturer of this starship. Comma separated if more than one."
          >
            ⓘ
          </i>
        </label>

        <textarea [value]="vm.form.manufacturer"></textarea>
        <span class="errormessage">-</span>

        <label>
          Length
          <i data-tooltip="The length of this starship in meters."> ⓘ </i>
        </label>
        <input type="text" [value]="vm.form.length" />
        <span class="errormessage">-</span>

        <label>
          Starship class
          <i
            data-tooltip="The class of this starship, such as 'Starfighter' or 'Deep Space Mobile Battlestation'."
          >
            ⓘ
          </i>
        </label>
        <input type="text" [value]="vm.form.starship_class" />
        <span class="errormessage">-</span>

        <label>
          Hyperdrive rating
          <i data-tooltip="The class of this starships hyperdrive."> ⓘ </i>
        </label>
        <input type="text" [value]="vm.form.hyperdrive_rating" />
        <span class="errormessage">-</span>

        <label>
          Crew
          <i
            data-tooltip="The number of personnel needed to run or pilot this starship."
          >
            ⓘ
          </i>
        </label>
        <input type="text" [value]="vm.form.crew" />
        <span class="errormessage">-</span>

        <label>
          Passengers
          <i
            data-tooltip="The number of non-essential people this starship can transport."
          >
            ⓘ
          </i>
        </label>
        <input type="text" [value]="vm.form.passengers" />
        <span class="errormessage">-</span>

        <div class="actions">
          <button>Save</button>
          <button>Delete</button>
        </div>
      </form>
    </ng-container>
  `,
  styles: [
    `
      app-starship-edit-page {
        > h3 {
          margin-top: 0;
          margin-bottom: 6px;
        }

        > form {
          label:not(:first-child) {
            margin-top: 8px;
          }

          i {
            margin-left: 4px;
            font-size: 15px;
            font-style: normal;
            font-weight: bold;
            color: #bebebe;
          }

          input {
            margin-bottom: 4px;
            width: 100%;
            box-sizing: border-box;
          }

          .errormessage {
            display: block;
            margin-left: 10px;
            visibility: hidden;
            font-size: 13px;
            color: red;
          }

          .actions {
            display: flex;
          }
        }
      }
    `,
  ],
})
export class StarshipEditPageComponent {
  readonly routes = routes

  readonly swapi = inject(SwapiService)
  readonly route = inject(ActivatedRoute)

  readonly vm$

  constructor() {
    const form$ = this.route.queryParamMap.pipe(
      switchMap((queryParams) =>
        this.swapi.fetchStarship(queryParams.get('starship')!)
      )
    )

    this.vm$ = viewModel({
      form$,
    })
  }
}

type SetNameAction = {
  type: 'setName'
  value: string
}
