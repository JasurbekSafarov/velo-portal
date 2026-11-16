const API = '/api';
const DISC = ['road', 'track', 'mtb', 'bmx'];
const T = {
  kz: {
    m_fed: 'Федерация', m_news: 'Жаңалықтар', m_leaders: 'Басшылық', m_partners: 'Серіктестер',
    m_disc: 'Дисциплина', m_cal: 'Күнтізбе', m_res: 'Нәтижелер', m_login: 'Кіру', m_cabinet: 'Кабинет', band: 'Әр жарыс — жаңа жол',
    st_comps: 'Жарыс', st_results: 'Нәтиже жазбасы', st_news: 'Жаңалық', st_disc: 'Бағыт',
    cal_next: 'Жақын жарыс', cal_none: 'Бұл күні жарыс жоқ', cal_more: 'Толығырақ', cal_prev: 'Алдыңғы ай', cal_nextm: 'Келесі ай',
    hero1: 'Қазақстан велоспорты бір жерде', hero2: 'Жарысқа дайынсың ба?', open: 'ашу',
    disc_title: 'Велоспорт бағыттары', cal_title: 'Жарыс күнтізбесі', res_title: 'Нәтижелер',
    news_title: 'Соңғы жаңалықтар', leaders_title: 'Басшылық', partners_title: 'Серіктестер',
    partners_text: 'Демеуші болғыңыз келсе, бізге жазыңыз.',
    all: 'Барлығы', road: 'Шоссе', track: 'Трек', mtb: 'МТБ', bmx: 'BMX',
    d_road: 'Асфальт жолдағы ұзақ қашықтық гонкалары.', d_track: 'Жабық велотректегі жылдамдық пен тактика жарысы.',
    d_mtb: 'Тау, тас және тамырлы жолдардағы велоспорт.', d_bmx: 'Кедергілері бар қысқа трассадағы жарыстар мен трюктер.',
    person: 'Аты-жөні', role_president: 'Президент', role_vp: 'Вице-президент', role_sec: 'Бас хатшы', role_judge: 'Бас төреші',
    choose: 'Жарысты таңдаңыз', place: 'Орын', athlete: 'Спортшы', region: 'Аймақ', time: 'Уақыт', points: 'Ұпай',
    empty_news: 'Жаңалықтар әзірге жоқ.', empty_comp: 'Бұл бағытта жарыс жоқ.',
    empty_res: 'Бұл жарыстың нәтижесі әлі қосылмаған.', error: 'Деректер жүктелмеді. Сервер қосулы ма?',
    links: 'Сілтемелер', contacts: 'Байланыс', address: 'Мекенжай: Қазақстан, Астана', email: 'Email: info@example.com',
    footer_copy: 'Портфолио жобасы. Node.js, Express, MongoDB.',
  },
  ru: {
    m_fed: 'Федерация', m_news: 'Новости', m_leaders: 'Руководство', m_partners: 'Партнёры',
    m_disc: 'Дисциплины', m_cal: 'Календарь', m_res: 'Результаты', m_login: 'Войти', m_cabinet: 'Кабинет', band: 'Каждый старт — новая дорога',
    st_comps: 'Стартов', st_results: 'Записей результатов', st_news: 'Новостей', st_disc: 'Направления',
    cal_next: 'Ближайший старт', cal_none: 'В этот день стартов нет', cal_more: 'Подробнее', cal_prev: 'Предыдущий месяц', cal_nextm: 'Следующий месяц',
    hero1: 'Велоспорт Казахстана в одном месте', hero2: 'Готов к старту?', open: 'открыть',
    disc_title: 'Направления велоспорта', cal_title: 'Календарь стартов', res_title: 'Результаты',
    news_title: 'Последние новости', leaders_title: 'Руководство', partners_title: 'Партнёры',
    partners_text: 'Хотите стать спонсором? Напишите нам.',
    all: 'Все', road: 'Шоссе', track: 'Трек', mtb: 'МТБ', bmx: 'BMX',
    d_road: 'Многодневные и однодневные гонки по асфальту.', d_track: 'Гонки на скорость и тактику на крытом велотреке.',
    d_mtb: 'Велоспорт по горным, каменистым и корневым тропам.', d_bmx: 'Короткие гонки и трюки на трассе с препятствиями.',
    person: 'Имя Фамилия', role_president: 'Президент', role_vp: 'Вице-президент', role_sec: 'Генеральный секретарь', role_judge: 'Главный судья',
    choose: 'Выберите старт', place: 'Место', athlete: 'Спортсмен', region: 'Регион', time: 'Время', points: 'Очки',
    empty_news: 'Новостей пока нет.', empty_comp: 'В этой дисциплине стартов нет.',
    empty_res: 'Результаты этого старта ещё не добавлены.', error: 'Не удалось загрузить данные. Запущен ли сервер?',
    links: 'Ссылки', contacts: 'Контакты', address: 'Адрес: Казахстан, Астана', email: 'Email: info@example.com',
    footer_copy: 'Портфолио-проект. Node.js, Express, MongoDB.',
  },
};
const LEADERS = ['role_president', 'role_vp', 'role_sec', 'role_judge'];

