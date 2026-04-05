import React, { useState, useEffect } from 'react';
import { User, Activity, CreditCard, BrainCircuit, Plus, X, Trash2 } from 'lucide-react';

function App() {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '', name: '', email: '', course: 'B.Tech CSE', 
    attendance: '', feesStatus: 'Pending', performance: 'Average'
  });

  // 1. LOAD DATA from Browser Memory on start
  useEffect(() => {
    const savedData = localStorage.getItem('crm_leads');
    if (savedData) {
      setLeads(JSON.parse(savedData));
    }
  }, []);

  // 2. SAVE DATA to Browser Memory whenever 'leads' changes
  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLead = { ...formData, _id: Date.now().toString() };
    setLeads([...leads, newLead]); // Adds to the list
    setShowModal(false); // Closes popup
    setFormData({ studentId: '', name: '', email: '', course: 'B.Tech CSE', attendance: '', feesStatus: 'Pending', performance: 'Average' });
  };

  const deleteLead = (id) => {
    setLeads(leads.filter(lead => lead._id !== id));
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '30px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#38bdf8' }}>Futuristic Student CRM</h1>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Sri Vasavi Engineering College Portal (Local Mode)</p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtnStyle}>
          <Plus size={18} /> Add Student
        </button>
      </header>

      {/* STATS */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={statCard}>Total Records: {leads.length}</div>
        <div style={statCard}>Pending Fees: {leads.filter(l => l.feesStatus === 'Pending').length}</div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '10px', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Attendance</th>
              <th style={thStyle}>Fees</th>
              <th style={thStyle}>Performance</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={tdStyle}>{lead.studentId}</td>
                <td style={tdStyle}>{lead.name}</td>
                <td style={tdStyle}>{lead.attendance}%</td>
                <td style={{ ...tdStyle, color: lead.feesStatus === 'Paid' ? '#4ade80' : '#f87171' }}>{lead.feesStatus}</td>
                <td style={tdStyle}>{lead.performance}</td>
                <td style={tdStyle}>
                  <Trash2 size={16} color="#f87171" style={{cursor:'pointer'}} onClick={() => deleteLead(lead._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalStyle}>
            <h3>Add New Student Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input required style={inStyle} placeholder="ID" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
              <input required style={inStyle} placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" style={inStyle} placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="number" style={inStyle} placeholder="Attendance %" value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})} />
              <select style={inStyle} value={formData.feesStatus} onChange={e => setFormData({...formData, feesStatus: e.target.value})}>
                <option value="Pending">Fees: Pending</option>
                <option value="Paid">Fees: Paid</option>
              </select>
              <select style={inStyle} value={formData.performance} onChange={e => setFormData({...formData, performance: e.target.value})}>
                <option value="Average">Average</option>
                <option value="Excellent">Excellent</option>
                <option value="At Risk">At Risk</option>
              </select>
              <button type="submit" style={{ ...addBtnStyle, gridColumn: 'span 2' }}>Confirm & Save</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', gridColumn: 'span 2' }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '15px' };
const tdStyle = { padding: '15px' };
const statCard = { flex: 1, backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' };
const addBtnStyle = { backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', width: '500px', border: '1px solid #38bdf8' };
const inStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' };

export default App;