import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Supermercado',
  'Luz',
  'Gas',
  'Alquiler',
  'Expensas',
  'Tuerto',
  'Salida',
  'Regalos',
  'Auto',
  'Otro'
];

export default function CargarGasto({ onSubmit, editingGasto, onCancel }) {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [person, setPerson] = useState('Matías');
  const [category, setCategory] = useState('Supermercado');
  const [amount, setAmount] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (editingGasto) {
      setFecha(editingGasto.date);
      setPerson(editingGasto.person);
      setCategory(editingGasto.category);
      setAmount(String(editingGasto.amount));
    }
  }, [editingGasto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    const finalCategory = category === 'Otro' ? customCategory : category;
    if (!finalCategory) {
      alert('Por favor especifica una categoría');
      return;
    }

    onSubmit(fecha, person, finalCategory, amount);
    setFecha(new Date().toISOString().split('T')[0]);
    setPerson('Matías');
    setCategory('Supermercado');
    setAmount('');
    setCustomCategory('');
  };

  return (
    <div className="cargar-gasto">
      <h2>{editingGasto ? '✏️ EDITAR GASTO' : '📝 CARGAR GASTO'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>¿Quién paga?</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                value="Matías" 
                checked={person === 'Matías'}
                onChange={(e) => setPerson(e.target.value)}
              />
              Matías
            </label>
            <label>
              <input 
                type="radio" 
                value="Rocío" 
                checked={person === 'Rocío'}
                onChange={(e) => setPerson(e.target.value)}
              />
              Rocío
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {category === 'Otro' && (
          <div className="form-group">
            <label>Especifica la categoría:</label>
            <input 
              type="text" 
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Ej: Farmacia"
            />
          </div>
        )}

        <div className="form-group">
          <label>Importe:</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            step="0.01"
            required
          />
        </div>

        <p className="info-text">✓ El gasto se divide 50/50 automáticamente</p>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {editingGasto ? 'ACTUALIZAR GASTO' : 'CARGAR GASTO'}
          </button>
          {editingGasto && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
