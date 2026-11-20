import { CustomDatePipe, formatDate } from './custom-date.pipe'
import { DurationPipe, formatDuration } from './duration.pipe'

describe('duration pipe', () => {
  it.each([
    [121, '02:01 hours'],
    [90, '01:30 hour'],
    [60, '01:00 hour'],
    [45, '00:45 hour'],
    [666, '11:06 hours'],
  ])('shows %i minutes as %s', (minutes, expected) => {
    expect(new DurationPipe().transform(minutes)).toBe(expected)
  })

  it('shows nothing typed yet as zero', () => {
    expect(formatDuration(null)).toBe('00:00 hour')
    expect(formatDuration(undefined)).toBe('00:00 hour')
  })
})

describe('custom date pipe', () => {
  it('shows a date as DD.MM.YYYY', () => {
    const pipe = new CustomDatePipe()
    expect(pipe.transform('2021-10-29')).toBe('29.10.2021')
    expect(pipe.transform('08/03/2021')).toBe('08.03.2021')
    expect(pipe.transform('8/3/2021')).toBe('08.03.2021')
    expect(pipe.transform(new Date(2012, 2, 20))).toBe('20.03.2012')
  })

  it('leaves what is not a date alone', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(null)).toBe('')
    expect(formatDate(new Date(Number.NaN))).toBe('')
    expect(formatDate('yesterday')).toBe('yesterday')
  })
})
