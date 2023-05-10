import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

const URL = 'https://swapi.dev/api/'

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  http = inject(HttpClient)

  fetchFilms() {
    return this.http.get<FetchFilms>(URL + 'films')
  }
}

export interface FetchFilms {
  count: number
  next: null
  previous: null
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
