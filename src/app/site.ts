/** My portfolio, which lists this project among my junior projects. */
export const PORTFOLIO_URL = 'https://mazsola739.github.io/mazsola739/'

/** Source code of this site on GitHub. */
export const REPO_URL = 'https://github.com/mazsola739/rika-angular-fundamentals'

/** My React Fundamentals app, built on the same backend. */
export const REACT_APP_URL = 'https://mazsola739.github.io/rika-react-fundamentals/'

/** The accounts of the seed data, shown on the login page. */
export const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@email.com', password: 'admin123', can: 'add, edit and delete' },
  { label: 'Student', email: 'user@email.com', password: 'user123', can: 'browse and search' },
] as const

/** Prefix of everything this app keeps in the browser: every page on mazsola739.github.io shares one origin. */
export const STORAGE_PREFIX = 'rika-angular-fundamentals:'
