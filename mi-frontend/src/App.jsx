import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function CentrosComponent() {
  const [centros, setCentros] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const fetchCentros = async () => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/middleware/sucursales?buscar=Microcentro`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      // La API devuelve {ubicaciones: [...]} o directamente un array
      setCentros(data.ubicaciones || data)
    } catch (err) {
      setError(`Error al obtener centros: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const guardarEnFavoritos = async (centro) => {
    try {
      const favorito = {
        tipo: 'CENTRO',
        referenciaId: `${centro.nombre}-${centro.tipo}`,
        descripcion: `${centro.nombre} (${centro.ciudad})`
      }
      const response = await fetch(`${window.API_CONFIG.apiUrl}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorito)
      })
      
      if (response.status === 201) {
        setSuccessMsg(`"${centro.nombre}" agregado a favoritos`)
        setTimeout(() => setSuccessMsg(null), 3000)
      } else if (response.status === 409) {
        setError('Este centro ya está en favoritos')
      } else {
        setError(`Error al guardar: HTTP ${response.status}`)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    }
  }

  return (
    <div>
      <button onClick={fetchCentros} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Centros'}
      </button>
      
      {successMsg && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ccffcc', color: 'green' }}>
          ✓ {successMsg}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
          ✗ {error}
        </div>
      )}
      
      {centros && (
        <div style={{ marginTop: '15px' }}>
          <h3>Centros de Servicio</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Dirección</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(centros) && centros.map((centro, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{centro.nombre}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{centro.direccion}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <button onClick={() => guardarEnFavoritos(centro)} style={{ padding: '5px 10px', fontSize: '12px' }}>
                      ⭐ Favorito
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SIPAPComponent() {
  const [sipap, setSipap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const fetchSipap = async () => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/middleware/sipap`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      // La API devuelve {parametrosSipap: [...]} o directamente un array
      setSipap(data.parametrosSipap || data)
    } catch (err) {
      setError(`Error al obtener SIPAP: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const guardarEnFavoritos = async (param) => {
    try {
      const favorito = {
        tipo: 'SIPAP',
        referenciaId: param.codigo || param.id || param.descripcion,
        descripcion: param.descripcion || param.nombre || param.valor
      }
      const response = await fetch(`${window.API_CONFIG.apiUrl}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorito)
      })
      
      if (response.status === 201) {
        setSuccessMsg(`"${param.descripcion || param.nombre}" agregado a favoritos`)
        setTimeout(() => setSuccessMsg(null), 3000)
      } else if (response.status === 409) {
        setError('Este parámetro ya está en favoritos')
      } else {
        setError(`Error al guardar: HTTP ${response.status}`)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    }
  }

  return (
    <div>
      <button onClick={fetchSipap} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Parámetros SIPAP'}
      </button>
      
      {successMsg && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ccffcc', color: 'green' }}>
          ✓ {successMsg}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
          ✗ {error}
        </div>
      )}
      
      {sipap && (
        <div style={{ marginTop: '15px' }}>
          <h3>Parámetros SIPAP</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Valor</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const params = Array.isArray(sipap) ? sipap : (sipap?.parametrosSipap || []);
                return params.map((param, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{param.descripcion}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{param.valor}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <button onClick={() => guardarEnFavoritos(param)} style={{ padding: '5px 10px', fontSize: '12px' }}>
                        ⭐ Favorito
                      </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FavoritosComponent() {
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarFavoritos()
  }, [])

  const cargarFavoritos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/favoritos`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setFavoritos(data)
    } catch (err) {
      setError(`Error al cargar favoritos: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const eliminarFavorito = async (id) => {
    try {
      const response = await fetch(`${window.API_CONFIG.apiUrl}/favoritos/${id}`, {
        method: 'DELETE'
      })
      if (response.status === 204) {
        setFavoritos(favoritos.filter(f => f.id !== id))
      } else {
        setError(`Error al eliminar: HTTP ${response.status}`)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    }
  }

  return (
    <div>
      <button onClick={cargarFavoritos} disabled={loading}>
        {loading ? 'Cargando...' : 'Actualizar Favoritos'}
      </button>
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
          ✗ {error}
        </div>
      )}
      
      {favoritos.length > 0 ? (
        <div style={{ marginTop: '15px' }}>
          <h3>Mis Favoritos ({favoritos.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Fecha Registro</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {favoritos.map((fav, idx) => (
                <tr key={fav.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <span style={{ backgroundColor: fav.tipo === 'CENTRO' ? '#e3f2fd' : '#f3e5f5', padding: '3px 8px', borderRadius: '3px' }}>
                      {fav.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{fav.descripcion}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {(() => {
                      try {
                        let fecha;
                        if (Array.isArray(fav.fechaRegistro)) {
                          // Si es array [year, month, day, hour, minute, second, ...]
                          const [year, month, day, hour, minute, second] = fav.fechaRegistro;
                          fecha = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
                        } else if (typeof fav.fechaRegistro === 'string') {
                          fecha = new Date(fav.fechaRegistro);
                        } else {
                          return 'Fecha no disponible';
                        }
                        return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                      } catch (e) {
                        return 'Error en fecha';
                      }
                    })()}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <button onClick={() => eliminarFavorito(fav.id)} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#ffcccc', color: 'red' }}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
          <p>No tienes favoritos aún. ¡Agrega algunos!</p>
        </div>
      )}
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('centros')
  const [greeting, setGreeting] = useState(null)
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

        {error && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ marginTop: '30px', borderBottom: '2px solid #ddd' }}>
          <h2>Gestión de Favoritos</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('centros')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'centros' ? '#007bff' : '#e9ecef',
                color: activeTab === 'centros' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🏢 Centros
            </button>
            <button 
              onClick={() => setActiveTab('sipap')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'sipap' ? '#007bff' : '#e9ecef',
                color: activeTab === 'sipap' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 SIPAP
            </button>
            <button 
              onClick={() => setActiveTab('favoritos')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'favoritos' ? '#007bff' : '#e9ecef',
                color: activeTab === 'favoritos' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ⭐ Mis Favoritos
            </button>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            {activeTab === 'centros' && <CentrosComponent />}
            {activeTab === 'sipap' && <SIPAPComponent />}
            {activeTab === 'favoritos' && <FavoritosComponent />}
          </div>
        </div>
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
