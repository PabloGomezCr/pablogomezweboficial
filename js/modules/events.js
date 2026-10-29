import { storage } from './storage.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Agenda confirmada.
export const events = [
  { id: 2, title: 'Chante de Fanny', date: '2026-10-29', time: '21:00', venue: 'Chante de Fanny', city: 'Puntarenas', status: 'available' },
  { id: 3, title: 'Jorcos', date: '2026-10-30', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 4, title: 'La Casa del Camarón (Halloween Party)', date: '2026-10-31', time: '22:00', venue: 'La Casa del Camarón', city: 'Puntarenas', status: 'available' },
  { id: 5, title: 'Olga Party', date: '2026-11-05', time: '18:00', city: 'Puntarenas', status: 'available' },
  { id: 6, title: 'Jorcos', date: '2026-11-06', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 7, title: 'El Cerrito', date: '2026-11-07', time: '22:00', venue: 'Hacienda El Cerrito', city: 'Puntarenas', status: 'available' },
  { id: 8, title: 'Fiesta privada', date: '2026-11-08', time: '17:00', venue: 'La Previa', city: 'Puntarenas', status: 'available' },
  { id: 9, title: 'Jorcos', date: '2026-11-13', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 15, title: 'Jorcos', date: '2026-11-14', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 10, title: 'Jorcos', date: '2026-11-20', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 11, title: 'Jorcos', date: '2026-11-27', time: '22:00', venue: 'Jorcos', city: 'Puntarenas', status: 'available' },
  { id: 12, title: 'Fiesta privada', date: '2026-11-28', time: '17:00', city: 'Puntarenas', status: 'available' },
  { id: 13, title: 'La Danta', date: '2026-11-28', time: '22:00', venue: 'La Danta', city: 'Puntarenas', status: 'available' },
  { id: 14, title: 'Fiesta privada', date: '2026-11-29', allDay: true, city: 'San José', status: 'available' }
];

function compareEvents(a, b) {
  return a.date.localeCompare(b.date) || (a.time || '24:00').localeCompare(b.time || '24:00');
}

function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfWeek(date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parseLocalDate(value));
}

function eventState(event, nearestUpcomingId) {
  const date = parseLocalDate(event.date);
  const today = startOfToday();

  if (isSameDay(date, today)) return 'today';
  if (date < today) return 'past';
  if (event.id === nearestUpcomingId) return 'next';
  return 'future';
}

function matchesFilter(event, filter) {
  const date = parseLocalDate(event.date);
  const today = startOfToday();

  switch (filter) {
    case 'today':
      return isSameDay(date, today);
    case 'week':
      return date >= startOfWeek(today) && date <= endOfWeek(today);
    case 'month':
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    case 'past':
      return date < today;
    case 'all':
      return true;
    case 'upcoming':
    default:
      return date >= today;
  }
}

function createEventCard(event, nearestUpcomingId) {
  const article = document.createElement('article');
  const state = eventState(event, nearestUpcomingId);
  article.className = `event-card is-${state}`;

  const dateBox = document.createElement('div');
  dateBox.className = 'event-date';
  const date = parseLocalDate(event.date);
  const day = document.createElement('strong');
  day.textContent = pad(date.getDate());
  const month = document.createElement('span');
  month.textContent = new Intl.DateTimeFormat('es-CR', { month: 'short' }).format(date).toUpperCase();
  dateBox.append(day, month);

  const content = document.createElement('div');
  content.className = 'event-info';

  const stateLabel = document.createElement('span');
  stateLabel.className = 'event-state';
  stateLabel.textContent = state === 'past' ? 'Finalizado' : state === 'today' ? 'Hoy' : state === 'next' ? 'Próximo' : 'Disponible';

  const title = document.createElement('h3');
  title.textContent = event.title;

  const detail = document.createElement('p');
  detail.textContent = [formatDate(event.date), event.allDay ? 'Todo el día' : event.time || 'Hora por confirmar', event.venue, event.city]
    .filter(Boolean).join(' · ');

  content.append(stateLabel, title, detail);
  article.append(dateBox, content);
  return article;
}

function nearestUpcomingEventId() {
  const today = startOfToday();
  return [...events]
    .filter((event) => parseLocalDate(event.date) >= today)
    .sort(compareEvents)[0]?.id ?? null;
}

function setStatus(node, message, type = '') {
  node.textContent = message;
  node.className = `form-status ${type}`.trim();
}

function isOccupied(dateValue) {
  return events.some((event) => event.date === dateValue);
}