const S = { lang: localStorage.getItem('lang') || 'kz', disc: '', news: [], comps: [], results: [], error: false, signed: false, cal: null, sel: '' };
const $ = (id) => document.getElementById(id);
const t = (k) => T[S.lang][k];
const tr = (o) => (o && (o[S.lang] || o.kz)) || '';
const fmt = (d, o) => new Date(d).toLocaleDateString(S.lang === 'kz' ? 'kk-KZ' : 'ru-RU', { timeZone: 'UTC', ...o });

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
async function api(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

function renderDisc() {
  const grid = $('discGrid'), sub = $('subDisc');
  grid.replaceChildren();
  sub.replaceChildren();
  DISC.forEach((d) => {
    const pick = () => { S.disc = d; renderFilters(); renderComps(); $('menu').classList.remove('open'); };
    const a = el('a', 'disc');
    a.href = '#calendar';
    a.onclick = pick;
    a.append(el('h3', null, t(d)), el('p', null, t('d_' + d)));
    grid.append(a);
    const s = el('a', null, t(d));
    s.href = '#calendar';
    s.onclick = pick;
    sub.append(s);
  });
}

function renderFilters() {
  const box = $('filters');
  box.replaceChildren();
  ['', ...DISC].forEach((d) => {
    const b = el('button', 'chip', t(d || 'all'));
    b.type = 'button';
    b.setAttribute('aria-pressed', String(S.disc === d));
    b.onclick = () => { S.disc = d; renderFilters(); renderComps(); };
    box.append(b);
  });
}

function renderComps() {
  renderCalendar();
  const box = $('compList');
  box.replaceChildren();
  if (S.error) return box.append(el('p', 'note', t('error')));
  const list = S.comps.filter((c) => !S.disc || c.discipline === S.disc);
  if (!list.length) return box.append(el('p', 'note', t('empty_comp')));
  list.forEach((c) => {
    const row = el('article', 'row');
    const date = el('div', 'date');
    date.append(el('b', null, fmt(c.date, { day: 'numeric' })), el('span', 'muted', fmt(c.date, { month: 'short', year: 'numeric' })));
    const meta = el('p', 'meta');
    meta.append(el('span', 'tag', t(c.discipline)));
    if (c.location) meta.append(el('span', 'muted', c.location));
    const body = el('div');
    const h = el('h3');
    const link = el('a', null, tr(c.title));
    link.href = 'competition.html?id=' + c._id;
    h.append(link);
    body.append(h, meta);
    row.append(date, body);
    box.append(row);
  });
}

function renderSelect() {
  const sel = $('compSelect');
  const cur = sel.value;
  sel.replaceChildren();
  S.comps.slice().reverse().forEach((c) => {
    const o = el('option', null, `${tr(c.title)} (${fmt(c.date, { day: 'numeric', month: 'short', year: 'numeric' })})`);
    o.value = c._id;
    sel.append(o);
  });
  if (cur) sel.value = cur;
}

function renderResults() {
  const box = $('resTable');
  box.replaceChildren();
  if (S.error || !S.results) return box.append(el('p', 'note', t('error')));
  if (!S.results.length) return box.append(el('p', 'note', t('empty_res')));
  const head = el('tr');
  ['place', 'athlete', 'region', 'time', 'points'].forEach((k) => head.append(el('th', null, t(k))));
  const thead = el('thead');
  thead.append(head);
  const tbody = el('tbody');
  S.results.forEach((r) => {
    const row = el('tr');
    [r.place, r.athlete, r.region, r.time, r.points].forEach((v, i) => {
      row.append(el('td', i === 0 && r.place <= 3 ? 'podium' : '', v ?? ''));
    });
    tbody.append(row);
  });
  const table = el('table');
  table.append(thead, tbody);
  const wrap = el('div', 'scroll');
  wrap.append(table);
  box.append(wrap);
}

function renderNews() {
  const box = $('newsList');
  box.replaceChildren();
  if (S.error) return box.append(el('p', 'note', t('error')));
  if (!S.news.length) return box.append(el('p', 'note', t('empty_news')));
  S.news.slice(0, 3).forEach((n) => {
    const card = el('article', 'card');
    const thumb = el('div', 'thumb');
    if (n.imageUrl) thumb.style.backgroundImage = 'url("' + n.imageUrl.replace(/"/g, '%22') + '")';
    card.append(thumb, el('h3', null, tr(n.title)), el('time', 'muted', fmt(n.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })));
    const txt = tr(n.body);
    if (txt) card.append(el('p', null, txt.length > 120 ? txt.slice(0, 120) + '…' : txt));
    box.append(card);
  });
}

