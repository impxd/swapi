import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import {
  Observable,
  Subject,
  combineLatest,
  exhaustMap,
  filter,
  fromEvent,
  map,
  merge,
  of,
  scan,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs'
import { boolean, z } from 'zod'
import { viewModel } from 'src/app/shared/utils'
import {
  type Starship,
  SwapiService,
} from 'src/app/shared/services/swapi.service'
import { routes } from 'src/app/routes'
import { Starship as StarshipSchema } from 'src/app/shared/schemas'

@Component({
  standalone: true,
  selector: 'app-starship-edit-page',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h3>Edit Starship</h3>
      <hr />
      <div class="progress-bar--container">
        <div
          class="progress-bar"
          [style.display]="vm.form == null ? 'block' : 'none'"
        >
          <div></div>
        </div>
      </div>

      <form
        (submit)="
          $event.preventDefault(); dispatch({ type: 'submit', form: vm.form! })
        "
      >
        <label [class.changed]="vm.changes.has('name')">
          <span>Name</span>
          <i
            data-tooltip="The name of this starship. The common name, such as 'Death Star'."
          >
            ⓘ
          </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.name"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('name')"
          (input)="
            dispatch({ type: 'setName', value: asAny($event.target).value })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('name')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('model')">
          <span>Model</span>
          <i
            data-tooltip="The model or official name of this starship. Such as 'T-65 X-wing' or 'DS-1 Orbital Battle Station'."
          >
            ⓘ
          </i>
        </label>
        <textarea
          [value]="vm.form?.model"
          rows="2"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('model')"
          (input)="
            dispatch({ type: 'setModel', value: asAny($event.target).value })
          "
        ></textarea>
        <span class="errormessage">
          {{ vm.validations.get('model')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('manufacturer')">
          <span>Manufacturer</span>
          <i
            data-tooltip="The manufacturer of this starship. Comma separated if more than one."
          >
            ⓘ
          </i>
        </label>
        <textarea
          [value]="vm.form?.manufacturer"
          rows="3"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('manufacturer')"
          (input)="
            dispatch({
              type: 'setManufacturer',
              value: asAny($event.target).value
            })
          "
        ></textarea>
        <span class="errormessage">
          {{ vm.validations.get('manufacturer')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('length')">
          <span>Length</span>
          <i data-tooltip="The length of this starship in meters."> ⓘ </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.length"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('length')"
          (input)="
            dispatch({ type: 'setLength', value: asAny($event.target).value })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('length')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('starship_class')">
          <span>Starship class</span>
          <i
            data-tooltip="The class of this starship, such as 'Starfighter' or 'Deep Space Mobile Battlestation'."
          >
            ⓘ
          </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.starship_class"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('starship_class')"
          (input)="
            dispatch({
              type: 'setStarshipClass',
              value: asAny($event.target).value
            })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('starship_class')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('hyperdrive_rating')">
          <span>Hyperdrive rating</span>
          <i data-tooltip="The class of this starships hyperdrive."> ⓘ </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.hyperdrive_rating"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('hyperdrive_rating')"
          (input)="
            dispatch({
              type: 'setHyperdriveRating',
              value: asAny($event.target).value
            })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('hyperdrive_rating')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('crew')">
          <span>Crew</span>
          <i
            data-tooltip="The number of personnel needed to run or pilot this starship."
          >
            ⓘ
          </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.crew"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('crew')"
          (input)="
            dispatch({
              type: 'setCrew',
              value: asAny($event.target).value
            })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('crew')?.[0] || '-' }}
        </span>

        <label [class.changed]="vm.changes.has('passengers')">
          <span>Passengers</span>
          <i
            data-tooltip="The number of non-essential people this starship can transport."
          >
            ⓘ
          </i>
        </label>
        <input
          type="text"
          [value]="vm.form?.passengers"
          placeholder="- -"
          [attr.aria-invalid]="vm.validations.has('passengers')"
          (input)="
            dispatch({
              type: 'setPassengers',
              value: asAny($event.target).value
            })
          "
        />
        <span class="errormessage">
          {{ vm.validations.get('passengers')?.[0] || '-' }}
        </span>

        <div class="actions">
          <button
            type="submit"
            [disabled]="
              vm.form == null ||
              vm.validations.size > 0 ||
              vm.changes.size === 0
            "
          >
            Save
          </button>

          <button
            type="button"
            [disabled]="vm.form == null || vm.changes.size === 0"
            (click)="dispatch({ type: 'reset' })"
          >
            Reset
          </button>
          <button
            type="button"
            [disabled]="vm.form == null || vm.form.id == null"
            (click)="dispatch({ type: 'delete', id: vm.form?.id! })"
          >
            Delete
          </button>
        </div>
        <span
          class="errormessage"
          [style.visibility]="vm.validations.size > 0 ? 'visible' : 'hidden'"
        >
          Fix {{ vm.validations.size }} error{{
            vm.validations.size === 1 ? '' : 's'
          }}
          to proceed
        </span>
      </form>

      <!-- Top overlays -->

      <dialog id="dialog">
        <form method="dialog">
          <p>Do you confirm the action?</p>
          <button type="submit" value="ok" autofocus>ok</button>
          <button type="submit" value="cancel">cancel</button>
        </form>
      </dialog>
    </ng-container>
  `,
  styles: [
    `
      app-starship-edit-page {
        > h3 {
          margin-top: 0;
          margin-bottom: 6px;
        }

        > .progress-bar--container {
          overflow-x: clip;
          position: relative;

          .progress-bar {
            position: absolute;
            margin-top: -9px;
          }
        }

        > form {
          label {
            margin-bottom: 4px;

            span {
              line-height: 1rem;
              border-bottom: 1px dashed transparent;
            }

            &.changed span {
              border-bottom: 1px dashed black;
            }

            i {
              margin-left: 4px;
              font-size: 15px;
              font-style: normal;
              font-weight: bold;
              color: #bebebe;
            }
          }

          input,
          textarea {
            margin-bottom: 3px;
            width: 100%;
            box-sizing: border-box;

            &[aria-invalid='true'] {
              outline: 2px solid var(--error);
            }
          }

          .errormessage {
            display: block;
            margin-left: 5px;
            margin-bottom: 8px;
            visibility: hidden;
            white-space: nowrap;
            font-size: 13px;
            color: var(--error);
          }

          [aria-invalid='true'] + .errormessage {
            visibility: visible;
          }

          .actions {
            margin-bottom: 4px;
            display: flex;
            justify-content: space-around;
            gap: 0.5rem;

            button {
              width: 100%;
              margin: 0;
              padding: 10px 16px;
            }

            & + .errormessage {
              text-align: right;
            }
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

  readonly actions = new Subject<Action>()
  readonly schema = StarshipSchema
  readonly vm$

  constructor() {
    const loadAction$ = this.route.queryParamMap.pipe(
      map((queryParams) => queryParams.get('starship')),
      filter(Boolean)
    )

    const initForm$ = loadAction$.pipe(
      switchMap((starship) => this.swapi.fetchStarship(starship)),
      shareReplay(1)
    )

    const form$ = merge(
      loadAction$.pipe(map(() => null)),
      initForm$.pipe(
        switchMap((initForm) => {
          const form = structuredClone(initForm)

          return this.on(
            'setName',
            'setModel',
            'setManufacturer',
            'setLength',
            'setStarshipClass',
            'setHyperdriveRating',
            'setCrew',
            'setPassengers',
            'reset'
          ).pipe(
            scan((form, a) => {
              switch (a.type) {
                case 'setName':
                  form.name = a.value
                  break

                case 'setModel':
                  form.model = a.value
                  break

                case 'setManufacturer':
                  form.manufacturer = a.value
                  break

                case 'setLength':
                  form.length = a.value
                  break

                case 'setStarshipClass':
                  form.starship_class = a.value
                  break

                case 'setHyperdriveRating':
                  form.hyperdrive_rating = a.value
                  break

                case 'setCrew':
                  form.crew = a.value
                  break

                case 'setPassengers':
                  form.passengers = a.value
                  break

                case 'reset':
                  form = structuredClone(initForm)
                  break

                default:
                  const _e: never = a
                  throw 'invalid type'
                  break
              }

              return form
            }, form),
            startWith(form)
          )
        })
      )
    ).pipe(shareReplay(1))

    const validations$ = form$.pipe(
      map((form): Map<string, string[]> => {
        const r = this.schema.safeParse(form)

        if (r.success) return new Map()

        return new Map(Object.entries(r.error.flatten().fieldErrors))
      })
    )

    const changes$ = initForm$.pipe(
      switchMap((initForm) =>
        form$.pipe(
          filter(Boolean),
          map(
            (form) =>
              new Set(
                Object.keys(initForm).filter(
                  (key) =>
                    JSON.stringify(initForm[key as keyof typeof initForm]) !==
                    JSON.stringify(form[key as keyof typeof form])
                )
              )
          )
        )
      ),
      startWith(new Set<string>())
    )

    this.vm$ = viewModel({
      form$,
      validations$,
      changes$,
    })
  }

  // Methods

  dispatch(a: Action) {
    this.actions.next(a)
  }

  on<T extends Action['type'][]>(...types: T) {
    const set = new Set(types)

    return this.actions.pipe(
      filter(
        (
          a
        ): a is Extract<
          Action,
          { type: T extends Array<infer U> ? U : never }
        > => set.has(a.type)
      )
    )
  }

  fromUIConfirm() {
    return new Observable<'ok' | 'cancel'>((observer) => {
      const dialogEl =
        window.document.querySelector<HTMLDialogElement>('#dialog')!
      dialogEl.returnValue = 'cancel'

      function close() {
        observer.next(dialogEl.returnValue as 'ok' | 'cancel')
        observer.complete()
      }

      dialogEl.addEventListener('close', close)

      dialogEl.showModal()

      return () => {
        dialogEl.removeEventListener('close', close)
        dialogEl.close()
      }
    })
  }

  // Utils

  asAny<T>(val: T) {
    return val as any
  }
}

// UI Interaction

type SetNameAction = {
  type: 'setName'
  value: string
}

type SetModelAction = {
  type: 'setModel'
  value: string
}

type SetManufacturerAction = {
  type: 'setManufacturer'
  value: string
}

type SetLengthAction = {
  type: 'setLength'
  value: string
}

type SetStarshipClassAction = {
  type: 'setStarshipClass'
  value: string
}

type SetHyperdriveRatingAction = {
  type: 'setHyperdriveRating'
  value: string
}

type SetCrewAction = {
  type: 'setCrew'
  value: string
}

type SetPassengersAction = {
  type: 'setPassengers'
  value: string
}

type SubmitAction = {
  type: 'submit'
  form: Starship
}

type ResetAction = {
  type: 'reset'
}

type DeleteAction = {
  type: 'delete'
  id: string
}

type Action =
  | SetNameAction
  | SetModelAction
  | SetManufacturerAction
  | SetLengthAction
  | SetStarshipClassAction
  | SetHyperdriveRatingAction
  | SetCrewAction
  | SetPassengersAction
  | SubmitAction
  | ResetAction
  | DeleteAction
