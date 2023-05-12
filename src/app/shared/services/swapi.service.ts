import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { delay, forkJoin, map, of, switchMap } from 'rxjs'

const URL = 'https://swapi.dev/api/'

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  localStorage = window.localStorage
  http = inject(HttpClient)

  // Remote implementation

  fetchFilms() {
    return this.http.get<FetchFilms>(URL + 'films').pipe(
      map((response) => ({
        ...response,
        results: response.results.map((film) => ({
          ...film,
          id: urlId(film.url),
        })),
      }))
    )
  }

  // Remote implementation

  fetchFilm(id: string) {
    return this.http.get<Film>(`${URL}films/${id}`)
  }

  // Remote implementation

  fetchStarships(fromFilm: string | null) {
    return (
      fromFilm
        ? this.fetchFilm(fromFilm).pipe(
            switchMap((film) =>
              forkJoin(
                film.starships.map((url) =>
                  this.fetchStarship(urlId(url), 'remote')
                )
              ).pipe(
                map(
                  (results): FetchStarships => ({
                    count: results.length,
                    next: null,
                    previous: null,
                    results,
                  })
                )
              )
            )
          )
        : this.http.get<FetchStarships>(URL + 'starships')
    ).pipe(
      map((response) => ({
        ...response,
        results: response.results.map((starship) => {
          const length = parseFloat(starship.length.replace(',', ''))

          return {
            ...starship,
            length: length > 999 ? length / 1000 + ' km' : length + ' m',
            id: urlId(starship.url),
          }
        }),
      }))
    )
  }

  // Local & Remote implementations

  fetchStarship(id: string, resource?: 'local' | 'remote') {
    // return from localStorage if exists
    const starship = this.localStorage.getItem(id)
    if (starship && resource !== 'remote')
      return of(JSON.parse(starship) as Starship).pipe(delay(50))

    return this.http.get<Starship>(`${URL}starships/${id}`)
  }

  // Local implementation

  updateStarship(form: Starship) {
    form = structuredClone(form)

    const id = urlId(form.url)
    form._id = id

    this.localStorage.setItem(id, JSON.stringify(form))

    return of({
      success: true,
    })
  }

  // Local implementation

  deleteStarship(id: string) {
    this.localStorage.removeItem(id)

    return of({
      success: true,
    })
  }
}

// Utils

function urlId(url: string) {
  return url.match(/([0-9]+)\/$/)?.[1]!
}

// Types

export interface FetchFilms {
  count: number
  next: string | null
  previous: string | null
  results: Film[]
}

export interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: Date
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: Date
  edited: Date
  url: string
}

export interface FetchStarships {
  count: number
  next: string | null
  previous: string | null
  results: Starship[]
}

export interface Starship {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[]
  films: string[]
  created: Date
  edited: Date
  url: string
  _id?: string // local db identifier
}