function renderLeaders() {
  const box = $('leaderGrid');
  box.replaceChildren();
  LEADERS.forEach((k) => {
    const d = el('div', 'leader');
    d.append(el('i', null, t(k)[0]), el('h3', null, t('person')), el('p', 'muted', t(k)));
    box.append(d);
  });
}

async function loadResults() {
  const id = $('compSelect').value;
  if (S.error || !id) { S.results = []; return renderResults(); }
  try {
    S.results = await api('/results?competition=' + encodeURIComponent(id));
  } catch {
    S.results = null;
  }
  renderResults();
}

function applyStatic() {
  document.documentElement.lang = S.lang === 'kz' ? 'kk' : 'ru';
  document.querySelectorAll('[data-i18n]').forEach((n) => {
    const k = n.dataset.i18n;
    n.textContent = t(k === 'm_login' && S.signed ? 'm_cabinet' : k);
  });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang)));
}

function renderAll() {
  renderDisc(); renderFilters(); renderComps(); renderSelect(); renderResults(); renderNews(); renderLeaders();
  reveal();
}

// language
document.querySelectorAll('[data-lang]').forEach((b) => {
  b.onclick = () => { S.lang = b.dataset.lang; localStorage.setItem('lang', S.lang); applyStatic(); renderAll(); };
});

// hero slider
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dots button')];
let cur = 0, timer;
function show(i) {
  cur = i;
  slides.forEach((s, k) => s.classList.toggle('on', k === i));
  dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
}
function auto() {
  clearInterval(timer);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show((cur + 1) % slides.length), 6000);
}
dots.forEach((d, k) => { d.onclick = () => { show(k); auto(); }; });
show(0);
auto();

// header, mobile menu, back to top
function onScroll() {
  $('top').classList.toggle('solid', scrollY > 40);
  $('toTop').hidden = scrollY < 500;
  const max = document.documentElement.scrollHeight - innerHeight;
  $('progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--py', Math.round(scrollY * 0.25) + 'px');
  }
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
$('burger').onclick = () => {
  const open = $('menu').classList.toggle('open');
  $('burger').setAttribute('aria-expanded', String(open));
};
$('menu').addEventListener('click', (e) => { if (e.target.closest('a')) $('menu').classList.remove('open'); });
$('toTop').onclick = () => scrollTo({ top: 0 });

// scroll reveal: blocks fade and rise into place as they enter the screen
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 })
  : null;
function reveal() {
  if (REDUCED || !io) return;
  document.querySelectorAll('main h2, .row, .card, .disc, .leader, .tile, .logos div, .band p, .stats div, .cal').forEach((n) => {
    if (n.dataset.r) return;
    n.dataset.r = '1';
    n.style.setProperty('--i', Math.min([...n.parentElement.children].indexOf(n), 6));
    n.classList.add('reveal');
    io.observe(n);
  });
}

