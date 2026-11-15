const API = '/api';
const DISC = { road: 'Шоссе', track: 'Трек', mtb: 'МТБ', bmx: 'BMX' };
const L = {
  'title.kz': 'Тақырып (KZ)', 'title.ru': 'Тақырып (RU)', 'body.kz': 'Мәтін (KZ)', 'body.ru': 'Мәтін (RU)',
  imageUrl: 'Сурет сілтемесі', discipline: 'Бағыт', date: 'Күні', location: 'Орны',
  'description.kz': 'Сипаттама (KZ)', 'description.ru': 'Сипаттама (RU)',
  athlete: 'Спортшы', region: 'Аймақ', category: 'Санат', place: 'Орын', time: 'Уақыт', points: 'Ұпай',
};
const RES = {
  news: {
    name: 'Жаңалықтар', path: '/news', req: ['title.kz'], area: ['body.kz', 'body.ru'],
    fields: ['title.kz', 'title.ru', 'body.kz', 'body.ru', 'imageUrl'],
    label: (i) => i.title.kz, sub: (i) => new Date(i.createdAt).toLocaleDateString('kk-KZ'),
  },
  competitions: {
    name: 'Жарыстар', path: '/competitions', req: ['title.kz', 'discipline', 'date'], area: ['description.kz', 'description.ru'],
    fields: ['title.kz', 'title.ru', 'discipline', 'date', 'location', 'description.kz', 'description.ru'],
    label: (i) => i.title.kz,
    sub: (i) => `${DISC[i.discipline]}, ${i.date.slice(0, 10)}${i.location ? ', ' + i.location : ''}`,
  },
  results: {
    name: 'Нәтижелер', path: '/results', req: ['athlete'], area: [],
    fields: ['athlete', 'region', 'category', 'place', 'time', 'points'],
    label: (i) => `${i.place ?? '-'}. ${i.athlete}`, sub: (i) => [i.category, i.region, i.time].filter(Boolean).join(', '),
  },
};

const A = { tab: 'news', items: [], comps: [], compId: '', edit: null };
let token = localStorage.getItem('token');
const $ = (id) => document.getElementById(id);
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => (a[k] ??= {}), o)[last] = v; };
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function msg(text, ok) { const m = $('msg'); m.textContent = text; m.className = ok ? 'ok' : ''; }

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== '/auth/login') { logout(); throw new Error('Сессия аяқталды, қайта кіріңіз'); }
  if (!r.ok) throw new Error(data.message || r.status);
  return data;
}

function renderTabs() {
  const box = $('tabs');
  box.replaceChildren();
  Object.entries(RES).forEach(([k, r]) => {
    const b = el('button', 'chip', r.name);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(A.tab === k));
    b.onclick = () => { A.tab = k; A.edit = null; msg(''); refresh(); };
    box.append(b);
  });
}

function fillPick() {
  const sel = $('compPick');
  sel.replaceChildren();
  A.comps.slice().reverse().forEach((c) => {
    const o = el('option', null, `${c.title.kz} (${c.date.slice(0, 10)})`);
    o.value = c._id;
    sel.append(o);
  });
  if (!A.comps.some((c) => c._id === A.compId)) A.compId = A.comps.length ? sel.options[0].value : '';
  sel.value = A.compId;
}
$('compPick').onchange = (e) => { A.compId = e.target.value; A.edit = null; refresh(); };

function renderList() {
  const box = $('list');
  box.replaceChildren();
  const r = RES[A.tab];
  if (!A.items.length) return box.append(el('p', 'note', 'Әзірге жазба жоқ.'));
  A.items.forEach((i) => {
    const row = el('div', 'item');
    const info = el('div');
    info.append(el('b', null, r.label(i)), el('small', null, r.sub(i)));
    const act = el('div', 'act');
    const edit = el('button', 'btn ghost', 'Өзгерту');
    edit.type = 'button';
    edit.onclick = () => { A.edit = i; renderForm(); scrollTo({ top: 0 }); };
    const del = el('button', 'btn ghost', 'Өшіру');
    del.type = 'button';
    del.onclick = async () => {
      if (!confirm('Осы жазбаны өшіру керек пе?')) return;
      try { await req('DELETE', r.path + '/' + i._id); A.edit = null; msg('Өшірілді', true); await refresh(); } catch (e) { msg(e.message); }
    };
    act.append(edit, del);
    row.append(info, act);
    box.append(row);
  });
}

