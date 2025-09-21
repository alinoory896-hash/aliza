// فایل: App.jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [exercise, setExercise] = useState('');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('dailyEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dailyEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exercise) return alert('لطفاً انتخاب کنید تمرین انجام شد یا خیر!');

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      exercise,
      notes,
      done: false
    };

    setEntries([newEntry, ...entries]);
    setExercise('');
    setNotes('');
  };

  const toggleDone = (id) => {
    const updated = entries.map(entry => entry.id === id ? {...entry, done: !entry.done} : entry);
    setEntries(updated);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 to-indigo-200 flex justify-center items-start p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">پیگیری روزانه</h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block font-semibold mb-1">تمرین انجام شد؟</label>
          <select value={exercise} onChange={e => setExercise(e.target.value)} className="w-full border p-2 rounded mb-4">
            <option value="">انتخاب کنید</option>
            <option value="بله">بله</option>
            <option value="خیر">خیر</option>
          </select>

          <label className="block font-semibold mb-1">یادداشت:</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="یادداشت امروز را بنویس..." rows={4} className="w-full border p-2 rounded mb-4"></textarea>

          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">ثبت</button>
        </form>

        <div>
          {entries.length === 0 && <p className="text-gray-500 text-center">هنوز هیچ ثبت روزانه‌ای وجود ندارد.</p>}
          {entries.map(entry => (
            <div key={entry.id} className="bg-gray-100 p-3 rounded mb-3 flex justify-between items-start">
              <div>
                <p className={`${entry.done ? 'line-through text-gray-400' : ''}`}><strong>{entry.date}</strong> - تمرین: {entry.exercise}</p>
                {entry.notes && <p className={`${entry.done ? 'line-through text-gray-400' : ''}`}>یادداشت: {entry.notes}</p>}
              </div>
              <div className="flex flex-col ml-2">
                <button onClick={() => toggleDone(entry.id)} className="text-blue-500 hover:underline mb-1">تیک</button>
                <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:underline">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;