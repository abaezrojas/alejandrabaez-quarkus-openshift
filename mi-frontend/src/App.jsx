import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [greeting, setGreeting] = useState(null)
  const [sucursales, setSucursales] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar que la configuración está disponible
    if (!window.API_CONFIG) {
      setError('Configuración de API no disponible')
      return
    }
  }, [])

  const fetchGreeting = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/../hello`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const text = await response.text()
      setGreeting(text)
    } catch (err) {
      setError(`Error al obtener saludo: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchSucursales = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/middleware/sucursales?buscar=Microcentro`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setSucursales(data)
    } catch (err) {
      setError(`Error al obtener sucursales: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Quarkus OpenShift Frontend</h1>
          <p>API URL: <code>{window.API_CONFIG?.apiUrl || 'No configurada'}</code></p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button type="button" onClick={fetchGreeting} disabled={loading}>
            {loading ? 'Cargando...' : 'Obtener Saludo'}
          </button>
          {greeting && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
              <strong>Saludo:</strong> {greeting}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button type="button" onClick={fetchSucursales} disabled={loading}>
            {loading ? 'Cargando...' : 'Obtener Sucursales'}
          </button>
          {sucursales && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
              <strong>Sucursales:</strong>
              <pre>{JSON.stringify(sucursales, null, 2)}</pre>
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
