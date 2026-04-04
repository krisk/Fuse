import Fuse from '../dist/fuse.mjs'

// ────────────────────────────────────────────────────────────
// Real-world scenario tests for token search
// Each describe block models an actual product use case
// ────────────────────────────────────────────────────────────

describe('Scenario: Documentation site search', () => {
  const docs = [
    { title: 'Getting Started with Express', body: 'Install Express and create your first HTTP server with routing and middleware support' },
    { title: 'Express Routing Guide', body: 'Define routes using app.get, app.post, and the Express Router for modular route handling' },
    { title: 'Express Middleware', body: 'Use middleware functions to handle authentication, logging, error handling, and request parsing' },
    { title: 'Database Integration', body: 'Connect Express to MongoDB, PostgreSQL, or MySQL using popular ORM libraries' },
    { title: 'Error Handling in Express', body: 'Implement custom error handling middleware and manage async errors gracefully' },
    { title: 'Authentication with Passport.js', body: 'Add login, signup, and OAuth authentication to your Express application using Passport strategies' },
    { title: 'Deploying Express Apps', body: 'Deploy your Express application to Heroku, AWS, or Docker containers in production' },
    { title: 'Testing Express APIs', body: 'Write integration tests for Express routes using Jest, Supertest, and test databases' },
    { title: 'WebSocket Integration', body: 'Add real-time communication to Express with Socket.io for live chat and notifications' },
    { title: 'REST API Design', body: 'Best practices for designing RESTful APIs with Express including versioning and pagination' }
  ]

  const fuse = new Fuse(docs, {
    useTokenSearch: true,
    includeScore: true,
    keys: ['title', 'body']
  })

  test('Misspelled multi-word query: "rout midleware"', () => {
    const result = fuse.search('rout midleware')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Should find middleware and routing docs despite typos
    const topTitles = result.slice(0, 3).map((r) => r.item.title)
    expect(topTitles).toContain('Express Middleware')
  })

  test('Natural language query: "how to handle errors"', () => {
    const result = fuse.search('handle errors')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Error Handling in Express')
  })

  test('Partial recall: "passport login"', () => {
    const result = fuse.search('passport login')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Authentication with Passport.js')
  })

  test('Broad query narrows correctly: "express deploy production"', () => {
    const result = fuse.search('express deploy production')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Deploy doc matches all 3 terms; others only match "express"
    expect(result[0].item.title).toBe('Deploying Express Apps')
  })
})

describe('Scenario: E-commerce product search', () => {
  const products = [
    { name: 'Nike Air Max 90', category: 'Running Shoes', description: 'Classic black running shoes with Air Max cushioning and breathable mesh upper' },
    { name: 'Nike Air Force 1', category: 'Casual Shoes', description: 'White leather casual sneakers with classic Air Force design and rubber sole' },
    { name: 'Adidas Ultraboost 22', category: 'Running Shoes', description: 'Responsive blue running shoes with Boost midsole and Primeknit upper' },
    { name: 'New Balance 574', category: 'Casual Shoes', description: 'Grey suede lifestyle sneakers with ENCAP midsole cushioning technology' },
    { name: 'Puma RS-X', category: 'Casual Shoes', description: 'Retro-inspired chunky sneakers with RS foam cushioning in white and red' },
    { name: 'Nike Dunk Low', category: 'Skateboard Shoes', description: 'Low-top skateboarding shoes in green and white with padded collar' },
    { name: 'Adidas Stan Smith', category: 'Casual Shoes', description: 'Minimalist white leather tennis shoes with green heel tab and rubber cupsole' },
    { name: 'Brooks Ghost 15', category: 'Running Shoes', description: 'Neutral road running shoes with DNA LOFT cushioning and segmented crash pad' },
    { name: 'Converse Chuck Taylor', category: 'Casual Shoes', description: 'High-top canvas sneakers in black with rubber toe cap and vulcanized sole' },
    { name: 'Asics Gel-Kayano 29', category: 'Running Shoes', description: 'Stability running shoes with GEL technology and dynamic duomax support system' },
    { name: 'Vans Old Skool', category: 'Skateboard Shoes', description: 'Classic side-stripe skate shoes in black and white with suede and canvas' },
    { name: 'Reebok Classic Leather', category: 'Casual Shoes', description: 'Heritage leather fitness sneakers in white with die-cut EVA midsole' }
  ]

  const fuse = new Fuse(products, {
    useTokenSearch: true,
    includeScore: true,
    keys: [
      { name: 'name', weight: 2 },
      { name: 'category', weight: 1.5 },
      { name: 'description', weight: 1 }
    ]
  })

  test('Typo-heavy query: "blak runing shoes"', () => {
    const result = fuse.search('blak runing shoes')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Running shoes with "black" in description should rank high
    const topNames = result.slice(0, 3).map((r) => r.item.name)
    expect(topNames).toContain('Nike Air Max 90')
  })

  test('Brand + attribute: "nike white"', () => {
    const result = fuse.search('nike white')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Air Force 1 is white Nike shoes
    const topNames = result.slice(0, 3).map((r) => r.item.name)
    expect(topNames).toContain('Nike Air Force 1')
  })

  test('Category-style query: "casual leather white"', () => {
    const result = fuse.search('casual leather white')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Multiple matches, but Stan Smith and Air Force 1 match all three
    const topNames = result.slice(0, 3).map((r) => r.item.name)
    const hasLeatherWhiteCasual = topNames.some((n) =>
      ['Adidas Stan Smith', 'Nike Air Force 1', 'Reebok Classic Leather'].includes(n)
    )
    expect(hasLeatherWhiteCasual).toBe(true)
  })

  test('Vague query still returns relevant results: "comfy shoes running"', () => {
    const result = fuse.search('comfy shoes running')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Running shoes should dominate since they match "running" + "shoes"
    const topCategories = result.slice(0, 3).map((r) => r.item.category)
    expect(topCategories.filter((c) => c === 'Running Shoes').length).toBeGreaterThanOrEqual(1)
  })
})

