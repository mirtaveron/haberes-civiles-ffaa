import React from 'react';

export default function ReceiptTable({ 
  pSueldo, pGrado, pDedicacion, pTramo, pJefatura, pFormacion, pCapacitacion, pComplemento, pZona, 
  movilidad, customConcepts, subtotalBruto, totalDescuentos, neto, osfa, 
  valSeguroVidaOblig, valSeguroVidaSep, jubilacion 
}) {
  return (
    <>
      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
          <h2 className="section-title" style={{margin: 0, border: 'none'}}>Recibo de Haberes Simulado</h2>
        </div>
        <div className="table-container" style={{margin: 0, border: 'none', borderRadius: 0}}>
          <table>
            <thead>
              <tr>
                <th>Cod</th>
                <th>Concepto</th>
                <th style={{textAlign: 'right'}}>Haberes ($)</th>
                <th style={{textAlign: 'right'}}>Descuentos ($)</th>
              </tr>
            </thead>
            <tbody>
              {pSueldo > 0 && <tr><td>201</td><td>SUELDO</td><td style={{textAlign: 'right'}}>{pSueldo.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pGrado > 0 && <tr><td>221</td><td>ADICIONAL GRADO</td><td style={{textAlign: 'right'}}>{pGrado.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pDedicacion > 0 && <tr><td>260</td><td>DEDICACIÓN FUNCIONAL</td><td style={{textAlign: 'right'}}>{pDedicacion.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pTramo > 0 && <tr><td>265</td><td>SUPLEMENTO TRAMO</td><td style={{textAlign: 'right'}}>{pTramo.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pJefatura > 0 && <tr><td>267</td><td>SUPLEMENTO JEFATURA</td><td style={{textAlign: 'right'}}>{pJefatura.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pFormacion > 0 && <tr><td>270</td><td>FORMACIÓN FUNCIONAL</td><td style={{textAlign: 'right'}}>{pFormacion.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pCapacitacion > 0 && <tr><td>271</td><td>CAPACITACIÓN</td><td style={{textAlign: 'right'}}>{pCapacitacion.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pComplemento > 0 && <tr><td>-</td><td>COMP. TRANS. FUNCIONALIDAD</td><td style={{textAlign: 'right'}}>{pComplemento.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {pZona > 0 && <tr><td>262</td><td>SUPLEMENTO ZONA</td><td style={{textAlign: 'right'}}>{pZona.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              {(parseFloat(movilidad) || 0) > 0 && <tr><td>249</td><td>GASTOS DE MOVILIDAD</td><td style={{textAlign: 'right'}}>{(parseFloat(movilidad) || 0).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>}
              
              {customConcepts.filter(c => c.type === 'haber_rem' && (parseFloat(c.amount) || 0) > 0).map(c => (
                <tr key={c.id}><td>-</td><td>{c.name.toUpperCase() || 'NUEVO CONCEPTO'} (Rem)</td><td style={{textAlign: 'right'}}>{(parseFloat(c.amount) || 0).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>
              ))}
              {customConcepts.filter(c => c.type === 'haber_norem' && (parseFloat(c.amount) || 0) > 0).map(c => (
                <tr key={c.id}><td>-</td><td>{c.name.toUpperCase() || 'NUEVO CONCEPTO'} (No Rem)</td><td style={{textAlign: 'right'}}>{(parseFloat(c.amount) || 0).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td><td></td></tr>
              ))}

              {osfa > 0 && <tr><td>306</td><td>CUOTA OSFA (6%)</td><td></td><td style={{textAlign: 'right'}}>{osfa.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>}
              {valSeguroVidaOblig > 0 && <tr><td>307</td><td>SEGURO VIDA OBLIGATORIO</td><td></td><td style={{textAlign: 'right'}}>{valSeguroVidaOblig.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>}
              {valSeguroVidaSep > 0 && <tr><td>379</td><td>SEGURO VIDA SEPELIO</td><td></td><td style={{textAlign: 'right'}}>{valSeguroVidaSep.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>}
              {jubilacion > 0 && <tr><td>900</td><td>APORTE JUBILATORIO (11%)</td><td></td><td style={{textAlign: 'right'}}>{jubilacion.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>}
              
              {customConcepts.filter(c => c.type === 'descuento' && (parseFloat(c.amount) || 0) > 0).map(c => (
                <tr key={c.id}><td>-</td><td>{c.name.toUpperCase() || 'NUEVO CONCEPTO'}</td><td></td><td style={{textAlign: 'right'}}>{(parseFloat(c.amount) || 0).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background: '#f1f5f9', fontWeight: 'bold'}}>
                <td colSpan="2" style={{textAlign: 'right'}}>TOTALES</td>
                <td style={{textAlign: 'right', color: 'var(--success)'}}>${subtotalBruto.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td style={{textAlign: 'right', color: 'var(--danger)'}}>${totalDescuentos.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="total-box">
        <h3>Sueldo Neto</h3>
        <span className="amount">${neto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
      </div>
    </>
  );
}
