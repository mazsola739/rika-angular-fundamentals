import { button, field, findButton, logIn, renderApp, text, type } from '../testing/render-app'

describe('the courses app', () => {
  it('sends a guest to the login page', async () => {
    const app = await renderApp('/courses')
    expect(app.path()).toBe('/login')
    expect(app.root.querySelector('h1')?.textContent).toContain('Login')
  })

  it('shows the login errors after a submit, not before', async () => {
    const app = await renderApp('/login')
    expect(text(app.root)).not.toContain('Email is required.')

    button(app.root, 'Login').click()
    await app.settle()
    expect(text(app.root)).toContain('Email is required.')
    expect(text(app.root)).toContain('Password is required.')

    type(field(app.root, 'Email'), 'not an email')
    await app.settle()
    expect(text(app.root)).toContain('Please enter a valid email address.')
    expect(field(app.root, 'Email').getAttribute('aria-invalid')).toBe('true')
  })

  it('says so when the password is wrong', async () => {
    const app = await renderApp()
    await logIn(app, 'admin@email.com', 'wrong')
    expect(app.path()).toBe('/login')
    expect(app.root.querySelector('[role="alert"]')?.textContent).toContain(
      'Invalid email or password.',
    )
  })

  it('logs an admin in: name in the header, the courses, add, edit and delete', async () => {
    const app = await renderApp()
    await logIn(app)

    expect(app.path()).toBe('/courses')
    expect(app.root.querySelector('app-header')?.textContent).toContain('Admin')
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(6)
    expect(text(app.root)).toContain('Zombie ipsum')
    expect(text(app.root)).toContain('02:00 hours')
    expect(text(app.root)).toContain('31.10.2010')
    expect(findButton(app.root, 'Add new course')).toBeDefined()
    expect(findButton(app.root, 'Edit Zombie ipsum')).toBeDefined()
    expect(findButton(app.root, 'Delete Zombie ipsum')).toBeDefined()
  })

  it('shows a student the courses without the admin buttons, and keeps them off the form', async () => {
    const app = await renderApp()
    await logIn(app, 'user@email.com', 'user123')

    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(6)
    expect(findButton(app.root, 'Add new course')).toBeUndefined()
    expect(findButton(app.root, 'Edit Zombie ipsum')).toBeUndefined()

    await app.navigate('/courses/add')
    expect(app.path()).toBe('/courses')
  })

  it('keeps a logged-in user away from the login page', async () => {
    const app = await renderApp()
    await logIn(app)
    await app.navigate('/login')
    expect(app.path()).toBe('/courses')
  })

  it('searches by title, and shows every course again', async () => {
    const app = await renderApp()
    await logIn(app)

    type(field(app.root, 'Search the courses'), 'ipsum')
    button(app.root, 'Search').click()
    await app.settle()
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(4)
    expect(text(app.root)).toContain('4 courses found for “ipsum”')

    type(field(app.root, 'Search the courses'), 'unicorn')
    button(app.root, 'Search').click()
    await app.settle()
    expect(text(app.root)).toContain('No courses found')

    button(app.root, 'Show every course').click()
    await app.settle()
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(6)
  })

  it('opens a course page and goes back', async () => {
    const app = await renderApp()
    await logIn(app)

    button(app.root, 'Show course').click()
    await app.settle()
    expect(app.path()).toMatch(/^\/courses\/[\w-]+$/)
    expect(app.root.querySelector('h1')?.textContent).toContain('Zombie ipsum')
    const facts = [...app.root.querySelectorAll('dd')].map((item) => item.textContent?.trim())
    expect(facts).toContain('02:00 hours')
    expect(facts).toContain('31.10.2010')
    expect(facts).toContain('Natasha Romanova, Tony Stark')

    button(app.root, 'Back').click()
    await app.settle()
    expect(app.path()).toBe('/courses')
  })

  it('goes back to the list with a message for an unknown course', async () => {
    const app = await renderApp()
    await logIn(app)
    await app.navigate('/courses/no-such-course')
    expect(app.path()).toBe('/courses')
    expect(text(app.root)).toContain('Course no-such-course was not found.')
  })

  it('deletes a course after asking', async () => {
    const app = await renderApp()
    await logIn(app)

    button(app.root, 'Delete Hodor').click()
    await app.settle()
    expect(text(app.root.querySelector('dialog') as HTMLElement)).toContain(
      'Do you want to delete “Hodor”?',
    )

    button(app.root, 'Cancel').click()
    await app.settle()
    expect(app.root.querySelector('dialog')).toBeNull()
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(6)

    button(app.root, 'Delete Hodor').click()
    await app.settle()
    button(app.root.querySelector('dialog') as HTMLElement, 'Delete').click()
    await app.settle()
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(5)
    expect(text(app.root)).not.toContain('Hodor')
  })

  it('creates a course with a new author', async () => {
    const app = await renderApp()
    await logIn(app)

    button(app.root, 'Add new course').click()
    await app.settle()
    expect(app.path()).toBe('/courses/add')

    button(app.root, 'Create course').click()
    await app.settle()
    expect(text(app.root)).toContain('Title is required.')
    expect(text(app.root)).toContain('Please add at least one author.')

    type(field(app.root, 'Title'), 'Unicorn ipsum')
    type(field<HTMLTextAreaElement>(app.root, 'Description'), 'Rainbows, glitter and a horn.')
    type(field(app.root, 'Duration (minutes)'), '75')
    await app.settle()
    expect(text(app.root)).toContain('01:15 hour')

    type(field(app.root, 'Author Name'), 'Mr Unicorn')
    button(app.root, 'Create author').click()
    await app.settle()
    expect(field(app.root, 'Author Name').value).toBe('')
    button(app.root, 'Add Mr Unicorn to the course').click()
    await app.settle()
    expect(findButton(app.root, 'Remove Mr Unicorn from the course')).toBeDefined()

    button(app.root, 'Create course').click()
    await app.settle()
    expect(app.path()).toBe('/courses')
    expect(app.root.querySelectorAll('app-course-card')).toHaveLength(7)
    expect(text(app.root)).toContain('Unicorn ipsum')
    expect(text(app.root)).toContain('Mr Unicorn')
  })

  it('edits a course', async () => {
    const app = await renderApp()
    await logIn(app)

    button(app.root, 'Edit Hodor').click()
    await app.settle()
    expect(app.path()).toMatch(/^\/courses\/edit\//)
    expect(field(app.root, 'Title').value).toBe('Hodor')

    type(field(app.root, 'Title'), 'Hodor, again')
    button(app.root, 'Update course').click()
    await app.settle()
    expect(app.path()).toBe('/courses')
    expect(text(app.root)).toContain('Hodor, again')
  })

  it('registers a student, who can then log in', async () => {
    const app = await renderApp('/registration')

    type(field(app.root, 'Name'), 'Rika')
    await app.settle()
    expect(text(app.root)).toContain('Name should be at least 6 characters long.')

    type(field(app.root, 'Name'), 'Rika Mazsi')
    type(field(app.root, 'Email'), 'rika@email.com')
    type(field(app.root, 'Password'), 'secret123')
    button(app.root, 'Register').click()
    await app.settle()

    expect(app.path()).toBe('/login?registered=rika@email.com')
    expect(text(app.root)).toContain('Your account is ready.')
    expect(field(app.root, 'Email').value).toBe('rika@email.com')

    type(field(app.root, 'Password'), 'secret123')
    button(app.root, 'Login').click()
    await app.settle()
    expect(app.path()).toBe('/courses')
    expect(app.root.querySelector('app-header')?.textContent).toContain('Rika Mazsi')
  })

  it('logs out on the backend too', async () => {
    const app = await renderApp()
    await logIn(app)
    const token = sessionStorage.getItem('rika-angular-fundamentals:SESSION_TOKEN')
    expect(token).toMatch(/^Bearer /)

    button(app.root, 'Logout').click()
    await app.settle()
    expect(app.path()).toBe('/login')
    expect(sessionStorage.length).toBe(0)

    const me = await app.api.fetch(
      new Request('https://courses.api/users/me', { headers: { Authorization: token ?? '' } }),
    )
    expect(me.status).toBe(401)
  })

  it('goes to the login page when the token stops working', async () => {
    const app = await renderApp()
    await logIn(app)
    // The backend forgets every session, e.g. the token expired.
    await app.api.reset()

    button(app.root, 'Delete Hodor').click()
    await app.settle()
    button(app.root.querySelector('dialog') as HTMLElement, 'Delete').click()
    await app.settle()
    expect(app.path()).toBe('/login')
    expect(sessionStorage.length).toBe(0)
    expect(app.root.querySelector('app-header')?.textContent).toContain('Login')
  })
})
