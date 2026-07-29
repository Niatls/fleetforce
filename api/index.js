import { INITIAL_VACANCIES, INITIAL_CANDIDATES, INITIAL_SHIPOWNER_REQUESTS } from '../src/data/initialData.js';

let vacanciesStore = [...INITIAL_VACANCIES];
let candidatesStore = [...INITIAL_CANDIDATES];
let shipownerRequestsStore = [...INITIAL_SHIPOWNER_REQUESTS];

export default function handler(req, res) {
  const url = req.url || '';

  // Enable CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vacancies API
  if (url.includes('/api/vacancies')) {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: vacanciesStore });
    }
    if (req.method === 'POST') {
      const newVac = {
        id: Date.now(),
        active: true,
        ...(req.body || {})
      };
      vacanciesStore.unshift(newVac);
      return res.status(201).json({ success: true, data: newVac });
    }
    if (req.method === 'PUT') {
      const parts = url.split('/');
      const id = Number(parts[parts.length - 1]);
      vacanciesStore = vacanciesStore.map(v => v.id === id ? { ...v, ...(req.body || {}) } : v);
      return res.status(200).json({ success: true });
    }
    if (req.method === 'DELETE') {
      const parts = url.split('/');
      const id = Number(parts[parts.length - 1]);
      vacanciesStore = vacanciesStore.filter(v => v.id !== id);
      return res.status(200).json({ success: true });
    }
  }

  // Candidates API
  if (url.includes('/api/candidates')) {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: candidatesStore });
    }
    if (req.method === 'POST') {
      const newCand = {
        id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: 'New',
        submittedAt: new Date().toISOString(),
        ...(req.body || {})
      };
      candidatesStore.unshift(newCand);
      return res.status(201).json({ success: true, data: newCand });
    }
    if (req.method === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      candidatesStore = candidatesStore.map(c => c.id === id ? { ...c, ...(req.body || {}) } : c);
      return res.status(200).json({ success: true });
    }
  }

  // Shipowner Requests API
  if (url.includes('/api/shipowner-requests')) {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: shipownerRequestsStore });
    }
    if (req.method === 'POST') {
      const newReq = {
        id: `REQ-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString(),
        ...(req.body || {})
      };
      shipownerRequestsStore.unshift(newReq);
      return res.status(201).json({ success: true, data: newReq });
    }
    if (req.method === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      shipownerRequestsStore = shipownerRequestsStore.map(r => r.id === id ? { ...r, ...(req.body || {}) } : r);
      return res.status(200).json({ success: true });
    }
    if (req.method === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      shipownerRequestsStore = shipownerRequestsStore.filter(r => r.id !== id);
      return res.status(200).json({ success: true });
    }
  }

  // Auth API
  if (url.includes('/api/auth/login')) {
    const { username, password } = req.body || {};
    if (username === 'admin') {
      return res.status(200).json({ success: true, token: 'fleetforce-jwt-token-9988', role: 'admin' });
    }
    return res.status(401).json({ success: false, message: 'Неверные данные для входа' });
  }

  if (url.includes('/api/auth/change-password')) {
    return res.status(200).json({ success: true, message: 'Пароль успешно изменён!' });
  }

  // Webmail Accounts API
  if (url.includes('/api/webmail/accounts')) {
    return res.status(200).json({ 
      success: true, 
      data: [
        { id: 1, email: 'crewing@fleetforce.ru', description: 'Крюинговый отдел (заявки моряков)', role: 'Главная почта' },
        { id: 2, email: 'info@fleetforce.ru', description: 'Общие вопросы и судовладельцы', role: 'Инфо' }
      ] 
    });
  }

  return res.status(200).json({ success: true, message: "FleetForce Vercel API Serverless Service Online" });
}
