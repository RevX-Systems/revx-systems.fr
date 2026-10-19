/* REVX V5 — défilement natif + aimant CSS et proximité visuelle des panneaux. */
(() => {
  'use strict';
  const panels = [...document.querySelectorAll('.magnetic-panel')];
  if (!panels.length) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mainNav = [...document.querySelectorAll('.desktop-nav a[data-nav]')];
  const usable = () => window.innerWidth > 760 && !motion.matches;
  const visualGap = 80;
  let queued = false;

  function measure(panel) {
    const rect = panel.getBoundingClientRect();
    const transform = getComputedStyle(panel).transform;
    const matrix = transform === 'none' ? null : new DOMMatrixReadOnly(transform);
    // Retirer uniquement notre translation : les centres du flux restent stables.
    return {panel,rect,center:(rect.top + rect.bottom) / 2 - (matrix?.m42 || 0),
      height:rect.height / (matrix?.m11 || 1)};
  }

  function render() {
    queued = false;
    const center = window.innerHeight * .51;
    const activeZone = document.querySelector('.chapter-stage').getBoundingClientRect();
    const metrics = panels.map(measure);
    const closest = metrics.reduce((best, item) => {
      const d = Math.abs(item.center - center);
      return !best || d < best.distance ? {panel:item.panel,distance:d} : best;
    }, null);
    const enabled = usable();
    const states = metrics.map(item => {
      const distance = Math.abs(item.center - center);
      // Le panneau centré est net et à échelle réelle; les voisins restent visibles en profondeur.
      const reach = Math.max(window.innerHeight * .80, item.rect.height * 1.04);
      const focus = Math.max(0,1 - distance / reach);
      return {...item,focus,scale:enabled ? Number((.88 + .12*focus).toFixed(4)) : 1,shift:0};
    });
    if (enabled) {
      const offsets = [0];
      for (let i = 1; i < states.length; i++) {
        const previous = states[i-1], current = states[i];
        const layoutGap = current.center - previous.center - (previous.height + current.height) / 2;
        const shrink = (1-previous.scale)*previous.height/2 + (1-current.scale)*current.height/2;
        offsets[i] = offsets[i-1] + visualGap - layoutGap - shrink;
      }
      // Interpoler entre les centres du flux évite tout saut au changement d'actif.
      // Au centre de chaque panneau, sa translation cible vaut exactement zéro.
      let anchor = offsets[0];
      for (let i = 1; i < states.length; i++) {
        const progress = Math.max(0,Math.min(1,(center-states[i-1].center) / (states[i].center-states[i-1].center)));
        anchor = offsets[i-1] + (offsets[i]-offsets[i-1])*progress;
        if (center <= states[i].center) break;
      }
      states.forEach((state,i) => { state.shift = offsets[i] - anchor; });
    }
    states.forEach(({panel,focus,scale,shift}) => {
      // Translation et échelle partagent la même transition CSS : les écarts restent réguliers.
      panel.style.setProperty('--magnet-scale', String(scale));
      panel.style.setProperty('--magnet-shift', shift.toFixed(4)+'px');
      panel.style.setProperty('--magnet-dim', enabled ? (.60 + .40*focus).toFixed(4) : '1');
      panel.style.setProperty('--magnet-blur', enabled ? (1.5*(1-focus)).toFixed(2)+'px' : '0px');
      panel.classList.toggle('is-active', panel===closest.panel && enabled);
    });
    const inZone = activeZone.top < center && activeZone.bottom > center;
    if (inZone) mainNav.forEach(link => link.classList.toggle('active',link.dataset.nav===closest.panel.id));
  }
  function schedule() {if (!queued){queued=true;requestAnimationFrame(render);}}
  function scrollToPanel(target, behavior) {
    // Viser le centre du flux, où la compensation visuelle s'annule une fois centré.
    const destination = measure(target).center + window.scrollY - window.innerHeight * .51;
    window.scrollTo({top:Math.max(0,destination),behavior});
  }
  // Anchor navigation from header / hero lands the selected panel in the center.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const id = link.getAttribute('href').slice(1);
    if (!panels.some(panel => panel.id === id)) return;
    link.addEventListener('click', event => {
      if (!usable()) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      history.pushState(null,'','#'+id);
      scrollToPanel(target, 'smooth');
    });
  });
  // Deep link from contact page or a shared URL.
  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (panels.some(panel => panel.id === id)) {
      window.addEventListener('load', () => {
        if (!usable()) return;
        const target = document.getElementById(id);
        scrollToPanel(target, 'instant');
      },{once:true});
    }
  }
  document.documentElement.classList.add('magnet-ready');
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  motion.addEventListener?.('change',schedule);
  schedule();
})();
