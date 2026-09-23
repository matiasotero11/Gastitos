import { useState, useEffect } from 'react';
import { getGastosByMonth, calculateDebts, addGasto, updateGasto, deleteGasto, getAllMonths, getMonthState, markDebtAsPaid } from '../services/firebaseService';
import ResumenMes from './ResumenMes';
import CargarGasto from './CargarGasto';
import Transacciones from './Transacciones';
import Historial from './Historial';

export default function Dashboard({ currentMonth, setCurrentMonth, onLogout }) {
  const [view, setView] = useState('resumen');
  const [gastos, setGastos] = useState([]);
  const [debts, setDebts] = useState(null);
  const [debtPaid, setDebtPaid] = useState(false);
  const [editingGasto, setEditingGasto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const gastosData = await getGastosByMonth(currentMonth);
      setGastos(gastosData);
      
      const debtsData = await calculateDebts(currentMonth);
      setDebts(debtsData);
      
      // Cargar si deuda fue saldada en este mes
      const monthState = await getMonthState(currentMonth);
      setDebtPaid(monthState.debtPaid || false);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
    setLoading(false);
  };

  const handleAddGasto = async (fecha, person, category, amount) => {
    try {
      if (editingGasto) {
        await updateGasto(currentMonth, editingGasto.id, fecha, person, category, amount);
        setEditingGasto(null);
      } else {
        await addGasto(fecha, person, category, amount);
      }
      await loadMonthData();
      setView('resumen');
    } catch (error) {
      alert('Error al guardar gasto');
    }
  };

  const handleEditGasto = (gasto) => {
    setEditingGasto(gasto);
    setView('cargar');
  };

  const handleDeleteGasto = async (gastoId) => {
    if (window.confirm('¿Estás seguro que querés borrar este gasto?')) {
      try {
        await deleteGasto(currentMonth, gastoId);
        await loadMonthData();
      } catch (error) {
        alert('Error al borrar gasto');
      }
    }
  };

  const handleMarkDebtAsPaid = async () => {
    try {
      await markDebtAsPaid(currentMonth);
      setDebtPaid(true);
    } catch (error) {
      console.error('Error al marcar deuda saldada:', error);
      alert('Error al marcar deuda saldada');
    }
  };

  const handleCloseMonth = () => {
    if (window.confirm('¿Estás seguro que querés cerrar este mes?')) {
      alert('Mes cerrado correctamente');
    }
  };

  const handleChangeMonth = (direction) => {
    const [year, month] = currentMonth.split('-');
    let newMonth = parseInt(month) + direction;
    let newYear = parseInt(year);

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <h1>🐱 GASTITOS</h1>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <nav className="navbar">
        <button className={`nav-btn ${view === 'resumen' ? 'active' : ''}`} onClick={() => setView('resumen')}>
          📊 Resumen
        </button>
        <button className={`nav-btn ${view === 'cargar' ? 'active' : ''}`} onClick={() => { setEditingGasto(null); setView('cargar'); }}>
          ➕ Cargar Gasto
        </button>
        <button className={`nav-btn ${view === 'transacciones' ? 'active' : ''}`} onClick={() => setView('transacciones')}>
          📝 Transacciones
        </button>
        <button className={`nav-btn ${view === 'historial' ? 'active' : ''}`} onClick={() => setView('historial')}>
          📅 Historial
        </button>
      </nav>

      <main className="content">
        {view === 'resumen' && (
          <ResumenMes 
            currentMonth={currentMonth} 
            gastos={gastos} 
            debts={debts}
            debtPaid={debtPaid}
            onMarkDebtAsPaid={handleMarkDebtAsPaid}
            onCloseMonth={handleCloseMonth}
            onChangeMonth={handleChangeMonth}
          />
        )}

        {view === 'cargar' && (
          <CargarGasto 
            onSubmit={handleAddGasto}
            editingGasto={editingGasto}
            onCancel={() => { setEditingGasto(null); setView('resumen'); }}
          />
        )}

        {view === 'transacciones' && (
          <Transacciones 
            currentMonth={currentMonth}
            gastos={gastos} 
            onEdit={handleEditGasto}
            onDelete={handleDeleteGasto}
            onChangeMonth={handleChangeMonth}
          />
        )}

        {view === 'historial' && (
          <Historial onSelectMonth={(month) => { setCurrentMonth(month); setView('resumen'); }} />
        )}
      </main>
    </div>
  );
}
