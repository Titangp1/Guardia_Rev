/* Guardia_Rev · Améliorations UX progressives (Palette Ctrl+K, raccourcis étude, copie de code) */
(function () {
  'use strict';

  const NAV_ITEMS = [
    { title: 'Tableau de bord', sub: 'Vue globale, XP, série et progression', url: 'index.html', tag: 'Page' },
    { title: 'Matières', sub: 'Programme complet GCS1 par UE', url: 'matieres.html', tag: 'Page' },
    { title: 'Cours', sub: 'Fiches synthétiques et schémas', url: 'cours.html', tag: 'Page' },
    { title: 'QCM', sub: 'Questions corrigées par matière', url: 'qcm.html', tag: 'Page' },
    { title: 'Cartes mémoire', sub: 'Répétition espacée active', url: 'cartes.html', tag: 'Page' },
    { title: 'Exercices', sub: 'Mises en situation type partiel', url: 'exercices.html', tag: 'Page' },
    { title: 'Entraînements', sub: 'Sessions rapides ciblées', url: 'entrainements.html', tag: 'Page' },
    { title: 'Révisions du jour', sub: 'Programme quotidien recommandé', url: 'revisions.html', tag: 'Page' },
    { title: 'Partiel blanc', sub: 'Examen chronométré en conditions réelles', url: 'partiel.html', tag: 'Examen' },
    { title: 'Lexique', sub: 'Définitions cyber, réseau et DevSecOps', url: 'lexique.html', tag: 'Page' },
    { title: 'Défis 1v1', sub: 'Affronter un étudiant Guardia', url: 'defis.html', tag: 'Social' },
    { title: 'Classement', sub: 'Tableau général XP', url: 'classement.html', tag: 'Social' },
    { title: 'Mon profil', sub: 'Avatar, pseudo et statistiques', url: 'profil.html', tag: 'Compte' }
  ];

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  /* 1. Barre de progression de lecture + bouton retour en haut */
  function initScrollEnhancements() {
    const bar = document.createElement('div');
    bar.id = 'gr-ux-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    const stack = document.createElement('div');
    stack.className = 'gr-ux-fab-stack';

    const topBtn = document.createElement('button');
    topBtn.id = 'gr-ux-top';
    topBtn.type = 'button';
    topBtn.className = 'gr-ux-fab';
    topBtn.title = 'Revenir en haut de la page';
    topBtn.innerHTML = '↑ <span class="gr-ux-fab-label">Haut</span>';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const cmdBtn = document.createElement('button');
    cmdBtn.type = 'button';
    cmdBtn.className = 'gr-ux-fab';
    cmdBtn.title = 'Recherche rapide (Ctrl+K ou /)';
    cmdBtn.innerHTML = '⌘ <span class="gr-ux-fab-label">Recherche</span> <kbd>Ctrl+K</kbd>';

    stack.appendChild(topBtn);
    stack.appendChild(cmdBtn);
    document.body.appendChild(stack);

    function updateScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 140) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
        bar.style.width = pct.toFixed(1) + '%';
        bar.classList.add('is-visible');
      } else {
        bar.classList.remove('is-visible');
      }
      topBtn.classList.toggle('is-visible', window.scrollY > 340);
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    return { cmdBtn };
  }

  /* 2. Bouton Copier sur les blocs <pre> */
  function enhanceCodeBlocks(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll('pre').forEach((pre) => {
      if (pre.dataset.grCopyReady === '1') return;
      pre.dataset.grCopyReady = '1';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gr-ux-copy-btn';
      btn.textContent = 'Copier';
      btn.setAttribute('aria-label', 'Copier ce bloc de code');

      btn.addEventListener('click', async () => {
        const codeNode = pre.querySelector('code');
        const text = (codeNode ? codeNode.innerText : pre.innerText).replace(/\n$/, '');
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copié ✓';
          btn.classList.add('is-copied');
          setTimeout(() => {
            btn.textContent = 'Copier';
            btn.classList.remove('is-copied');
          }, 1600);
        } catch (_) {
          btn.textContent = 'Erreur';
          setTimeout(() => {
            btn.textContent = 'Copier';
          }, 1400);
        }
      });

      pre.appendChild(btn);
    });
  }

  /* 3. Palette de commandes rapide (Ctrl+K) + Modale aide (?) */
  function initModals(cmdTriggerBtn) {
    // Construction de l'index de recherche (Pages + Fiches de cours si présentes)
    const entries = [...NAV_ITEMS];
    const subjects = (window.GR && Array.isArray(window.GR.subjects)) ? window.GR.subjects : [];
    subjects.forEach((subj) => {
      entries.push({
        title: subj.name,
        sub: subj.short || subj.exam || 'Matière GCS1',
        url: 'cours.html#' + encodeURIComponent(subj.id),
        tag: subj.icon || 'Matière'
      });
      (subj.fiche || []).forEach((f) => {
        if (f && f.t) {
          entries.push({
            title: f.t,
            sub: 'Fiche · ' + subj.name,
            url: 'cours.html#' + encodeURIComponent(subj.id),
            tag: 'Cours'
          });
        }
      });
    });

    // Backdrop Palette
    const backdrop = document.createElement('div');
    backdrop.className = 'gr-ux-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="gr-ux-modal" role="dialog" aria-modal="true" aria-label="Recherche rapide Guardia_Rev">
        <div class="gr-ux-modal-head">
          <span aria-hidden="true">🔍</span>
          <input type="search" class="gr-ux-search-input" placeholder="Aller à une page, une matière ou une fiche de cours…" autocomplete="off" />
          <kbd>Échap</kbd>
        </div>
        <div class="gr-ux-modal-list" role="listbox"></div>
        <div class="gr-ux-modal-foot">
          <span>↑↓ Naviguer · ↵ Ouvrir</span>
          <span>Appuyez sur <kbd>?</kbd> pour les raccourcis d'étude</span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Backdrop Aide Raccourcis
    const helpBackdrop = document.createElement('div');
    helpBackdrop.className = 'gr-ux-backdrop';
    helpBackdrop.hidden = true;
    helpBackdrop.innerHTML = `
      <div class="gr-ux-modal" role="dialog" aria-modal="true" aria-label="Raccourcis clavier">
        <div class="gr-ux-modal-head">
          <strong style="flex:1">Raccourcis clavier Guardia_Rev</strong>
          <kbd>Échap</kbd>
        </div>
        <div class="gr-ux-shortcuts-grid">
          <span>Ouvrir la recherche rapide</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd> ou <kbd>/</kbd></span>
          <span>Afficher cette aide</span><span><kbd>?</kbd></span>
          <span><strong>Cartes :</strong> retourner la carte</span><span><kbd>Espace</kbd></span>
          <span><strong>Cartes / QCM :</strong> choisir une option</span><span><kbd>1</kbd> à <kbd>4</kbd></span>
          <span><strong>QCM :</strong> question suivante</span><span><kbd>Entrée</kbd></span>
        </div>
      </div>
    `;
    document.body.appendChild(helpBackdrop);

    const input = backdrop.querySelector('.gr-ux-search-input');
    const list = backdrop.querySelector('.gr-ux-modal-list');
    let filtered = entries.slice(0, 12);
    let activeIdx = 0;

    function normalize(str) {
      return String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    function renderList() {
      list.innerHTML = '';
      if (!filtered.length) {
        const empty = document.createElement('div');
        empty.style.padding = '18px';
        empty.style.textAlign = 'center';
        empty.style.color = 'var(--ink-2)';
        empty.textContent = 'Aucun résultat trouvé.';
        list.appendChild(empty);
        return;
      }
      filtered.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gr-ux-item' + (idx === activeIdx ? ' is-active' : '');
        btn.setAttribute('role', 'option');
        btn.innerHTML = `
          <div>
            <div class="gr-ux-item-title"></div>
            <div class="gr-ux-item-sub"></div>
          </div>
          <span class="gr-ux-badge"></span>
        `;
        btn.querySelector('.gr-ux-item-title').textContent = item.title;
        btn.querySelector('.gr-ux-item-sub').textContent = item.sub;
        btn.querySelector('.gr-ux-badge').textContent = item.tag;
        btn.addEventListener('mouseenter', () => {
          activeIdx = idx;
          list.querySelectorAll('.gr-ux-item').forEach((el, i) => {
            el.classList.toggle('is-active', i === activeIdx);
          });
        });
        btn.addEventListener('click', () => {
          window.location.href = item.url;
        });
        list.appendChild(btn);
      });
    }

    function openPalette() {
      helpBackdrop.hidden = true;
      backdrop.hidden = false;
      input.value = '';
      filtered = entries.slice(0, 14);
      activeIdx = 0;
      renderList();
      requestAnimationFrame(() => input.focus());
    }

    function closeAll() {
      backdrop.hidden = true;
      helpBackdrop.hidden = true;
    }

    input.addEventListener('input', () => {
      const q = normalize(input.value.trim());
      if (!q) {
        filtered = entries.slice(0, 14);
      } else {
        filtered = entries
          .filter((it) => normalize(it.title + ' ' + it.sub + ' ' + it.tag).includes(q))
          .slice(0, 18);
      }
      activeIdx = 0;
      renderList();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filtered.length) {
          activeIdx = (activeIdx + 1) % filtered.length;
          renderList();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filtered.length) {
          activeIdx = (activeIdx - 1 + filtered.length) % filtered.length;
          renderList();
        }
      } else if (e.key === 'Enter' && filtered[activeIdx]) {
        e.preventDefault();
        window.location.href = filtered[activeIdx].url;
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAll();
    });
    helpBackdrop.addEventListener('click', (e) => {
      if (e.target === helpBackdrop) closeAll();
    });
    cmdTriggerBtn.addEventListener('click', openPalette);

    return {
      openPalette,
      openHelp: () => {
        backdrop.hidden = true;
        helpBackdrop.hidden = false;
      },
      closeAll,
      isOpen: () => !backdrop.hidden || !helpBackdrop.hidden
    };
  }

  /* 4. Raccourcis clavier contextuels (Cartes & QCM) */
  function handleStudyShortcuts(e, modals) {
    if (e.key === 'Escape' && modals.isOpen()) {
      e.preventDefault();
      modals.closeAll();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modals.isOpen() ? modals.closeAll() : modals.openPalette();
      return;
    }

    if (isTypingTarget(document.activeElement) || modals.isOpen()) return;

    if (e.key === '/') {
      e.preventDefault();
      modals.openPalette();
      return;
    }

    if (e.key === '?') {
      e.preventDefault();
      modals.openHelp();
      return;
    }

    const page = document.body.dataset.page || '';
    const root = document.getElementById('root');
    if (!root) return;

    // Cartes : Espace retourne la carte, 1-4 note la difficulté
    if (page === 'cartes') {
      if (e.code === 'Space') {
        const flipBtn = [...root.querySelectorAll('button')].find((b) =>
          /retourner|afficher|réponse|révéler/i.test(b.textContent)
        );
        if (flipBtn) {
          e.preventDefault();
          flipBtn.click();
        }
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const rateBtns = [...root.querySelectorAll('button')].filter((b) =>
          /revoir|difficile|bien|facile|suivant/i.test(b.textContent)
        );
        const target = rateBtns[Number(e.key) - 1];
        if (target && !target.disabled) {
          e.preventDefault();
          target.click();
        }
      }
    }

    // QCM / Entraînements / Partiel / Défis : 1-4 choisit une option, Entrée valide/continue
    if (['qcm', 'entrainements', 'partiel', 'defis', 'revisions'].includes(page)) {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const options = [...root.querySelectorAll('button')].filter((b) => {
          const txt = b.textContent.trim();
          return txt.length > 0 && !/suivant|précédent|valider|quitter|recommencer|menu/i.test(txt) && b.closest('main, section, .card, [class*="opt"], [class*="quiz"]') !== null;
        });
        const choice = options[Number(e.key) - 1];
        if (choice && !choice.disabled) {
          e.preventDefault();
          choice.click();
        }
      } else if (e.key === 'Enter') {
        const nextBtn = [...root.querySelectorAll('button')].find((b) =>
          /question suivante|suivant|continuer|terminer/i.test(b.textContent)
        );
        if (nextBtn && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        }
      }
    }
  }

  function boot() {
    const { cmdBtn } = initScrollEnhancements();
    const modals = initModals(cmdBtn);
    document.addEventListener('keydown', (e) => handleStudyShortcuts(e, modals));

    const root = document.getElementById('root');
    if (root) {
      enhanceCodeBlocks(root);
      let scheduled = false;
      const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          enhanceCodeBlocks(root);
        });
      });
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
