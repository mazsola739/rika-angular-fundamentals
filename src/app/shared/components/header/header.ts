import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

/** The bar at the top: the logo on the left, and whatever the page puts in on the right. */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
