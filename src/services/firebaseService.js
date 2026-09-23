import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

const getCurrentYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const addGasto = async (fecha, person, category, amount) => {
  try {
    const yearMonth = fecha.substring(0, 7);
    const docRef = await addDoc(collection(db, 'gastitos', yearMonth, 'transactions'), {
      date: fecha,
      person: person,
      category: category,
      amount: parseFloat(amount),
      shared: true,
      timestamp: new Date().getTime(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al cargar gasto:', error);
    throw error;
  }
};

export const getGastosByMonth = async (yearMonth) => {
  try {
    const q = query(
      collection(db, 'gastitos', yearMonth, 'transactions'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const gastos = [];
    querySnapshot.forEach((doc) => {
      gastos.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return gastos;
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return [];
  }
};

export const calculateDebts = async (yearMonth) => {
  try {
    const gastos = await getGastosByMonth(yearMonth);
    
    let totalMatias = 0;
    let totalRocio = 0;

    gastos.forEach((gasto) => {
      if (gasto.person === 'Matías') {
        totalMatias += gasto.amount;
      } else if (gasto.person === 'Rocío') {
        totalRocio += gasto.amount;
      }
    });

    const matiasShare = totalMatias / 2;
    const rocioShare = totalRocio / 2;

    const matiasOwes = rocioShare;
    const rocioOwes = matiasShare;

    const netDebt = rocioOwes - matiasOwes;

    return {
      totalGastado: totalMatias + totalRocio,
      matiasGastado: totalMatias,
      rocioGastado: totalRocio,
      matiasOwes: Math.max(0, matiasOwes),
      rocioOwes: Math.max(0, rocioOwes),
      netDebt: netDebt,
      netDebtAbs: Math.abs(netDebt),
      whoOwes: netDebt > 0 ? 'Rocío' : netDebt < 0 ? 'Matías' : 'Nadie',
    };
  } catch (error) {
    console.error('Error al calcular deudas:', error);
    return null;
  }
};

export const updateGasto = async (yearMonth, gastoId, fecha, person, category, amount) => {
  try {
    const gastoRef = doc(db, 'gastitos', yearMonth, 'transactions', gastoId);
    await updateDoc(gastoRef, {
      date: fecha,
      person: person,
      category: category,
      amount: parseFloat(amount),
      timestamp: new Date().getTime(),
    });
  } catch (error) {
    console.error('Error al editar gasto:', error);
    throw error;
  }
};

export const deleteGasto = async (yearMonth, gastoId) => {
  try {
    const gastoRef = doc(db, 'gastitos', yearMonth, 'transactions', gastoId);
    await deleteDoc(gastoRef);
  } catch (error) {
    console.error('Error al borrar gasto:', error);
    throw error;
  }
};

export const getMonthState = async (yearMonth) => {
  try {
    return {
      yearMonth: yearMonth,
      isClosed: false,
      debtPaid: false,
    };
  } catch (error) {
    console.error('Error al obtener estado del mes:', error);
    return { yearMonth, isClosed: false, debtPaid: false };
  }
};

export const markDebtAsPaid = async (yearMonth) => {
  try {
    const monthRef = doc(db, 'gastitos', yearMonth, '_metadata', 'state');
    await updateDoc(monthRef, {
      debtPaid: true,
      debtPaidDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error al marcar deuda como saldada:', error);
    throw error;
  }
};

export const closeMonth = async (yearMonth) => {
  try {
    const monthRef = doc(db, 'gastitos', yearMonth, '_metadata', 'state');
    await updateDoc(monthRef, {
      isClosed: true,
      closedDate: new Date().toISOString(),
      debtPaid: true,
    });
  } catch (error) {
    console.error('Error al finalizar mes:', error);
    throw error;
  }
};

export const getAllMonths = async () => {
  try {
    const monthsRef = collection(db, 'gastitos');
    const monthsSnap = await getDocs(monthsRef);
    const months = [];
    
    for (const monthDoc of monthsSnap.docs) {
      const yearMonth = monthDoc.id;
      if (yearMonth.match(/^\d{4}-\d{2}$/)) {
        const debts = await calculateDebts(yearMonth);
        months.push({
          yearMonth: yearMonth,
          totalGastado: debts?.totalGastado || 0,
          netDebt: debts?.netDebt || 0,
          whoOwes: debts?.whoOwes || 'Nadie',
        });
      }
    }
    
    return months.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
  } catch (error) {
    console.error('Error al obtener meses:', error);
    return [];
  }
};
