import {
  type AfterViewInit,
  Component,
  type ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core'
import { Button } from '../button/button'

/**
 * A confirmation dialog: the browser's own <dialog>, so focus stays inside it and Escape closes it.
 * The page shows it with @if and removes it on confirm or cancel.
 */
@Component({
  selector: 'app-modal',
  imports: [Button],
  template: `
    <dialog
      #dialog
      class="modal"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
      (cancel)="$event.preventDefault(); cancelled.emit()"
    >
      <div class="modal__title">
        <h2 id="modal-title">{{ title() }}</h2>
        <app-button variant="quiet" iconName="xmark" label="Close" (click)="cancelled.emit()" />
      </div>
      <p id="modal-message" class="modal__message">{{ message() }}</p>
      <div class="modal__actions">
        <app-button [text]="cancelButtonText()" (click)="cancelled.emit()" />
        <app-button [text]="okButtonText()" (click)="confirmed.emit()" />
      </div>
    </dialog>
  `,
  styles: `
    .modal {
      width: min(500px, calc(100vw - 32px));
      padding: 18px 24px 24px;
      border: 0;
      border-radius: 4px;
      background: var(--surface);
      color: var(--ink);
      box-shadow: 0 8px 32px var(--shadow);

      &::backdrop {
        background: rgb(0 0 0 / 40%);
      }

      &__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid var(--line);

        h2 {
          margin: 0;
          font-size: 1.5rem;
        }
      }

      &__message {
        margin: 24px 0 32px;
      }

      &__actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 14px;
      }
    }
  `,
})
export class Modal implements AfterViewInit {
  readonly title = input.required<string>()
  readonly message = input.required<string>()
  readonly okButtonText = input('OK')
  readonly cancelButtonText = input('Cancel')
  readonly confirmed = output()
  readonly cancelled = output()

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  ngAfterViewInit(): void {
    const dialog = this.dialog().nativeElement
    // happy-dom and old browsers have no showModal: the dialog is then simply open.
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
  }
}
