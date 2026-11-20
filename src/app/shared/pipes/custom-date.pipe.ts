import { Pipe, type PipeTransform } from '@angular/core'

const twoDigits = (value: number) => String(value).padStart(2, '0')

const dotted = (day = '', month = '', year = '') =>
  `${twoDigits(Number(day))}.${twoDigits(Number(month))}.${year}`

/**
 * A date as DD.MM.YYYY. Takes a Date, an ISO date (2021-10-29, what my backend sends) or the
 * DD/MM/YYYY text of the course's backend. Anything else comes back as it was.
 */
export function formatDate(value: Date | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    return `${twoDigits(value.getDate())}.${twoDigits(value.getMonth() + 1)}.${value.getFullYear()}`
  }
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value)
  if (iso) return dotted(iso[3], iso[2], iso[1])
  const slashed = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)
  if (slashed) return dotted(slashed[1], slashed[2], slashed[3])
  return value
}

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    return formatDate(value)
  }
}
