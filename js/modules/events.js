import { storage } from './storage.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatDateInput(date);
}

// Datos de demostración. Reemplaza estas fechas/valores por eventos reales antes de producción.
export const events = [
  { id: 1, title: '[EVENTO DEMO — PASADO]', date: dateOffset(-9), time: '20:00', venue: '[LUGAR]', city: '[CIUDAD]', status: 'available' },
  { id: 2, title: '[EVENTO DEMO — HOY]', date: dateOffset(0), time: '19:30', venue: '[LUGAR]', city: '[CIUDAD]', status: 'available' },
  { id: 3, title: '[EVENTO DEMO — PRÓXIMO]', date: dateOffset(3), time: '21:00', venue: '[LUGAR]', city: '[CIUDAD]', status: 'available' },
  { id: 4, title: '[EVENTO DEMO — ESTE MES]', date: dateOffset(12), time: '20:30', venue: '[LUGAR]', city: '[CIUDAD]', status: 'available' },
  { id: 5, title: '[EVENTO DEMO — FUTURO]', date: dateOffset(35), time: '20:00', venue: '[LUGAR]', city: '[CIUDAD]', status: 'available' }
];

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
  detail.textContent = `${formatDate(event.date)} · ${event.time} · ${event.venue} · ${event.city}`;

  content.append(stateLabel, title, detail);
  article.append(dateBox, content);
  return article;
}

function nearestUpcomingEventId() {
  const today = startOfToday();
  return [...events]
    .filter((event) => parseLocalDate(event.date) >= today)
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date))[0]?.id ?? null;
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
  const buttons = [...document.querySelectorAll('[data-event-filter]')];

  if (!list || !heading || !count || !buttons.length) return;

  const labels = {
    today: 'Eventos de hoy',
    week: 'Eventos de esta semana',
    month: 'Eventos de este mes',
    upcoming: 'Próximos eventos',
    past: 'Eventos pasados',
    all: 'Todos los eventos'
  };

  const render = (filter = 'upcoming') => {
    const nearestId = nearestUpcomingEventId();
    const filtered = [...events]
      .filter((event) => matchesFilter(event, filter))
      .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));

    list.replaceChildren();
    heading.textContent = labels[filter];
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'evento' : 'eventos'}`;

    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No hay eventos de demostración para este filtro.';
      list.append(empty);
      return;
    }

    filtered.forEach((event) => list.append(createEventCard(event, nearestId)));
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.eventFilter;
      storage.set('event_preferences', { filter });
      render(filter);
    });
  });

  const savedFilter = storage.get('event_preferences', { filter: 'upcoming' })?.filter;
  const initial = labels[savedFilter] ? savedFilter : 'upcoming';

  buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.eventFilter === initial));
  render(initial);
  initBooking();
}
