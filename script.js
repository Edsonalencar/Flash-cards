/* =============================================================
   Academic Hub Cards - Lógica da Aplicação
   Algoritmo SM-2 + Persistência via LocalStorage
   ============================================================= */

(() => {
    'use strict';

    // ---------- CONSTANTES ----------
    const STORAGE_KEY = 'academicHubCards_v1';
    const THEME_KEY = 'academicHubCards_theme';
    const DAILY_LIMIT = 20;
    const INTERVALS = {
        errei: 1,
        dificil: 2,
        bom: 4,
        facil: 7
    };

    // ---------- SEED INICIAL (exemplos educativos) ----------
    const SEED_CARDS = [
        {
            id: 'seed_1',
            pergunta: 'O que é a Curva do Esquecimento de Ebbinghaus?',
            resposta: 'Descoberta por Hermann Ebbinghaus (1885), demonstra que a retenção de informações decai exponencialmente com o tempo sem revisão. Revisões espaçadas achatam essa curva.',
            categoria: 'Metacognição',
            proximaRevisao: todayISO(),
            intervalo: 1
        },
        {
            id: 'seed_2',
            pergunta: 'Qual a complexidade do algoritmo de busca binária?',
            resposta: 'O(log n) — a cada iteração, o espaço de busca é reduzido pela metade.',
            categoria: 'Algoritmos',
            proximaRevisao: todayISO(),
            intervalo: 1
        },
        {
            id: 'seed_3',
            pergunta: 'Enuncie a Lei de Ohm.',
            resposta: 'V = R · I. A tensão (V) é proporcional à corrente (I), sendo a resistência (R) a constante de proporcionalidade.',
            categoria: 'Circuitos',
            proximaRevisao: todayISO(),
            intervalo: 1
        },
        {
            id: 'seed_4',
            pergunta: 'O que é o hoisting em JavaScript?',
            resposta: 'Mecanismo pelo qual declarações de variáveis (var) e funções são "içadas" para o topo de seu escopo durante a fase de compilação, antes da execução.',
            categoria: 'JavaScript',
            proximaRevisao: todayISO(),
            intervalo: 1
        }
    ];

    // ---------- ESTADO ----------
    let state = {
        cards: [],
        currentSession: [],
        currentIndex: 0,
        reviewedToday: [],
        lastResetDate: todayISO(),
        currentFilter: 'all',
        currentSearch: '',
        editingId: null
    };

    // ---------- UTILITÁRIOS DE DATA ----------
    function todayISO() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function addDays(isoDate, days) {
        const d = new Date(isoDate + 'T00:00:00');
        d.setDate(d.getDate() + days);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function daysUntil(isoDate) {
        const today = new Date(todayISO() + 'T00:00:00');
        const target = new Date(isoDate + 'T00:00:00');
        return Math.round((target - today) / (1000 * 60 * 60 * 24));
    }

    function formatDateLong(iso) {
        const d = new Date(iso + 'T00:00:00');
        return d.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }

    function formatNextReview(iso) {
        const diff = daysUntil(iso);
        if (diff < 0) return `Atrasado ${Math.abs(diff)}d`;
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Amanhã';
        if (diff < 7) return `em ${diff} dias`;
        if (diff < 30) return `em ${Math.floor(diff / 7)} sem.`;
        return `em ${Math.floor(diff / 30)} meses`;
    }

    // ---------- PERSISTÊNCIA ----------
    function save() {
        try {
            const payload = {
                cards: state.cards,
                reviewedToday: state.reviewedToday,
                lastResetDate: state.lastResetDate
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (err) {
            console.error('Erro ao salvar:', err);
            showToast('Erro ao salvar dados');
        }
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                // Primeira vez: carrega os cards de exemplo
                state.cards = [...SEED_CARDS];
                state.reviewedToday = [];
                state.lastResetDate = todayISO();
                save();
                return;
            }
            const data = JSON.parse(raw);
            state.cards = Array.isArray(data.cards) ? data.cards : [];
            state.reviewedToday = Array.isArray(data.reviewedToday) ? data.reviewedToday : [];
            state.lastResetDate = data.lastResetDate || todayISO();

            // Reset do contador diário se passou o dia
            if (state.lastResetDate !== todayISO()) {
                state.reviewedToday = [];
                state.lastResetDate = todayISO();
                save();
            }
        } catch (err) {
            console.error('Erro ao carregar:', err);
            state.cards = [];
            state.reviewedToday = [];
        }
    }

    // ---------- ALGORITMO SM-2 (simplificado) ----------
    function processReview(card, grade) {
        let novoIntervalo;
        if (grade === 'errei') {
            novoIntervalo = INTERVALS.errei;
        } else if (grade === 'dificil') {
            novoIntervalo = INTERVALS.dificil;
        } else if (grade === 'bom') {
            // Se já estava em revisão, multiplica; senão usa intervalo base
            novoIntervalo = card.intervalo >= INTERVALS.bom
                ? Math.round(card.intervalo * 2)
                : INTERVALS.bom;
        } else if (grade === 'facil') {
            novoIntervalo = card.intervalo >= INTERVALS.facil
                ? Math.round(card.intervalo * 2.5)
                : INTERVALS.facil;
        }
        card.intervalo = novoIntervalo;
        card.proximaRevisao = addDays(todayISO(), novoIntervalo);
        return card;
    }

    // ---------- SESSÃO DE ESTUDO ----------
    function getDueCards() {
        const today = todayISO();
        return state.cards
            .filter(c => c.proximaRevisao <= today && !state.reviewedToday.includes(c.id))
            .sort((a, b) => a.proximaRevisao.localeCompare(b.proximaRevisao))
            .slice(0, DAILY_LIMIT - state.reviewedToday.length);
    }

    function startSession() {
        state.currentSession = getDueCards();
        state.currentIndex = 0;
        renderStudyView();
    }

    // ---------- RENDERIZAÇÃO: ESTUDO ----------
    function renderStudyView() {
        const emptyState = document.getElementById('emptyState');
        const flashcard = document.getElementById('flashcard');
        const reviewActions = document.getElementById('reviewActions');
        const sessionDone = document.getElementById('sessionDone');

        // Atualiza métricas
        document.getElementById('metricDue').textContent = state.currentSession.length - state.currentIndex;
        document.getElementById('metricDone').textContent = state.reviewedToday.length;
        document.getElementById('metricLimit').textContent = DAILY_LIMIT;
        document.getElementById('currentDate').textContent = formatDateLong(todayISO());

        // Esconde todos
        emptyState.style.display = 'none';
        flashcard.style.display = 'none';
        reviewActions.style.display = 'none';
        sessionDone.style.display = 'none';

        // Nenhum card para hoje
        if (state.currentSession.length === 0) {
            if (state.reviewedToday.length > 0) {
                // Já terminou hoje
                sessionDone.style.display = 'block';
                document.getElementById('doneCount').textContent = state.reviewedToday.length;
            } else {
                emptyState.style.display = 'block';
            }
            return;
        }

        // Sessão completa
        if (state.currentIndex >= state.currentSession.length) {
            sessionDone.style.display = 'block';
            document.getElementById('doneCount').textContent = state.reviewedToday.length;
            return;
        }

        // Mostra o card atual
        const card = state.currentSession[state.currentIndex];
        flashcard.style.display = 'flex';
        flashcard.classList.remove('revealed');
        document.getElementById('cardCategory').textContent = card.categoria;
        document.getElementById('cardProgress').textContent = `${state.currentIndex + 1} / ${state.currentSession.length}`;
        document.getElementById('cardQuestion').textContent = card.pergunta;
        document.getElementById('cardAnswer').textContent = card.resposta;
    }

    function revealAnswer() {
        const flashcard = document.getElementById('flashcard');
        const reviewActions = document.getElementById('reviewActions');
        flashcard.classList.add('revealed');
        reviewActions.style.display = 'block';
    }

    function handleReview(grade) {
        const card = state.currentSession[state.currentIndex];
        if (!card) return;

        // Localiza o card real no state.cards e atualiza
        const realCard = state.cards.find(c => c.id === card.id);
        if (realCard) {
            processReview(realCard, grade);
        }

        state.reviewedToday.push(card.id);
        state.currentIndex++;
        save();

        // Próximo card ou fim
        renderStudyView();
    }

    // ---------- RENDERIZAÇÃO: BIBLIOTECA ----------
    function renderLibrary() {
        const grid = document.getElementById('cardsGrid');
        const empty = document.getElementById('libraryEmpty');

        // Atualiza chips de filtro
        renderFilterChips();
        renderDatalist();

        const filtered = filterCards();

        if (filtered.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        grid.innerHTML = filtered.map(card => `
            <article class="library-card" role="listitem">
                <div class="lc-header">
                    <span class="lc-category">${escapeHtml(card.categoria)}</span>
                    <div class="lc-actions">
                        <button class="lc-action-btn" data-action="edit" data-id="${card.id}" aria-label="Editar card" title="Editar">✎</button>
                        <button class="lc-action-btn delete" data-action="delete" data-id="${card.id}" aria-label="Excluir card" title="Excluir">✕</button>
                    </div>
                </div>
                <p class="lc-question">${escapeHtml(card.pergunta)}</p>
                <p class="lc-answer">${escapeHtml(card.resposta)}</p>
                <div class="lc-footer">
                    <span class="lc-interval">intervalo: ${card.intervalo}d</span>
                    <span class="lc-next ${daysUntil(card.proximaRevisao) <= 0 ? 'due' : ''}">${formatNextReview(card.proximaRevisao)}</span>
                </div>
            </article>
        `).join('');

        // Delegação de eventos
        grid.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id));
        });
        grid.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => deleteCard(e.currentTarget.dataset.id));
        });
    }

    function renderFilterChips() {
        const container = document.getElementById('filterChips');
        const categories = [...new Set(state.cards.map(c => c.categoria))].sort();

        let html = `<button class="chip ${state.currentFilter === 'all' ? 'active' : ''}" data-filter="all">Todos (${state.cards.length})</button>`;
        categories.forEach(cat => {
            const count = state.cards.filter(c => c.categoria === cat).length;
            html += `<button class="chip ${state.currentFilter === cat ? 'active' : ''}" data-filter="${escapeHtml(cat)}">${escapeHtml(cat)} (${count})</button>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                state.currentFilter = chip.dataset.filter;
                renderLibrary();
            });
        });
    }

    function renderDatalist() {
        const list = document.getElementById('categoriasList');
        const categories = [...new Set(state.cards.map(c => c.categoria))].sort();
        list.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join('');
    }

    function filterCards() {
        let result = state.cards;
        if (state.currentFilter !== 'all') {
            result = result.filter(c => c.categoria === state.currentFilter);
        }
        if (state.currentSearch) {
            const q = state.currentSearch.toLowerCase();
            result = result.filter(c =>
                c.pergunta.toLowerCase().includes(q) ||
                c.resposta.toLowerCase().includes(q) ||
                c.categoria.toLowerCase().includes(q)
            );
        }
        return result.sort((a, b) => a.proximaRevisao.localeCompare(b.proximaRevisao));
    }

    // ---------- RENDERIZAÇÃO: ESTATÍSTICAS ----------
    function renderStats() {
        const total = state.cards.length;
        const categories = [...new Set(state.cards.map(c => c.categoria))];
        const today = todayISO();
        const due = state.cards.filter(c => c.proximaRevisao <= today).length;
        const mastered = state.cards.filter(c => c.intervalo >= 7).length;
        const learning = total - mastered;

        document.getElementById('statTotal').textContent = total;
        document.getElementById('statCategories').textContent = categories.length;
        document.getElementById('statDue').textContent = due;
        document.getElementById('statMastered').textContent = mastered;
        document.getElementById('statLearning').textContent = learning;

        // Distribuição por categoria
        const list = document.getElementById('categoryList');
        if (categories.length === 0) {
            list.innerHTML = '<p style="color: var(--text-tertiary); font-style: italic; padding: 20px 0;">Nenhuma categoria ainda.</p>';
            return;
        }

        const catData = categories.map(cat => ({
            name: cat,
            count: state.cards.filter(c => c.categoria === cat).length
        })).sort((a, b) => b.count - a.count);

        const max = catData[0].count;

        list.innerHTML = catData.map(c => `
            <div class="category-row">
                <span class="cat-name">${escapeHtml(c.name)}</span>
                <div class="cat-bar">
                    <div class="cat-bar-fill" style="width: ${(c.count / max) * 100}%"></div>
                </div>
                <span class="cat-count">${c.count}</span>
            </div>
        `).join('');
    }

    // ---------- CRUD DE CARDS ----------
    function openModal(editId = null) {
        const overlay = document.getElementById('modalOverlay');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('cardForm');

        form.reset();
        state.editingId = editId;

        if (editId) {
            const card = state.cards.find(c => c.id === editId);
            if (!card) return;
            title.textContent = 'Editar card';
            document.getElementById('cardId').value = card.id;
            document.getElementById('inputCategoria').value = card.categoria;
            document.getElementById('inputPergunta').value = card.pergunta;
            document.getElementById('inputResposta').value = card.resposta;
        } else {
            title.textContent = 'Novo card';
        }

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => document.getElementById('inputCategoria').focus(), 100);
    }

    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        state.editingId = null;
    }

    function saveCard(event) {
        event.preventDefault();
        const categoria = document.getElementById('inputCategoria').value.trim();
        const pergunta = document.getElementById('inputPergunta').value.trim();
        const resposta = document.getElementById('inputResposta').value.trim();

        if (!categoria || !pergunta || !resposta) {
            showToast('Preencha todos os campos');
            return;
        }

        if (state.editingId) {
            const card = state.cards.find(c => c.id === state.editingId);
            if (card) {
                card.categoria = categoria;
                card.pergunta = pergunta;
                card.resposta = resposta;
                showToast('Card atualizado');
            }
        } else {
            const newCard = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                categoria,
                pergunta,
                resposta,
                proximaRevisao: todayISO(),
                intervalo: 1
            };
            state.cards.push(newCard);
            showToast('Card criado');
        }

        save();
        closeModal();
        startSession();
        renderLibrary();
        renderStats();
    }

    function deleteCard(id) {
        if (!confirm('Excluir este card permanentemente?')) return;
        state.cards = state.cards.filter(c => c.id !== id);
        state.reviewedToday = state.reviewedToday.filter(rid => rid !== id);
        state.currentSession = state.currentSession.filter(c => c.id !== id);
        save();
        showToast('Card excluído');
        renderLibrary();
        renderStats();
        startSession();
    }

    // ---------- NAVEGAÇÃO ENTRE VIEWS ----------
    function switchView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`view-${viewName}`).classList.add('active');
        document.querySelector(`.tab-btn[data-view="${viewName}"]`).classList.add('active');

        if (viewName === 'study') {
            startSession();
        } else if (viewName === 'manage') {
            renderLibrary();
        } else if (viewName === 'stats') {
            renderStats();
        }
    }

    // ---------- TEMA ----------
    function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
    }

    // ---------- TOAST ----------
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    // ---------- HELPERS ----------
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---------- EVENT LISTENERS ----------
    function attachEvents() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);

        // Reveal answer
        document.getElementById('revealBtn').addEventListener('click', revealAnswer);

        // Review buttons
        document.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', () => handleReview(btn.dataset.grade));
        });

        // Modal
        document.getElementById('openCreateBtn').addEventListener('click', () => openModal());
        document.getElementById('emptyCreateBtn').addEventListener('click', () => openModal());
        document.getElementById('modalClose').addEventListener('click', closeModal);
        document.getElementById('modalCancel').addEventListener('click', closeModal);
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') closeModal();
        });
        document.getElementById('cardForm').addEventListener('submit', saveCard);

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            state.currentSearch = e.target.value;
            renderLibrary();
        });

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            // ESC fecha modal
            if (e.key === 'Escape' && document.getElementById('modalOverlay').classList.contains('active')) {
                closeModal();
                return;
            }

            // Atalhos só na view de estudo, sem modal aberto, sem foco em input
            const activeView = document.querySelector('.view.active')?.id;
            const modalOpen = document.getElementById('modalOverlay').classList.contains('active');
            const inputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

            if (activeView !== 'view-study' || modalOpen || inputFocused) return;

            const flashcard = document.getElementById('flashcard');
            const revealed = flashcard.classList.contains('revealed');

            // Espaço revela
            if (e.key === ' ' && flashcard.style.display !== 'none' && !revealed) {
                e.preventDefault();
                revealAnswer();
                return;
            }

            // 1-4 avaliam a resposta
            if (revealed) {
                const grades = { '1': 'errei', '2': 'dificil', '3': 'bom', '4': 'facil' };
                if (grades[e.key]) {
                    e.preventDefault();
                    handleReview(grades[e.key]);
                }
            }
        });
    }

    // ---------- INICIALIZAÇÃO ----------
    function init() {
        initTheme();
        load();
        attachEvents();
        startSession();
        renderLibrary();
        renderStats();
    }

    // DOMContentLoaded ou já carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
