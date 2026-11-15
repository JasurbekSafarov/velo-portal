const lang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'kz';
const T = {
  kz: {
    login: 'Кіру', register: 'Тіркелу', name: 'Аты-жөні', email: 'Email', password: 'Құпия сөз',
    password_hint: 'Құпия сөз (кемінде 8 таңба)', title: 'Жеке кабинет', hello: 'Сәлем', logout: 'Шығу',
    admin_link: 'Админ-панель', athlete: 'Спортшы', admin: 'Әкімші', editor: 'Редактор', role: 'Рөл',
    'Invalid credentials': 'Email немесе құпия сөз қате', 'Email already registered': 'Бұл email бұрын тіркелген',
    'Invalid email': 'Email қате жазылған', 'Password must be at least 8 characters': 'Құпия сөз кемінде 8 таңба болуы керек',
    'Email and password required': 'Email мен құпия сөзді енгізіңіз',
  },
  ru: {
    login: 'Войти', register: 'Регистрация', name: 'Имя', email: 'Email', password: 'Пароль',
    password_hint: 'Пароль (не менее 8 символов)', title: 'Личный кабинет', hello: 'Здравствуйте', logout: 'Выйти',
    admin_link: 'Админ-панель', athlete: 'Спортсмен', admin: 'Администратор', editor: 'Редактор', role: 'Роль',
    'Invalid credentials': 'Неверный email или пароль', 'Email already registered': 'Этот email уже зарегистрирован',
    'Invalid email': 'Неверный email', 'Password must be at least 8 characters': 'Пароль должен быть не короче 8 символов',
    'Email and password required': 'Введите email и пароль',
  },
};
const t = (k) => T[lang][k] || k;
const $ = (id) => document.getElementById(id);
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

let mode = 'login';

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
  const tabs = $('tabs');
  tabs.replaceChildren();
  ['login', 'register'].forEach((m) => {
    const b = el('button', 'chip', t(m));
    b.type = 'button';
    b.setAttribute('aria-pressed', String(mode === m));
    b.onclick = () => { mode = m; $('err').textContent = ''; renderAuth(); };
    tabs.append(b);
  });
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
    localStorage.setItem('token', d.token);
    location.href = '/';
  } catch (err) {
    $('err').textContent = t(err.message);
  }
};

function logout() {
  localStorage.removeItem('token');
  $('me').hidden = true;
  $('logout').hidden = true;
  $('auth').hidden = false;
  renderAuth();
}
$('logout').onclick = logout;

async function showMe() {
  const token = localStorage.getItem('token');
  if (!token) return logout();
  try {
    const r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error(r.status);
    const u = await r.json();
    $('meTitle').textContent = t('title');
    $('meName').textContent = `${t('hello')}, ${u.name || u.email}`;
    $('meMail').textContent = u.email;
    $('meRole').textContent = `${t('role')}: ${t(u.role)}`;
    const staff = ['admin', 'editor'].includes(u.role);
    $('adminLink').hidden = !staff;
    $('adminLink').textContent = t('admin_link');
    $('logout').textContent = t('logout');
    $('auth').hidden = true;
    $('me').hidden = false;
    $('logout').hidden = false;
  } catch {
    logout();
  }
}

document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
renderAuth();
showMe();
