(() => {
  'use strict';
  const projects = {
    forme: { title: 'FORME', category: 'Айдентика · Упаковка', image: 'forme', description: 'Концепция кофейного бренда о простом ежедневном ритуале. Задача: соединить характер небольшой обжарочной и ясность современной упаковки.', solution: 'Мягкий словесный знак, глубокий зеленый и открытая типографическая система. Информационная этикетка помогает различать сорта, а единая композиция связывает пачки, стаканы и печатные материалы.' },
    '083': { title: '083', category: 'Культурная айдентика · Постеры', image: '083', description: 'Визуальное исследование города в движении. Отправная точка: маршрут как способ читать пространство, замечать ритмы и находить новые связи.', solution: 'Крупные сжатые цифры становятся главным графическим элементом. Линия маршрута проходит через плакаты и собирает отдельные листы в одну композицию. Красный акцент сохраняет читаемость на расстоянии.' },
    kontur: { title: 'КОНТУР', category: 'Арт-дирекшн · Веб-дизайн', image: 'contour', description: 'Концепция сайта архитектурной практики. Пространство, в котором проекты можно рассмотреть спокойно: без конкурирующего декора и лишнего интерфейса.', solution: 'Строгая сетка, крупные фотографии и точная типографическая иерархия. Навигация уступает место архитектуре, а сдержанная палитра поддерживает фактуры камня, бетона и зелени.' },
    field: { title: 'FIELD', category: 'Редакционный дизайн · Арт-дирекшн', image: 'field', description: 'Авторская концепция независимого издания о форме, материале и визуальной культуре. Каждый разворот работает как небольшая выставка.', solution: 'Чередование плотных и свободных полос задает ритм чтения. Контрастная типографика и насыщенный синий связывают фотографию, предметные композиции и большие белые поля.' }
  };
  const grid = document.querySelector('.project-grid');
  const filters = document.querySelector('.filters');
  const cards = [...document.querySelectorAll('.project')];
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = category !== 'all' && !card.dataset.category.split(' ').includes(category); });
    grid.classList.toggle('is-filtered', category !== 'all');
    document.querySelector('#filter-status').textContent = `Показано проектов: ${cards.filter(card => !card.hidden).length}.`;
  });
  const dialog = document.querySelector('#project-dialog');
  let opener;
  document.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof dialog.showModal !== 'function') return;
      const project = projects[link.dataset.project];
      if (!project) return;
      event.preventDefault();
      opener = link;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-description').textContent = project.description;
      document.querySelector('#dialog-solution').textContent = project.solution;
      const image = document.querySelector('#dialog-image');
      image.src = `assets/studio/${project.image}.webp`;
      image.alt = link.querySelector('img').alt;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  document.querySelector('.contact-action').addEventListener('click', () => { document.querySelector('#brief').open = true; });
  document.querySelector('#brief-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = ['name', 'contact', 'task'].map(key => String(data.get(key) || '').trim());
    const status = document.querySelector('#brief-status');
    if (values.some(value => !value)) {
      status.textContent = 'Заполните имя, контакт и описание задачи. Поля не должны состоять только из пробелов.';
      return;
    }
    const content = `22:18 / Бриф проекта\n\nИмя: ${values[0]}\nКонтакт: ${values[1]}\n\nЗадача:\n${values[2]}\n`;
    const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
    const download = document.createElement('a');
    download.href = url;
    download.download = '22-18-brief.txt';
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Бриф подготовлен для скачивания. Сохраните файл, чтобы вернуться к задаче позже.';
  });
})();