function initBooking() {
  const form = document.querySelector('#booking-form');
  const dateInput = document.querySelector('#booking-date');
  const status = document.querySelector('#booking-status');
  if (!form || !dateInput || !status) return;

  dateInput.min = formatDateInput(new Date());

  dateInput.addEventListener('change', () => {
    if (!dateInput.value) {
      setStatus(status, '');
      return;
    }

    const selected = parseLocalDate(dateInput.value);
    if (selected < startOfToday()) {
      setStatus(status, 'La fecha seleccionada ya pasó.', 'is-error');
      return;
    }

    if (isOccupied(dateInput.value)) {
      setStatus(status, 'Fecha ocupada. Selecciona otra fecha.', 'is-error');
      return;
    }

    setStatus(status, 'Fecha disponible para solicitud.', 'is-success');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const selectedDate = String(data.get('date'));

    if (parseLocalDate(selectedDate) < startOfToday()) {
      setStatus(status, 'No se pueden solicitar fechas pasadas.', 'is-error');
      return;
    }

    if (isOccupied(selectedDate)) {
      setStatus(status, 'Fecha ocupada. Selecciona otra fecha.', 'is-error');
      return;
    }

    const request = {
      id: Date.now(),
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(),
      phone: String(data.get('phone')).trim(),
      eventType: String(data.get('eventType')).trim(),
      date: selectedDate,
      city: String(data.get('city')).trim(),
      venue: String(data.get('venue')).trim(),
      attendance: Number(data.get('attendance')),
      message: String(data.get('message')).trim(),
      createdAt: new Date().toISOString()
    };

    const requests = storage.get('booking_requests', []);
    storage.set('booking_requests', [...requests, request]);

    form.reset();
    dateInput.min = formatDateInput(new Date());
    setStatus(status, 'Solicitud guardada en este navegador. Prototipo sin envío a servidor.', 'is-success');
  });
}

export function initEvents() {
  const list = document.querySelector('#events-list');
  const heading = document.querySelector('#events-heading');
  const count = document.querySelector('#event-count');
  const pagination = document.querySelector('#events-pagination');
  const buttons = [...document.querySelectorAll('[data-event-filter]')];

  if (!list || !heading || !count || !pagination || !buttons.length) return;

  const labels = {
    today: 'Eventos de hoy',
    week: 'Eventos de esta semana',
    month: 'Eventos de este mes',
    upcoming: 'Próximos eventos',
    past: 'Eventos pasados',
    all: 'Todos los eventos'
  };

  let activeFilter = 'upcoming';
  let currentPage = 1;
  const pageSize = 4;

  const render = (filter = 'upcoming') => {
    const nearestId = nearestUpcomingEventId();
    const filtered = [...events]
      .filter((event) => matchesFilter(event, filter))
      .sort(compareEvents);

    list.replaceChildren();
    pagination.replaceChildren();
    const pageCount = Math.ceil(filtered.length / pageSize);
    currentPage = Math.max(1, Math.min(currentPage, pageCount));
    heading.textContent = labels[filter];
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'evento' : 'eventos'}`;

    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No hay eventos para este filtro.';
      list.append(empty);
      return;
    }

    filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .forEach((event) => list.append(createEventCard(event, nearestId)));

    for (let page = 1; page <= pageCount; page += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(page);
      button.setAttribute('aria-label', `Página ${page}`);
      button.setAttribute('aria-controls', 'events-list');
      if (page === currentPage) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => {
        currentPage = page;
        render(activeFilter);
        pagination.querySelector('[aria-current="page"]')?.focus();
      });
      pagination.append(button);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.eventFilter;
      activeFilter = filter;
      currentPage = 1;
      storage.set('event_preferences', { filter });
      render(filter);
    });
  });

  const savedFilter = storage.get('event_preferences', { filter: 'upcoming' })?.filter;
  const initial = labels[savedFilter] ? savedFilter : 'upcoming';
  activeFilter = initial;

  buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.eventFilter === initial));
  render(initial);
  initBooking();

  let renderedDay = formatDateInput(new Date());
  let dayTimer;

  const refreshDay = () => {
    const now = new Date();
    const currentDay = formatDateInput(now);
    if (currentDay !== renderedDay) {
      renderedDay = currentDay;
      render(activeFilter);
      const dateInput = document.querySelector('#booking-date');
      if (dateInput) dateInput.min = currentDay;
    }

    window.clearTimeout(dayTimer);
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    dayTimer = window.setTimeout(refreshDay, midnight.getTime() - now.getTime() + 100);
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshDay();
  });
  window.addEventListener('focus', refreshDay);
  window.addEventListener('pageshow', refreshDay);
  refreshDay();
}
