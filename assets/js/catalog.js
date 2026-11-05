(() => {
  const grid = document.querySelector('#horse-grid'); if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('[data-horse-card]'));
  const search = document.querySelector('#search-horse');
  const level = document.querySelector('#filter-level');
  const sex = document.querySelector('#filter-sex');
  const sort = document.querySelector('#sort-horses');
  const counter = document.querySelector('#result-count');
  const clear = document.querySelector('#clear-filters');
  const empty = document.querySelector('#empty-result');
  const onlyFavorites = document.querySelector('#only-favorites');
  const normalize = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let favoriteOnly = false;
  let favorites;
  try { favorites = new Set(JSON.parse(localStorage.getItem('cowboy-favoritos') || '[]')); }
  catch { favorites = new Set(); }
  function save() { try { localStorage.setItem('cowboy-favoritos', JSON.stringify([...favorites])); } catch {} }
  function updateFavorites() {
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      const active = favorites.has(btn.dataset.favorite);
      btn.setAttribute('aria-pressed', String(active));
      btn.textContent = active ? '♥' : '♡';
      btn.title = active ? 'Quitar de favoritos' : 'Guardar en favoritos';
    });
    onlyFavorites.setAttribute('aria-pressed', String(favoriteOnly));
    onlyFavorites.innerHTML = `${favoriteOnly ? '♥' : '♡'} Ver favoritos <span id="favorite-count">${favorites.size}</span>`;
    // Mantener la referencia a la nueva etiqueta tras actualizar el botón.
  }
  function apply(){
    const q = normalize(search.value.trim());
    let count=0;
    cards.forEach(card => {
      const match = normalize(card.dataset.name).includes(q) && (level.value === 'all'|| card.dataset.level === level.value) && (sex.value === 'all' || card.dataset.sex === sex.value) && (!favoriteOnly || favorites.has(card.querySelector('[data-favorite]').dataset.favorite));
      card.hidden = !match; if(match) count++;
    });
    const sorted = cards.slice().sort((a,b)=>{
      if(sort.value==='name')return a.dataset.name.localeCompare(b.dataset.name,'es');
      if(sort.value==='young')return Number(a.dataset.age)-Number(b.dataset.age);
      if(sort.value==='old')return Number(b.dataset.age)-Number(a.dataset.age);
      return Number(a.dataset.order)-Number(b.dataset.order);
    });
    sorted.forEach(card=>grid.appendChild(card));
    counter.textContent=`Mostrando ${count} ${count === 1?'caballo':'caballos'}`;
    clear.hidden=!(q || level.value!=='all' || sex.value!=='all' || sort.value!=='featured' || favoriteOnly);
    empty.hidden = count>0;
    updateFavorites();
  }
  function reset(){search.value='';level.value='all';sex.value='all';sort.value='featured';favoriteOnly=false;apply();search.focus();}
  [search,level,sex,sort].forEach(x=>x.addEventListener(x===search?'input':'change',apply));
  clear.addEventListener('click',reset);
  document.querySelector('#empty-reset')?.addEventListener('click',reset);
  document.querySelectorAll('[data-favorite]').forEach(btn => btn.addEventListener('click', () => {
    if(favorites.has(btn.dataset.favorite))favorites.delete(btn.dataset.favorite);
    else favorites.add(btn.dataset.favorite);
    save();apply();
  }));
  onlyFavorites.addEventListener('click',()=>{favoriteOnly=!favoriteOnly;apply();});
  apply();
})();
