import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterOutlet } from '@angular/router'
import { routes } from 'src/app/routes'

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header>
      <img src="/assets/logo.png" alt="Star Wars" />
      <h2>Starwars API</h2>
    </header>

    <nav>
      <ul>
        <li *ngFor="let link of resources">
          <a [routerLink]="[link.to]">{{ link.title }}</a>
        </li>
      </ul>
    </nav>

    <main>
      <router-outlet />
    </main>
  `,
  styles: [
    `
      app-root {
        > header {
          display: flex;
          align-items: center;

          img {
            width: 100%;
            max-width: 120px;
            height: auto;
          }

          h2 {
            margin: 0 auto;
          }
        }

        > nav ul {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin: 2.5rem 0;
          padding: 0;
        }
      }
    `,
  ],
})
export class AppComponent {
  readonly routes = routes
  readonly resources = [
    { title: 'Films', to: routes.FILMS },
    { title: 'Starships', to: routes.STARSHIPS },
  ] as const
}
