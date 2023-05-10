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
      <a [routerLink]="routes.HOME">HOME</a>
      <h4>Section Title</h4>
    </nav>

    <div>
      <aside>
        <ul>
          <li *ngFor="let link of resources">
            {{ link.title }}
          </li>
        </ul>
      </aside>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [``],
})
export class AppComponent {
  readonly routes = routes

  readonly resources = [{ title: 'Films', to: routes.FILMS }]
}
