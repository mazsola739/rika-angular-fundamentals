/** Runs before every test file, after Angular's TestBed is set up. */
afterEach(() => {
  vi.restoreAllMocks()
  sessionStorage.clear()
  localStorage.clear()
})