// calendar: month grid, days with competitions are highlighted and clickable
const pad2 = (n) => String(n).padStart(2, '0');
const todayKey = () => { const n = new Date(); return `${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}`; };
function eventsByDay() {
  const map = {};
  S.comps.filter((c) => !S.disc || c.discipline === S.disc).forEach((c) => { (map[c.date.slice(0, 10)] ||= []).push(c); });
  return map;
}
function shiftMonth(dm) {
  const d = new Date(Date.UTC(S.cal.y, S.cal.m + dm, 1));
  S.cal = { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  renderCalendar();
}
function renderCalendar() {
  const box = $('cal');
  box.replaceChildren();
  if (!S.cal) { const n = new Date(); S.cal = { y: n.getFullYear(), m: n.getMonth() }; }
  const { y, m } = S.cal, loc = S.lang === 'kz' ? 'kk-KZ' : 'ru-RU', ev = eventsByDay(), today = todayKey();
  const head = el('div', 'cal-head');
  const prev = el('button', null, '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('cal_prev'));
  prev.onclick = () => shiftMonth(-1);
  const next = el('button', null, '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('cal_nextm'));
  next.onclick = () => shiftMonth(1);
  head.append(prev, el('b', null, new Date(Date.UTC(y, m, 1)).toLocaleDateString(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' })), next);
  const grid = el('div', 'cal-grid');
  for (let i = 0; i < 7; i++) grid.append(el('span', 'wd', new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(loc, { weekday: 'short', timeZone: 'UTC' })));
  const offset = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  for (let i = 0; i < offset; i++) grid.append(el('span'));
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${pad2(m + 1)}-${pad2(d)}`;
    const b = el('button', 'day' + (ev[key] ? ' has' : '') + (key === today ? ' today' : '') + (key === S.sel ? ' sel' : ''), String(d));
    b.type = 'button';
    if (ev[key]) b.onclick = () => { S.sel = key; renderCalendar(); };
    else b.disabled = true;
    grid.append(b);
  }
  box.append(head, grid);
  renderDayPanel();
}
function renderDayPanel() {
  const box = $('dayPanel');
  box.replaceChildren();
  const ev = eventsByDay();
  let list, upcoming = false;
  if (S.sel && ev[S.sel]) {
    list = ev[S.sel];
  } else {
    const k = Object.keys(ev).sort().find((x) => x >= todayKey());
    if (!k) return box.append(el('p', 'note', S.error ? t('error') : t('cal_none')));
    list = ev[k];
    upcoming = true;
  }
  if (upcoming) box.append(el('p', 'muted', t('cal_next')));
  list.forEach((c) => {
    const card = el('article', 'evt');
    const meta = el('p', 'meta');
    meta.append(el('span', 'tag', t(c.discipline)));
    if (c.location) meta.append(el('span', 'muted', c.location));
    const h = el('h3');
    const link = el('a', null, tr(c.title));
    link.href = 'competition.html?id=' + c._id;
    h.append(link);
    const more = el('a', 'more', t('cal_more'));
    more.href = link.href;
    card.append(el('span', 'pill', fmt(c.date, { day: 'numeric', month: 'long', year: 'numeric' })), h, meta, more);
    box.append(card);
  });
}

// stats: numbers count up when they scroll into view
const countIO = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { countUp(e.target); countIO.unobserve(e.target); }
    }), { threshold: 0.5 })
  : null;
function countUp(b) {
  const to = Number(b.dataset.to), start = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
async function startStats() {
  const results = await api('/results').then((r) => r.length).catch(() => null);
  const vals = { comps: S.comps.length, results, news: S.news.length, disc: DISC.length };
  document.querySelectorAll('[data-count]').forEach((b) => {
    const to = vals[b.dataset.count];
    if (S.error || to == null) { b.textContent = '–'; return; }
    b.dataset.to = to;
    if (REDUCED || !countIO) b.textContent = to;
    else countIO.observe(b);
  });
}

// header: "Кіру" becomes "Кабинет" when the visitor is signed in
async function checkSession() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const r = await fetch(API + '/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    if (r.ok) S.signed = true;
    else if (r.status === 401) localStorage.removeItem('token');
  } catch { /* server unreachable: keep the default label */ }
  applyStatic();
}

async function init() {
  applyStatic();
  checkSession();
  renderDisc(); renderLeaders(); renderFilters();
  try {
    [S.news, S.comps] = await Promise.all([api('/news'), api('/competitions')]);
  } catch {
    S.error = true;
  }
  renderComps(); renderNews(); renderSelect();
  const past = S.comps.filter((c) => new Date(c.date) <= Date.now()).pop();
  if (past) $('compSelect').value = past._id;
  $('compSelect').onchange = loadResults;
  await loadResults();
  reveal();
  startStats();
}
init();
