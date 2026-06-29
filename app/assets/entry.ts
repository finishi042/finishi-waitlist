import { run } from 'remix/ui'

let app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    return mod[exportName]
  },
  async resolveFrame(src, signal) {
    let response = await fetch(src, {
      headers: { accept: 'text/html' },
      signal,
    })
    return response.body ?? (await response.text())
  },
})

app.addEventListener('error', (_event) => {})
