import { Pipe, type PipeTransform } from '@angular/core'

const twoDigits = (value: number) => String(value).padStart(2, '0')

/** Minutes as the course asked: 121 → "02:01 hours", 90 → "01:30 hour", 45 → "00:45 hour". */
export function formatDuration(minutes: number | null | undefined): string {
  const total = Math.max(0, Math.floor(Number(minutes) || 0))
  const hours = Math.floor(total / 60)
  return `${twoDigits(hours)}:${twoDigits(total % 60)} ${hours >= 2 ? 'hours' : 'hour'}`
}

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    return formatDuration(minutes)
  }
}
