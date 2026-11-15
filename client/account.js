const lang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'kz';
const T = {
  kz: {
    intro_title: 'Жарысқа қосыл', intro_text: 'Тіркеліп, федерацияның жаңалықтары мен жарыстарын бір кабинеттен қадағала.',
    gate_title: 'Кім ретінде кіресіз?', athlete: 'Қатысушы', admin: 'Әкімші', editor: 'Редактор',
    role_athlete_d: 'Жарысқа қатысатын спортшы немесе жаттықтырушы', role_admin_d: 'Сайт мазмұнын басқару',
    change_role: 'Рөлді өзгерту', admin_note: 'Әкімші аккаунтын федерация береді, оған тіркелу жоқ.',
    login: 'Кіру', register: 'Тіркелу', name: 'Аты-жөні', email: 'Email', password: 'Құпия сөз',
    password_hint: 'Құпия сөз (кемінде 8 таңба)', logout: 'Шығу',
    card_admin: 'Админ-панель', card_admin_d: 'Жаңалық, жарыс және нәтижелерді басқару',
    card_home: 'Басты бет', card_home_d: 'Сайтқа оралу', card_comps: 'Менің жарыстарым', card_res: 'Менің нәтижелерім', soon: 'Жақында',
    NOT_ADMIN: 'Бұл аккаунт әкімші емес', 'Invalid credentials': 'Email немесе құпия сөз қате',
    'Email already registered': 'Бұл email бұрын тіркелген', 'Invalid email': 'Email қате жазылған',
    'Password must be at least 8 characters': 'Құпия сөз кемінде 8 таңба болуы керек',
    'Email and password required': 'Email мен құпия сөзді енгізіңіз',
  },
  ru: {
    intro_title: 'Присоединяйся к стартам', intro_text: 'Зарегистрируйся и следи за новостями и стартами федерации из одного кабинета.',
    gate_title: 'Кто вы?', athlete: 'Участник', admin: 'Администратор', editor: 'Редактор',
    role_athlete_d: 'Спортсмен или тренер, участвующий в стартах', role_admin_d: 'Управление содержимым сайта',
    change_role: 'Сменить роль', admin_note: 'Аккаунт администратора выдаёт федерация, регистрации нет.',
    login: 'Войти', register: 'Регистрация', name: 'Имя', email: 'Email', password: 'Пароль',
    password_hint: 'Пароль (не менее 8 символов)', logout: 'Выйти',
    card_admin: 'Админ-панель', card_admin_d: 'Управление новостями, стартами и результатами',
    card_home: 'Главная', card_home_d: 'Вернуться на сайт', card_comps: 'Мои старты', card_res: 'Мои результаты', soon: 'Скоро',
    NOT_ADMIN: 'Этот аккаунт не администратор', 'Invalid credentials': 'Неверный email или пароль',
    'Email already registered': 'Этот email уже зарегистрирован', 'Invalid email': 'Неверный email',
    'Password must be at least 8 characters': 'Пароль должен быть не короче 8 символов',
    'Email and password required': 'Введите email и пароль',
  },
};
const t = (k) => T[lang][k] || k;
const $ = (id) => document.getElementById(id);
const STAFF = ['admin', 'editor'];
let role = null;
let mode = 'login';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function show(view) {
  $('gate').hidden = view !== 'gate';
  $('auth').hidden = view !== 'auth';
  $('panel').hidden = view === 'me';
  $('intro').hidden = view === 'me';
  $('me').hidden = view !== 'me';
  $('logout').hidden = view !== 'me';
}

function field(name, type, label, extra = {}) {
  const lab = el('label', null, label);
  const inp = el('input');
  inp.name = name;
  inp.type = type;
  inp.required = name !== 'name';
  Object.assign(inp, extra);
  lab.append(inp);
  return lab;
}

function renderAuth() {
  $('authTitle').textContent = t(role);
  $('err').textContent = '';
  $('adminNote').hidden = role !== 'admin';
  const tabs = $('tabs');
  tabs.replaceChildren();
  if (role === 'athlete') {
    ['login', 'register'].forEach((m) => {
      const b = el('button', 'chip', t(m));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(mode === m));
      b.onclick = () => { mode = m; renderAuth(); };
      tabs.append(b);
    });
  } else {
    mode = 'login';
  }
  const f = $('form');
  f.replaceChildren();
  if (mode === 'register') f.append(field('name', 'text', t('name'), { autocomplete: 'name' }));
  f.append(field('email', 'email', t('email'), { autocomplete: 'username' }));
  f.append(field('password', 'password', mode === 'register' ? t('password_hint') : t('password'), {
    autocomplete: mode === 'register' ? 'new-password' : 'current-password', minLength: mode === 'register' ? 8 : 0,
  }));
  const ok = el('button', 'btn', t(mode));
  ok.type = 'submit';
  f.append(ok);
}

document.querySelectorAll('[data-role]').forEach((b) => {
  b.onclick = () => { role = b.dataset.role; mode = 'login'; renderAuth(); show('auth'); };
});
$('back').onclick = () => show('gate');

// The role choice only changes this page. The server decides who is an admin.
$('form').onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = { email: fd.get('email'), password: fd.get('password') };
  if (mode === 'register') body.name = fd.get('name') || '';
  try {
    const r = await fetch('/api/auth/' + mode, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.message || r.status);
    if (role === 'admin' && !STAFF.includes(d.user.role)) throw new Error('NOT_ADMIN');
    localStorage.setItem('token', d.token);
    location.href = role === 'admin' ? 'admin.html' : '/';
  } catch (err) {
    $('err').textContent = t(err.message);
  }
};

function logout() {
  localStorage.removeItem('token');
  show('gate');
}
$('logout').onclick = logout;

function card(i, title, text, href) {
  const c = el(href ? 'a' : 'div', 'cardx' + (href ? '' : ' soon'));
  if (href) c.href = href;
  c.style.setProperty('--i', i);
  c.append(el('h3', null, title), el('p', null, text));
  return c;
}

async function showMe() {
  const token = localStorage.getItem('token');
  if (!token) return show('gate');
  try {
    const r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error(r.status);
    const u = await r.json();
    const label = u.name || u.email;
    $('avatar').textContent = label[0].toUpperCase();
    $('meName').textContent = label;
    $('meMail').textContent = u.email;
    $('meRole').textContent = t(u.role);
    const cards = $('cards');
    cards.replaceChildren();
    let i = 0;
    if (STAFF.includes(u.role)) cards.append(card(i++, t('card_admin'), t('card_admin_d'), 'admin.html'));
    cards.append(card(i++, t('card_home'), t('card_home_d'), '/'));
    cards.append(card(i++, t('card_comps'), t('soon')), card(i++, t('card_res'), t('soon')));
    $('logout').textContent = t('logout');
    show('me');
  } catch {
    logout();
  }
}

document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
$('logout').textContent = t('logout');
show('gate');
showMe();