describe('Scenario: Command palette', () => {
  const commands = [
    { name: 'Git: Commit', description: 'Commit staged changes to the repository' },
    { name: 'Git: Push', description: 'Push local commits to the remote repository' },
    { name: 'Git: Pull', description: 'Pull latest changes from the remote repository' },
    { name: 'Git: Stash', description: 'Stash current working directory changes' },
    { name: 'Git: Stash Apply', description: 'Apply the most recent stash to the working directory' },
    { name: 'Git: Stash Pop', description: 'Pop the most recent stash and apply it to the working directory' },
    { name: 'Git: Create Branch', description: 'Create a new git branch from the current HEAD' },
    { name: 'Git: Delete Branch', description: 'Delete a local git branch' },
    { name: 'Git: Merge Branch', description: 'Merge a branch into the current branch' },
    { name: 'Git: Rebase', description: 'Rebase the current branch onto another branch' },
    { name: 'File: Open', description: 'Open a file from the filesystem' },
    { name: 'File: Save', description: 'Save the current file to disk' },
    { name: 'File: Save All', description: 'Save all open files to disk' },
    { name: 'File: New File', description: 'Create a new untitled file' },
    { name: 'Editor: Format Document', description: 'Format the entire document using the default formatter' },
    { name: 'Editor: Toggle Word Wrap', description: 'Toggle word wrapping in the editor' },
    { name: 'Editor: Find and Replace', description: 'Open find and replace dialog in the editor' },
    { name: 'Terminal: New Terminal', description: 'Open a new integrated terminal instance' },
    { name: 'Terminal: Clear', description: 'Clear the terminal output' },
    { name: 'View: Toggle Sidebar', description: 'Show or hide the sidebar panel' }
  ]

  const fuse = new Fuse(commands, {
    useTokenSearch: true,
    includeScore: true,
    keys: [
      { name: 'name', weight: 2 },
      { name: 'description', weight: 1 }
    ]
  })

  test('Multi-word command: "git stash apply"', () => {
    const result = fuse.search('git stash apply')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('Git: Stash Apply')
  })

  test('Abbreviated: "new term"', () => {
    const result = fuse.search('new term')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('Terminal: New Terminal')
  })

  test('Typo: "formatt documnt"', () => {
    const result = fuse.search('formatt documnt')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('Editor: Format Document')
  })

  test('Reversed word order: "branch create"', () => {
    const result = fuse.search('branch create')
    expect(result.length).toBeGreaterThanOrEqual(1)
    const topNames = result.slice(0, 3).map((r) => r.item.name)
    expect(topNames).toContain('Git: Create Branch')
  })

  test('Single word matches across commands: "branch"', () => {
    const result = fuse.search('branch')
    const names = result.slice(0, 5).map((r) => r.item.name)
    expect(names).toContain('Git: Create Branch')
    expect(names).toContain('Git: Delete Branch')
    expect(names).toContain('Git: Merge Branch')
  })
})

