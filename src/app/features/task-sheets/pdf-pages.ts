import { Component, type ElementRef, effect, input, signal, viewChild } from '@angular/core'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

// The build copies pdf.js's worker next to the app (angular.json, assets).
GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.min.mjs'

/** The widest a page is drawn, in pixels: sharp on a 2x screen at the page's ~800px width. */
const MAX_RENDER_WIDTH = 1600

/**
 * Draws every page of a PDF with pdf.js and shows it as an image, so the sheet is part of the page
 * on every device, phones included. pdf.js is big: the task sheet page loads it with @defer.
 */
@Component({
  selector: 'app-pdf-pages',
  template: `
    <div #container class="pdf-pages">
      @if (failed()) {
        <p class="form-alert" role="alert">
          The task sheet could not be shown here, open the PDF instead.
        </p>
      } @else {
        @for (page of pages(); track page; let index = $index) {
          <img [src]="page" [alt]="title() + ', page ' + (index + 1) + ' of ' + total()" />
        }
        @if (total() === 0 || pages().length < total()) {
          <p class="status" role="status">
            @if (total()) {
              Loading page {{ pages().length + 1 }} of {{ total() }}…
            } @else {
              Loading the task sheet…
            }
          </p>
        }
      }
    </div>
  `,
  styles: `
    .pdf-pages {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    img {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 2px;
      background: #fff;
      box-shadow: 0 1px 4px var(--shadow-soft);
    }

    .status {
      color: var(--muted);
    }
  `,
})
export class PdfPages {
  readonly url = input.required<string>()
  readonly title = input.required<string>()

  protected readonly pages = signal<string[]>([])
  protected readonly total = signal(0)
  protected readonly failed = signal(false)
  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container')

  constructor() {
    effect((onCleanup) => {
      const url = this.url()
      // As wide as the page shows it on this screen, so a phone draws smaller, faster pictures.
      const shownWidth = this.container().nativeElement.clientWidth || 800
      const renderWidth = Math.min(
        MAX_RENDER_WIDTH,
        Math.round(shownWidth * Math.min(window.devicePixelRatio || 1, 2)),
      )
      let cancelled = false
      const imageUrls: string[] = []
      const task = getDocument({ url })
      this.pages.set([])
      this.total.set(0)
      this.failed.set(false)

      void (async () => {
        try {
          const pdf = await task.promise
          if (cancelled) return
          this.total.set(pdf.numPages)
          for (let number = 1; number <= pdf.numPages && !cancelled; number++) {
            const page = await pdf.getPage(number)
            const viewport = page.getViewport({
              scale: renderWidth / page.getViewport({ scale: 1 }).width,
            })
            const canvas = document.createElement('canvas')
            canvas.width = Math.ceil(viewport.width)
            canvas.height = Math.ceil(viewport.height)
            await page.render({ canvas, viewport }).promise
            // JPEG encodes many times faster than PNG; pdf.js paints the page white anyway.
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, 'image/jpeg', 0.9),
            )
            canvas.width = 0
            page.cleanup()
            if (!blob || cancelled) return
            const imageUrl = URL.createObjectURL(blob)
            imageUrls.push(imageUrl)
            this.pages.update((list) => [...list, imageUrl])
          }
        } catch {
          if (!cancelled) this.failed.set(true)
        }
      })()

      onCleanup(() => {
        cancelled = true
        void task.destroy()
        for (const imageUrl of imageUrls) URL.revokeObjectURL(imageUrl)
      })
    })
  }
}