function renderForm() {
  const f = $('form');
  f.replaceChildren();
  const r = RES[A.tab], it = A.edit;
  f.append(el('h3', null, it ? 'Өзгерту' : 'Жаңа жазба'));
  r.fields.forEach((p) => {
    const lab = el('label', null, L[p] + (r.req.includes(p) ? ' *' : ''));
    let inp;
    if (p === 'discipline') {
      inp = el('select');
      Object.entries(DISC).forEach(([v, n]) => { const o = el('option', null, n); o.value = v; inp.append(o); });
    } else if (r.area.includes(p)) {
      inp = el('textarea');
    } else {
      inp = el('input');
      inp.type = p === 'date' ? 'date' : p === 'place' || p === 'points' ? 'number' : p === 'imageUrl' ? 'url' : 'text';
    }
    inp.name = p;
    inp.required = r.req.includes(p);
    let v = it ? get(it, p) : '';
    if (p === 'date' && v) v = v.slice(0, 10);
    if (v !== undefined && v !== null) inp.value = v;
    lab.append(inp);
    f.append(lab);
  });
  const ok = el('button', 'btn', it ? 'Сақтау' : 'Қосу');
  ok.type = 'submit';
  f.append(ok);
  if (it) {
    const c = el('button', 'btn ghost', 'Бас тарту');
    c.type = 'button';
    c.onclick = () => { A.edit = null; renderForm(); };
    f.append(c);
  }
}

$('form').onsubmit = async (e) => {
  e.preventDefault();
  const r = RES[A.tab], body = {};
  r.fields.forEach((p) => {
    const inp = e.target.elements[p];
    let v = inp.value.trim();
    if (inp.type === 'number') { if (v === '') return; v = Number(v); }
    set(body, p, v);
  });
  if (A.tab === 'results') {
    if (!A.compId) return msg('Алдымен жарыс таңдаңыз');
    body.competition = A.compId;
  }
  try {
    await req(A.edit ? 'PUT' : 'POST', r.path + (A.edit ? '/' + A.edit._id : ''), body);
    A.edit = null;
    msg('Сақталды', true);
    await refresh();
  } catch (err) { msg(err.message); }
};

async function refresh() {
  renderTabs();
  $('pick').hidden = A.tab !== 'results';
  try {
    A.comps = await req('GET', '/competitions');
    fillPick();
    if (A.tab === 'news') A.items = await req('GET', '/news');
    else if (A.tab === 'competitions') A.items = A.comps;
    else A.items = A.compId ? await req('GET', '/results?competition=' + A.compId) : [];
  } catch (e) { return msg(e.message); }
  renderList();
  renderForm();
}

async function enter() {
  try {
    const me = await req('GET', '/auth/me');
    if (!['admin', 'editor'].includes(me.role)) {
      logout();
      $('lmsg').textContent = 'Рұқсат жоқ: бұл бөлім тек әкімшілерге арналған';
      return;
    }
  } catch { return; }
  $('login').hidden = true;
  $('panel').hidden = false;
  $('logout').hidden = false;
  refresh();
}
function logout() {
  token = null;
  localStorage.removeItem('token');
  $('panel').hidden = true;
  $('logout').hidden = true;
  $('login').hidden = false;
}
$('logout').onclick = logout;

$('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    const d = await req('POST', '/auth/login', { email: fd.get('email'), password: fd.get('password') });
    token = d.token;
    localStorage.setItem('token', token);
    $('lmsg').textContent = '';
    enter();
  } catch (err) {
    $('lmsg').textContent = err.message === 'Invalid credentials' ? 'Email немесе құпия сөз қате' : err.message;
  }
};

if (token) enter();
