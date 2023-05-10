import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { forkJoin, map, of, switchMap } from 'rxjs'

const URL = 'https://swapi.dev/api/'

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  http = inject(HttpClient)

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

  fetchFilm(id: string) {
    return this.http.get<Film>(`${URL}films/${id}`)
  }

  fetchStarships(fromFilm: string | null) {
    return (
      fromFilm
        ? this.fetchFilm(fromFilm).pipe(
            switchMap((film) =>
              forkJoin(
                film.starships.map((url) => this.fetchStarship(urlId(url)))
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

  fetchStarship(id: string) {
    return this.http.get<Starship>(`${URL}starships/${id}`)
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
}
