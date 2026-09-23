import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ResumenMes({ currentMonth, gastos, debts, debtPaid, onMarkDebtAsPaid, onCloseMonth, onChangeMonth }) {
  if (!debts) {
    return <div className="loading">Cargando datos...</div>;
  }

  const categoryData = {};
  gastos.forEach((gasto) => {
    if (!categoryData[gasto.category]) {
      categoryData[gasto.category] = 0;
    }
    categoryData[gasto.category] += gasto.amount;
  });

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const monthName = new Date(`${currentMonth}-01`).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return (
    <div className="resumen-mes">
      <div className="month-header">
        <button onClick={() => onChangeMonth(-1)}>← Anterior</button>
        <h2>{monthName.toUpperCase()}</h2>
        <button onClick={() => onChangeMonth(1)}>Siguiente →</button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <p className="card-label">GASTOS TOTALES</p>
          <p className="card-value">${debts.totalGastado.toLocaleString('es-AR')}</p>
        </div>
        <div className="card">
          <p className="card-label">TU GASTO</p>
          <p className="card-value">${debts.matiasGastado.toLocaleString('es-AR')}</p>
        </div>
        <div className="card">
          <p className="card-label">GASTO DE ROCÍO</p>
          <p className="card-value">${debts.rocioGastado.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="chart-section">
          <h3>📊 DESGLOSE POR CATEGORÍA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFD966" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="debts-section">
        <h3>💰 DEUDAS PENDIENTES</h3>
        {!debtPaid ? (
          <div className="debts-card">
            <p>Rocio le debe a Matias: <strong>${debts.rocioOwes.toLocaleString('es-AR')}</strong></p>
            <p>Matias le debe a Rocio: <strong>${debts.matiasOwes.toLocaleString('es-AR')}</strong></p>
            <p className="net-debt">
              DEUDA NETA: {debts.whoOwes === 'Rocío' ? '✓' : ''} {debts.whoOwes} debe ${debts.netDebtAbs.toLocaleString('es-AR')}
            </p>
          </div>
        ) : (
          <div className="debts-card paid">
            <p>✓ DEUDA SALDADA</p>
            <p>${debts.netDebtAbs.toLocaleString('es-AR')} pagado</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        {!debtPaid ? (
          <button className="btn btn-secondary" onClick={onMarkDebtAsPaid}>
            💳 MARCAR DEUDA SALDADA
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onCloseMonth}>
            ✓ FINALIZAR MES
          </button>
        )}
      </div>
    </div>
  );
}
