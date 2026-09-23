import { useState, useEffect } from 'react';
import { getAllMonths } from '../services/firebaseService';

export default function Historial({ onSelectMonth }) {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonths();
  }, []);

  const loadMonths = async () => {
    setLoading(true);
    try {
      const monthsData = await getAllMonths();
      setMonths(monthsData);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Cargando historial...</div>;
  }

  return (
    <div className="historial">
      <h2>📅 HISTORIAL DE MESES</h2>

      {months.length === 0 ? (
        <p className="no-data">No hay meses registrados</p>
      ) : (
        <div className="months-list">
          {months.map((month) => {
            const monthDate = new Date(`${month.yearMonth}-01`);
            const monthName = monthDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
            const isCurrentMonth = month.yearMonth === new Date().toISOString().substring(0, 7);

            return (
              <div key={month.yearMonth} className={`month-card ${isCurrentMonth ? 'current' : ''}`}>
                <div className="month-info">
                  <h3>{monthName.toUpperCase()} {isCurrentMonth && '(actual)'}</h3>
                  <p className="total">Total: <strong>${month.totalGastado.toLocaleString('es-AR')}</strong></p>
                  <p className="debt">
                    {month.whoOwes === 'Nadie' 
                      ? '✓ Saldado' 
                      : `${month.whoOwes} debe: $${Math.abs(month.netDebt).toLocaleString('es-AR')}`}
                  </p>
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onSelectMonth(month.yearMonth)}
                >
                  VER →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
