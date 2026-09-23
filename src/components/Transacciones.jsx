import { useState } from 'react';

export default function Transacciones({ currentMonth, gastos, onEdit, onDelete, onChangeMonth }) {
  const [filterPerson, setFilterPerson] = useState('Todas');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(gastos.map(g => g.category))];
  const people = ['Todas', 'Matías', 'Rocío'];

  const filteredGastos = gastos.filter((gasto) => {
    const matchPerson = filterPerson === 'Todas' || gasto.person === filterPerson;
    const matchCategory = filterCategory === 'Todas' || gasto.category === filterCategory;
    return matchPerson && matchCategory;
  });

  const calculateDebt = (gasto) => {
    return gasto.amount / 2;
  };

  const monthName = new Date(`${currentMonth}-01`).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return (
    <div className="transacciones">
      <div className="month-header">
        <button onClick={() => onChangeMonth(-1)}>← Anterior</button>
        <h2>{monthName.toUpperCase()} - TRANSACCIONES</h2>
        <button onClick={() => onChangeMonth(1)}>Siguiente →</button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Filtrar por persona:</label>
          <select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}>
            {people.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filtrar por categoría:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredGastos.length === 0 ? (
        <p className="no-data">No hay gastos que coincidan con los filtros</p>
      ) : (
        <div className="transactions-list">
          {filteredGastos.map((gasto) => (
            <div key={gasto.id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-date-category">
                  <span className="category">{gasto.category}</span>
                  <span className="date">{new Date(gasto.date).toLocaleDateString('es-AR')}</span>
                </div>
                <div className="transaction-details">
                  <p className="who-paid">
                    {gasto.person} pagó: <strong>${gasto.amount.toLocaleString('es-AR')}</strong>
                  </p>
                  <p className="debt">
                    ↳ {gasto.person === 'Matías' ? 'Rocío' : 'Matías'} debe: ${calculateDebt(gasto).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              <div className="transaction-actions">
                <button className="btn-edit" onClick={() => onEdit(gasto)} title="Editar">
                  ✎
                </button>
                <button className="btn-delete" onClick={() => onDelete(gasto.id)} title="Borrar">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
