import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, Database, Save, RefreshCw, Trash2, DollarSign, Coffee } from 'lucide-react';
import AdminTab from './components/AdminTab';
import ReceiptTable from './components/ReceiptTable';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('calc');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [localValorUR, setLocalValorUR] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPassError, setAdminPassError] = useState(false);

  // States for Calculator
  const [agrupamiento, setAgrupamiento] = useState('');
  const [nivel, setNivel] = useState('');
  const [grado, setGrado] = useState('');
  const [tramo, setTramo] = useState(''); // '' | 'Intermedio' | 'Avanzado'
  const [jefatura, setJefatura] = useState(''); // '' | 'I' | 'II' | 'III' | 'IV'
  const [capacitacionSel, setCapacitacionSel] = useState(''); // '' | 'terciaria' | 'universitaria'
  
  const [isZonaManualPct, setIsZonaManualPct] = useState(true);
  const [zonaPct, setZonaPct] = useState(20);
  const [zonaMontoFijo, setZonaMontoFijo] = useState(99546.85);

  const [tieneFormacion, setTieneFormacion] = useState(true);
  const [tieneComplemento, setTieneComplemento] = useState(false);
  const [movilidad, setMovilidad] = useState("22138.00");
  const [seguroVidaOblig, setSeguroVidaOblig] = useState("3.8");
  const [seguroVidaSep, setSeguroVidaSep] = useState("2735");
  
  const [customConcepts, setCustomConcepts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/data`);
      // Parse data into easy lookup objects
      const db = {
        config: {},
        asig: {},
        grados: {},
        tramos: {},
        jefaturas: {},
        capacitacion: {},
        complemento: {}
      };
      
      res.data.configuracion.forEach(c => db.config[c.key] = c.value);
      res.data.asignacion_basica.forEach(c => db.asig[c.nivel] = c);
      res.data.grados.forEach(c => db.grados[c.nivel] = c);
      res.data.tramos.forEach(c => db.tramos[c.nombre] = c.porcentaje);
      res.data.jefaturas.forEach(c => db.jefaturas[c.nivel] = c);
      if(res.data.capacitacion) res.data.capacitacion.forEach(c => db.capacitacion[c.nivel] = c);
      if(res.data.complemento) res.data.complemento.forEach(c => db.complemento[c.nivel] = c);

      setData(db);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("No se pudo conectar con la base de datos local. ¿Está el backend corriendo?");
    }
  };

  const handleUpdate = async (table, keyField, key, field, value) => {
    try {
      await axios.post(`${API_URL}/update`, {
        table, keyField, key, field, value: parseFloat(value)
      });
      fetchData(); // Reload all data
    } catch (err) {
      alert("Error al actualizar la base de datos.");
    }
  };

  const addCustomConcept = () => {
    setCustomConcepts([...customConcepts, {
      id: Date.now(),
      name: '',
      type: 'haber_rem', 
      amount: ''
    }]);
  };

  const updateCustomConcept = (index, field, value) => {
    const newConcepts = [...customConcepts];
    if (field === 'amount') value = value.replace(',', '.');
    newConcepts[index][field] = value;
    setCustomConcepts(newConcepts);
  };

  const removeCustomConcept = (index) => {
    setCustomConcepts(customConcepts.filter((_, i) => i !== index));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAdminLoginClick = () => {
    setShowAdminModal(true);
    setAdminPassInput('');
    setAdminPassError(false);
  };

  const handleAdminSubmit = () => {
    if (adminPassInput === 'aegis') {
      setIsAdmin(true);
      setShowAdminModal(false);
    } else {
      setAdminPassError(true);
    }
  };

  const renderCalculatorTab = () => {
    if (!data) return null;
    const valorUR = localValorUR;

    // Calcular
    let urSueldo = 0;
    let urDedicacion = 0;
    let urGrado = 0;
    let urTramo = 0;
    let urJefatura = 0;
    let urFormacion = 0;
    let urCapacitacion = 0;
    let urComplemento = 0;

    if (nivel && data.asig[nivel]) {
      urSueldo = data.asig[nivel].sueldo;
      urDedicacion = data.asig[nivel].dedicacion;
      if (tieneFormacion) {
        urFormacion = (urSueldo + urDedicacion) * 0.075;
      }
      if (capacitacionSel && data.capacitacion && data.capacitacion[nivel]) {
        urCapacitacion = data.capacitacion[nivel][capacitacionSel] || 0;
      }
      if (tieneComplemento && data.complemento && data.complemento[nivel]) {
        urComplemento = data.complemento[nivel].ur || 0;
      }
    }

    if (nivel && grado > 0 && data.grados[nivel]) {
      urGrado = data.grados[nivel][`g${grado}`] || 0;
    }

    if (tramo && data.tramos[tramo]) {
      const pct = data.tramos[tramo];
      // El tramo es sobre la asignacion basica de su nivel
      urTramo = (urSueldo + urDedicacion) * (pct / 100);
    }

    if (jefatura && data.jefaturas[jefatura]) {
      urJefatura = data.jefaturas[jefatura].ur;
    }

    const parsedUR = parseFloat(valorUR) || 0;
    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    const pSueldo = round2(urSueldo * parsedUR);
    const pDedicacion = round2(urDedicacion * parsedUR);
    const pGrado = round2(urGrado * parsedUR);
    const pTramo = round2(urTramo * parsedUR);
    const pJefatura = round2(urJefatura * parsedUR);
    const pFormacion = round2(urFormacion * parsedUR);
    const pCapacitacion = round2(urCapacitacion * parsedUR);
    const pComplemento = round2(urComplemento * parsedUR);

    // Zona es sobre la asignación base (Sueldo + dedicación)
    const pAsigBasica = pSueldo + pDedicacion;
    
    let pZona = 0;
    let displayZonaPct = 0;
    
    if (isZonaManualPct) {
      pZona = round2(pAsigBasica * ((parseFloat(zonaPct) || 0) / 100));
      displayZonaPct = parseFloat(zonaPct) || 0;
    } else {
      pZona = round2(parseFloat(zonaMontoFijo) || 0);
      if (pAsigBasica > 0) {
        displayZonaPct = (pZona / pAsigBasica) * 100;
      }
    }

    let customRem = 0;
    let customNoRem = 0;
    let customDesc = 0;

    customConcepts.forEach(c => {
      const val = round2(parseFloat(c.amount) || 0);
      if (c.type === 'haber_rem') customRem += val;
      if (c.type === 'haber_norem') customNoRem += val;
      if (c.type === 'descuento') customDesc += val;
    });

    const totalRem = round2(pSueldo + pDedicacion + pGrado + pTramo + pJefatura + pFormacion + pCapacitacion + pComplemento + pZona + customRem);
    const totalNoRem = round2((parseFloat(movilidad) || 0) + customNoRem);
    const subtotalBruto = round2(totalRem + totalNoRem);

    const jubilacion = round2(totalRem * 0.11);
    const osfa = round2(totalRem * 0.06);
    const valSeguroVidaOblig = round2(parseFloat(seguroVidaOblig) || 0);
    const valSeguroVidaSep = round2(parseFloat(seguroVidaSep) || 0);
    const totalDescuentos = round2(jubilacion + osfa + valSeguroVidaOblig + valSeguroVidaSep + customDesc);

    const neto = round2(subtotalBruto - totalDescuentos);

    return (
      <>
        <div className="card">
          <h2 className="section-title">Parámetros</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Valor U.R.</label>
              <input 
                type="text" inputMode="decimal"
                value={valorUR} 
                onChange={e => setLocalValorUR(e.target.value.replace(',', '.'))} 
                placeholder={`Ej: ${data.config?.valorUR || 366.92}`}
              />
            </div>
            <div className="form-group">
              <label>Agrupamiento</label>
              <select value={agrupamiento} onChange={e => setAgrupamiento(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                <option value="Profesional">Profesional</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Tecnico">Técnico</option>
                <option value="Produccion">Producción</option>
                <option value="Mantenimiento">Mantenimiento y Servicios</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nivel Escalafonario</label>
              <select value={nivel} onChange={e => {setNivel(e.target.value); setGrado('');}}>
                <option value="">-- Nivel --</option>
                <option value="1">I</option>
                <option value="2">II</option>
                <option value="3">III</option>
                <option value="4">IV</option>
                <option value="5">V</option>
                <option value="6">VI</option>
                <option value="7">VII</option>
                <option value="8">VIII</option>
              </select>
            </div>
            <div className="form-group">
              <label>Grado</label>
              <select value={grado} onChange={e => setGrado(e.target.value)} disabled={!nivel}>
                <option value="">-- Grado --</option>
                {[...Array(11).keys()].map(i => (
                  <option key={i} value={i}>{i === 0 ? '0 (Inicial)' : i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tramo de Promoción</label>
              <select value={tramo} onChange={e => setTramo(e.target.value)}>
                <option value="">Ninguno</option>
                <option value="Intermedio">Intermedio (15%)</option>
                <option value="Avanzado">Avanzado (30%)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Suplemento Jefatura</label>
              <select value={jefatura} onChange={e => setJefatura(e.target.value)}>
                <option value="">Ninguno</option>
                <option value="I">I - Departamento</option>
                <option value="II">II - División</option>
                <option value="III">III - Sección</option>
                <option value="IV">IV - Supervisión</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group" style={{maxWidth: '50%'}}>
              <label>Capacitación</label>
              <select value={capacitacionSel} onChange={e => setCapacitacionSel(e.target.value)} disabled={!nivel}>
                <option value="">-- Ninguna --</option>
                <option value="terciaria">Terciaria</option>
                <option value="universitaria">Universitaria</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Otros Suplementos y Descuentos</h2>
          <div className="form-row">
            <div className="form-group" style={{flex: '0 0 auto', marginRight: '1rem'}}>
              <label>Formación Funcional (7.5%)</label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, minHeight: '44px'}}>
                <input 
                  type="checkbox" 
                  checked={tieneFormacion} 
                  onChange={() => setTieneFormacion(!tieneFormacion)}
                  style={{width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)', cursor: 'pointer'}}
                />
                Incluir Compensación
              </label>
            </div>
            <div className="form-group" style={{flex: '0 0 auto', marginRight: '1rem'}}>
              <label>Comp. Transitorio (U.R.)</label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, minHeight: '44px'}}>
                <input 
                  type="checkbox" 
                  checked={tieneComplemento} 
                  onChange={() => setTieneComplemento(!tieneComplemento)}
                  style={{width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)', cursor: 'pointer'}}
                />
                Incluir Comp.
              </label>
            </div>
            <div className="form-group" style={{flex: '1'}}>
              <label>Suplemento Zona (%)</label>
              <input 
                type="text" inputMode="decimal"
                value={displayZonaPct > 0 && !isZonaManualPct ? displayZonaPct.toFixed(2) : zonaPct} 
                onChange={e => {
                  setIsZonaManualPct(true);
                  setZonaPct(e.target.value.replace(',', '.'));
                }} 
              />
            </div>
            <div className="form-group" style={{flex: '1'}}>
              <label>Suplemento Zona ($)</label>
              <input 
                type="text" inputMode="decimal"
                value={isZonaManualPct ? (pZona > 0 ? pZona.toFixed(2) : '') : zonaMontoFijo} 
                onChange={e => {
                  setIsZonaManualPct(false);
                  setZonaMontoFijo(e.target.value.replace(',', '.'));
                }} 
                placeholder="Monto en pesos"
              />
            </div>
            <div className="form-group">
              <label>Movilidad Fija ($)</label>
              <input type="text" inputMode="decimal" value={movilidad} onChange={e => setMovilidad(e.target.value.replace(',', '.'))} />
            </div>
            <div className="form-group">
              <label>Seg. Vida Oblig. ($)</label>
              <input type="text" inputMode="decimal" value={seguroVidaOblig} onChange={e => setSeguroVidaOblig(e.target.value.replace(',', '.'))} />
            </div>
            <div className="form-group">
              <label>Seg. Vida Sep. ($)</label>
              <input type="text" inputMode="decimal" value={seguroVidaSep} onChange={e => setSeguroVidaSep(e.target.value.replace(',', '.'))} />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Conceptos Personalizados</h2>
          <p className="subtitle" style={{marginBottom: '1rem', fontSize: '0.9rem'}}>Agrega otros bonos, suplementos o descuentos que no estén en la lista oficial.</p>
          
          {customConcepts.map((c, i) => (
            <div key={c.id} className="form-row" style={{alignItems: 'center'}}>
              <div className="form-group" style={{flex: '2'}}>
                <input type="text" placeholder="Nombre del concepto" value={c.name} onChange={e => updateCustomConcept(i, 'name', e.target.value)} />
              </div>
              <div className="form-group" style={{flex: '1'}}>
                <input type="text" inputMode="decimal" placeholder="$ Monto" value={c.amount} onChange={e => updateCustomConcept(i, 'amount', e.target.value)} />
              </div>
              <div className="form-group" style={{flex: '2'}}>
                <select value={c.type} onChange={e => updateCustomConcept(i, 'type', e.target.value)}>
                  <option value="haber_rem">Haber Remunerativo</option>
                  <option value="haber_norem">Haber NO Remunerativo</option>
                  <option value="descuento">Descuento</option>
                </select>
              </div>
              <div className="form-group" style={{flex: '0 0 auto', marginTop: '0'}}>
                <button className="btn btn-danger" onClick={() => removeCustomConcept(i)} style={{padding: '0.75rem'}}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button className="btn" onClick={addCustomConcept} style={{marginTop: '0.5rem', background: 'var(--success)'}}>
            + Añadir Concepto
          </button>
        </div>

        <ReceiptTable 
          pSueldo={pSueldo} pGrado={pGrado} pDedicacion={pDedicacion} pTramo={pTramo} 
          pJefatura={pJefatura} pFormacion={pFormacion} pCapacitacion={pCapacitacion} 
          pComplemento={pComplemento} pZona={pZona} movilidad={movilidad} customConcepts={customConcepts} 
          subtotalBruto={subtotalBruto} totalDescuentos={totalDescuentos} 
          neto={neto} osfa={osfa} valSeguroVidaOblig={valSeguroVidaOblig} 
          valSeguroVidaSep={valSeguroVidaSep} jubilacion={jubilacion} 
        />
      </>
    );
  };

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <h1 style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <div style={{position: 'relative', display: 'flex', width: '48px', height: '48px'}}>
              <Calculator size={48} style={{color: 'var(--primary)'}} />
              <div style={{
                position: 'absolute', 
                bottom: -2, 
                right: -6, 
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--success)', 
                color: 'white', 
                borderRadius: '50%', 
                border: '3px solid var(--bg-color)'
              }}>
                <DollarSign size={16} strokeWidth={3} />
              </div>
            </div>
            Simulador de Haberes
          </h1>
          <p className="subtitle">Herramienta para estimar la liquidación del personal civil de las Fuerzas Armadas.</p>
        </div>
        <button 
          className="btn" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{background: 'var(--secondary)', color: 'var(--text-dark)', border: '1px solid var(--input-border)'}}
        >
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => handleTabChange('calc')}
        >
          <Calculator size={18} /> Calculadora
        </button>
        <button 
          className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => handleTabChange('admin')}
        >
          <Database size={18} /> Configuración (Admin)
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem'}}>
          <div className="loader"></div>
          <p style={{marginTop: '1rem'}}>Conectando...</p>
        </div>
      ) : (
        <main>
          {activeTab === 'calc' ? renderCalculatorTab() : (
            <AdminTab 
              data={data} 
              isAdmin={isAdmin} 
              handleAdminLoginClick={handleAdminLoginClick} 
              handleUpdate={handleUpdate} 
            />
          )}
        </main>
      )}

      <footer style={{
        marginTop: '3rem',
        padding: '2rem 1rem',
        borderTop: '1px solid #e2e8f0',
        color: 'var(--text-light)',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <div style={{marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>
          Portus Solutions © {new Date().getFullYear()}
        </div>
        <p style={{margin: '0.25rem 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'}}>
          Esta herramienta ha sido desarrollada con fines estimativos y de simulación. 
          Los montos finales pueden variar según liquidaciones oficiales u otros descuentos particulares no contemplados.
        </p>
        <div style={{marginTop: '1rem'}}>
          Contacto, sugerencias o reporte de errores: <a href="mailto:portus.solutions@gmail.com" style={{color: 'var(--primary)', textDecoration: 'none'}}>portus.solutions@gmail.com</a>
        </div>
        <div style={{marginTop: '1.5rem'}}>
          <a href="https://cafecito.app/portussolutions" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
            background: '#1E90FF', color: 'white', padding: '0.5rem 1.25rem', 
            borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(30, 144, 255, 0.2)', transition: 'transform 0.2s'
          }}>
            <Coffee size={16} color="white" strokeWidth={3} /> Invitame un Cafecito
          </a>
        </div>
      </footer>

      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{marginTop: 0}}>Desbloquear Edición</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem'}}>
              Ingrese la contraseña de administrador.
            </p>
            {adminPassError && (
              <div style={{
                color: 'var(--danger)', 
                fontSize: '0.9rem', 
                marginBottom: '1rem', 
                padding: '0.5rem', 
                background: '#fef2f2', 
                border: '1px solid #f87171', 
                borderRadius: '6px', 
                textAlign: 'center'
              }}>
                Contraseña incorrecta. Intente nuevamente.
              </div>
            )}
            <input 
              type="password" 
              style={{width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none'}}
              value={adminPassInput}
              onChange={e => { setAdminPassInput(e.target.value); setAdminPassError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleAdminSubmit()}
              autoFocus
            />
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
              <button className="btn" style={{background: 'var(--secondary)', color: 'var(--text-dark)'}} onClick={() => setShowAdminModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdminSubmit}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