describe('Scenario: Contact search', () => {
  const contacts = [
    { name: 'John Smith', email: 'john.smith@acme.com', company: 'Acme Corporation', city: 'New York' },
    { name: 'Jane Doe', email: 'jane@startup.io', company: 'TechStart Inc', city: 'San Francisco' },
    { name: 'Robert Johnson', email: 'rjohnson@bigcorp.com', company: 'BigCorp Industries', city: 'Chicago' },
    { name: 'Maria Garcia', email: 'maria@designco.com', company: 'DesignCo Studio', city: 'Los Angeles' },
    { name: 'James Wilson', email: 'jwilson@fintech.com', company: 'FinTech Solutions', city: 'Boston' },
    { name: 'Sarah Connor', email: 'sconnor@cyberdyne.com', company: 'Cyberdyne Systems', city: 'Los Angeles' },
    { name: 'Michael Chen', email: 'mchen@globaltech.com', company: 'GlobalTech Partners', city: 'Seattle' },
    { name: 'Emily Brown', email: 'ebrown@creative.com', company: 'Creative Agency', city: 'Portland' },
    { name: 'David Kim', email: 'dkim@dataflow.com', company: 'DataFlow Analytics', city: 'Austin' },
    { name: 'Lisa Zhang', email: 'lzhang@quantum.com', company: 'Quantum Computing Ltd', city: 'Boston' }
  ]

  const fuse = new Fuse(contacts, {
    useTokenSearch: true,
    includeScore: true,
    keys: ['name', 'company', 'city']
  })

  test('Name + city: "john new york"', () => {
    const result = fuse.search('john new york')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('John Smith')
  })

  test('Misspelled name: "micheal chen"', () => {
    const result = fuse.search('micheal chen')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('Michael Chen')
  })

  test('Company + city: "boston tech"', () => {
    const result = fuse.search('boston tech')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // FinTech in Boston or Quantum in Boston
    const topNames = result.slice(0, 3).map((r) => r.item.name)
    const hasBostonTech = topNames.some((n) =>
      ['James Wilson', 'Lisa Zhang'].includes(n)
    )
    expect(hasBostonTech).toBe(true)
  })

  test('Partial name: "sarah los"', () => {
    const result = fuse.search('sarah los')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.name).toBe('Sarah Connor')
  })
})

describe('Scenario: Music library search', () => {
  const songs = [
    { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
    { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
    { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California' },
    { title: 'Dark Side of the Moon', artist: 'Pink Floyd', album: 'The Dark Side of the Moon' },
    { title: 'Imagine', artist: 'John Lennon', album: 'Imagine' },
    { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind' },
    { title: 'Yesterday', artist: 'The Beatles', album: 'Help!' },
    { title: 'Sweet Child O Mine', artist: 'Guns N Roses', album: 'Appetite for Destruction' },
    { title: 'Comfortably Numb', artist: 'Pink Floyd', album: 'The Wall' },
    { title: 'Like a Rolling Stone', artist: 'Bob Dylan', album: 'Highway 61 Revisited' },
    { title: 'Purple Rain', artist: 'Prince', album: 'Purple Rain' },
    { title: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here' },
    { title: 'Hey Jude', artist: 'The Beatles', album: 'Single' },
    { title: 'Born to Run', artist: 'Bruce Springsteen', album: 'Born to Run' },
    { title: 'What a Wonderful World', artist: 'Louis Armstrong', album: 'Single' }
  ]

  const fuse = new Fuse(songs, {
    useTokenSearch: true,
    includeScore: true,
    keys: [
      { name: 'title', weight: 2 },
      { name: 'artist', weight: 1.5 },
      { name: 'album', weight: 1 }
    ]
  })

  test('Partial title: "dark side moon"', () => {
    const result = fuse.search('dark side moon')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Dark Side of the Moon')
  })

  test('Artist + song fragment: "pink floyd wall"', () => {
    const result = fuse.search('pink floyd wall')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // "Comfortably Numb" is on The Wall by Pink Floyd
    expect(result[0].item.artist).toBe('Pink Floyd')
    expect(result[0].item.album).toBe('The Wall')
  })

  test('Misspelled artist: "nirvanna teen spirit"', () => {
    const result = fuse.search('nirvanna teen spirit')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Smells Like Teen Spirit')
  })

  test('Mixed artist and album: "beatles help"', () => {
    const result = fuse.search('beatles help')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // Yesterday is on Help! by The Beatles
    expect(result[0].item.artist).toBe('The Beatles')
  })

  test('Vague query: "rolling stone"', () => {
    const result = fuse.search('rolling stone')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Like a Rolling Stone')
  })
})
