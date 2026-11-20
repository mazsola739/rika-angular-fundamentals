import { inject, provideAppInitializer } from '@angular/core'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faCircleHalfStroke,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faRightFromBracket,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

/** The Font Awesome icons of the app, so a component can name them: <app-button iconName="pen">. */
export const provideIcons = () =>
  provideAppInitializer(() => {
    const library = inject(FaIconLibrary)
    library.addIcons(
      faArrowLeft,
      faCircleHalfStroke,
      faMagnifyingGlass,
      faPen,
      faPlus,
      faRightFromBracket,
      faTrashCan,
      faXmark,
    )
    library.addIcons(faEye, faEyeSlash)
  })
