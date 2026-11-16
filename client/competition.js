const lang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'kz';
const T = {
  kz: {
    back: 'Күнтізбеге оралу', road: 'Шоссе', track: 'Трек', mtb: 'МТБ', bmx: 'BMX',
    date: 'Күні', place_label: 'Орны', results: 'Нәтижелер', empty_res: 'Бұл жарыстың нәтижесі әлі қосылмаған.',
    notfound: 'Жарыс табылмады.', error: 'Деректер жүктелмеді. Сервер қосулы ма?',
    place: 'Орын', athlete: 'Спортшы', region: 'Аймақ', time: 'Уақыт', points: 'Ұпай',
  },
  ru: {
    back: 'Назад к календарю', road: 'Шоссе', track: 'Трек', mtb: 'МТБ', bmx: 'BMX',
    date: 'Дата', place_label: 'Место проведения', results: 'Результаты', empty_res: 'Результаты этого старта ещё не добавлены.',
    notfound: 'Старт не найден.', error: 'Не удалось загрузить данные. Запущен ли сервер?',
    place: 'Место', athlete: 'Спортсмен', region: 'Регион', time: 'Время', points: 'Очки',
  },
};
const t = (k) => T[lang][k] || k;
const tr = (o) => (o && (o[lang] || o.kz)) || '';
const $ = (id) => document.getElementById(id);
const fmt = (d) => new Date(d).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
async function api(path) {
  const r = await fetch('/api' + path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
function fact(label, value) {
  const d = el('div');
  d.append(el('span', null, label), el('b', null, value));
  return d;
}

async function init() {
  document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
  document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
  const box = $('content');
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return box.append(el('p', 'note', t('notfound')));
  try {
    const [c, results] = await Promise.all([
      api('/competitions/' + encodeURIComponent(id)),
      api('/results?competition=' + encodeURIComponent(id)),
    ]);
    document.title = tr(c.title) + ' | Velo Portal';
    box.append(el('span', 'tag', t(c.discipline)), el('h1', null, tr(c.title)));
    const facts = el('div', 'dfacts');
    facts.append(fact(t('date'), fmt(c.date)));
    if (c.location) facts.append(fact(t('place_label'), c.location));
    box.append(facts);
    const desc = tr(c.description);
    if (desc) box.append(el('p', null, desc));
    box.append(el('h2', null, t('results')));
    if (!results.length) return box.append(el('p', 'note', t('empty_res')));
    const head = el('tr');
    ['place', 'athlete', 'region', 'time', 'points'].forEach((k) => head.append(el('th', null, t(k))));
    const thead = el('thead');
    thead.append(head);
    const tbody = el('tbody');
    results.forEach((r) => {
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
  } catch (e) {
    box.append(el('p', 'note', e.message === '404' ? t('notfound') : t('error')));
  }
}
init();
