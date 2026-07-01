import React from 'react';
import { Database } from 'lucide-react';

export default function AdminTab({ data, isAdmin, handleAdminLoginClick, handleUpdate }) {
  if (!data) return null;

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h2 className="section-title" style={{margin: 0}}><Database size={20} /> Administración de Tablas Base</h2>
        {!isAdmin ? (
          <button className="btn btn-primary" onClick={handleAdminLoginClick}>Desbloquear Edición</button>
        ) : (
          <span style={{color: 'var(--success)', fontWeight: 'bold'}}>Modo Edición Activado</span>
        )}
      </div>
      <p className="subtitle" style={{marginBottom: '1rem'}}>
        Las modificaciones aquí se guardarán en la base de datos y afectarán la calculadora.
      </p>

      <h3>1. Asignación Básica (Sueldo / Dedicación)</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Sueldo</th>
              <th>Dedicación Func.</th>
              <th>Asignación Básica</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data.asig).map(row => (
              <tr key={row.nivel}>
                <td><strong>{row.nivel}</strong></td>
                <td>
                  <input type="number" defaultValue={row.sueldo} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('asignacion_basica', 'nivel', row.nivel, 'sueldo', e.target.value)} />
                </td>
                <td>
                  <input type="number" defaultValue={row.dedicacion} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('asignacion_basica', 'nivel', row.nivel, 'dedicacion', e.target.value)} />
                </td>
                <td style={{fontWeight: 'bold'}}>
                  {(row.sueldo + row.dedicacion).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>2. Grados</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>G1</th><th>G2</th><th>G3</th><th>G4</th><th>G5</th><th>G6</th><th>G7</th><th>G8</th><th>G9</th><th>G10</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data.grados).map(row => (
              <tr key={row.nivel}>
                <td><strong>{row.nivel}</strong></td>
                {[1,2,3,4,5,6,7,8,9,10].map(g => (
                  <td key={g}>
                    <input type="number" defaultValue={row[`g${g}`]} style={{width: '60px'}} disabled={!isAdmin}
                           onBlur={(e) => handleUpdate('grados', 'nivel', row.nivel, `g${g}`, e.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>3. Jefaturas</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Descripción</th>
              <th>U.R.</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data.jefaturas)
              .sort((a,b) => {
                const val = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
                return (val[a.nivel] || 99) - (val[b.nivel] || 99);
              })
              .map(row => (
              <tr key={row.nivel}>
                <td><strong>{row.nivel}</strong></td>
                <td>{row.descripcion}</td>
                <td>
                  <input type="number" defaultValue={row.ur} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('jefaturas', 'nivel', row.nivel, 'ur', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <h3>4. Capacitación</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Terciaria (U.R.)</th>
              <th>Universitaria (U.R.)</th>
            </tr>
          </thead>
          <tbody>
            {data.capacitacion && Object.values(data.capacitacion)
              .sort((a,b) => parseInt(a.nivel) - parseInt(b.nivel))
              .map(row => (
              <tr key={row.nivel}>
                <td><strong>{row.nivel}</strong></td>
                <td>
                  <input type="number" defaultValue={row.terciaria} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('capacitacion', 'nivel', row.nivel, 'terciaria', e.target.value)} />
                </td>
                <td>
                  <input type="number" defaultValue={row.universitaria} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('capacitacion', 'nivel', row.nivel, 'universitaria', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>5. Complemento Transitorio</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Valor (U.R.)</th>
            </tr>
          </thead>
          <tbody>
            {data.complemento && Object.values(data.complemento)
              .sort((a,b) => parseInt(a.nivel) - parseInt(b.nivel))
              .map(row => (
              <tr key={row.nivel}>
                <td><strong>{row.nivel}</strong></td>
                <td>
                  <input type="number" defaultValue={row.ur} disabled={!isAdmin}
                         onBlur={(e) => handleUpdate('complemento', 'nivel', row.nivel, 'ur', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
