
export default class HomePage {
    constructor(params = {}) {
        this.params = params;
        this.api = null;

        this.state = {
            pessoas: [],
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            itemsPerPage: 10,
            filters: {
                nome: '',
                sexo: '',
                status: '',
                faixaIdadeInicial: '',
                faixaIdadeFinal: ''
            },
            isLoading: false,
            error: null
        };
    }

    async render(container) {
        this.container = container;

        try {
            await this.loadDependencies();
            this.renderInitialLayout();
            this.setupEventListeners();
            await this.loadStatistics();
            await this.loadData();
        } catch (error) {
            this.renderError(error.message);
        }
    }

    async loadDependencies() {
        try {
            const apiModule = await import('../services/api.js');
            // Use MockApiService para desenvolvimento
            // this.api = new apiModule.MockApiService();
            // Para produção: 
            this.api = new apiModule.ApiService();
           
        } catch (error) {
            throw error;
        }
    }

    renderInitialLayout() {
        this.container.innerHTML = `
            <div class="space-y-8">
                <!-- Hero Section -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
                        Sistema de Pessoas Desaparecidas
                    </h1>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                        Sistema da Polícia Judiciária Civil do Estado de Mato Grosso para localização de pessoas desaparecidas. 
                        Sua informação pode fazer a diferença.
                    </p>
                    
                    <!-- Statistics -->
                    <div class="flex justify-center space-x-8 text-gray-600">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-800" id="hero-missing-count">-</div>
                            <div class="text-sm">Desaparecidas</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-800" id="hero-found-count">-</div>
                            <div class="text-sm">Localizadas</div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="bg-white rounded-2xl p-6 mb-8 shadow-md border border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                        <div class="md:col-span-4">
                            <input 
                                type="text" 
                                id="search-input" 
                                placeholder="Buscar por nome..." 
                                class="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div class="md:col-span-2">
                            <select id="gender-filter" class="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none">
                                <option value="">Todos os Sexos</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <select id="status-filter" class="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none">
                                <option value="">Todos os Status</option>
                                <option value="DESAPARECIDO">Desaparecidos</option>
                                <option value="LOCALIZADO">Localizados</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <input 
                                type="number" 
                                id="age-min" 
                                placeholder="Idade min" 
                                min="0" 
                                max="150"
                                class="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div class="md:col-span-2">
                            <input 
                                type="number" 
                                id="age-max" 
                                placeholder="Idade max" 
                                min="0" 
                                max="150"
                                class="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <button id="clear-filters" class="text-blue-600 hover:text-blue-800 text-sm transition-colors font-medium">
                            Limpar filtros
                        </button>
                        <div class="text-gray-500 text-sm" id="search-status">
                            Use os filtros para refinar sua busca
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="loading-state" class="hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        ${Array.from({ length: 8 }, () => this.renderSkeletonCard()).join('')}
                    </div>
                </div>

                <!-- Results Section -->
                <div id="results-section" class="hidden">
                    <!-- Stats Bar -->
                    <div class="bg-white rounded-2xl p-6 mb-8 shadow-md border border-gray-200">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div class="flex items-center space-x-6 mb-4 md:mb-0">
                                <div class="flex items-center space-x-2">
                                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span class="text-gray-800 font-medium">Desaparecidos</span>
                                    <span id="missing-count" class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">0</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span class="text-gray-800 font-medium">Localizados</span>
                                    <span id="found-count" class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">0</span>
                                </div>
                            </div>
                            <div class="text-gray-600">
                                <span id="results-info">Carregando...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Cards Grid -->
                    <div id="cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    </div>

                    <!-- Pagination -->
                    <div id="pagination-container" class="flex justify-center">
                    </div>
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="hidden">
                    <div class="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-md border border-gray-200">
                        <svg class="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">Nenhum resultado encontrado</h3>
                        <p class="text-gray-600 mb-6">Tente ajustar os filtros de busca ou limpar os filtros para ver mais resultados.</p>
                        <button id="clear-filters-btn" class="btn-primary text-white px-6 py-3 rounded-lg">
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                <!-- Error State -->
                <div id="error-state" class="hidden">
                    <div class="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-md border border-gray-200">
                        <svg class="w-24 h-24 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar dados</h3>
                        <p id="error-message" class="text-gray-600 mb-6">Ocorreu um erro ao buscar as informações.</p>
                        <button id="retry-btn" class="btn-primary text-white px-6 py-3 rounded-lg">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderSkeletonCard() {
        return `
            <div class="bg-white rounded-2xl overflow-hidden animate-pulse shadow-md border border-gray-200">
                <div class="h-64 w-full bg-gray-200"></div>
                <div class="p-6 space-y-3">
                    <div class="h-6 w-3/4 bg-gray-200 rounded"></div>
                    <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div class="h-4 w-full bg-gray-200 rounded"></div>
                    <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const genderFilter = document.getElementById('gender-filter');
        const statusFilter = document.getElementById('status-filter');
        const ageMin = document.getElementById('age-min');
        const ageMax = document.getElementById('age-max');
        const clearFilters = document.getElementById('clear-filters');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        const retryBtn = document.getElementById('retry-btn');

        let searchTimeout;
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 500);
        });

        genderFilter?.addEventListener('change', (e) => {
            this.handleFilterChange({ sexo: e.target.value });
        });

        statusFilter?.addEventListener('change', (e) => {
            this.handleFilterChange({ status: e.target.value });
        });

        ageMin?.addEventListener('change', (e) => {
            this.handleFilterChange({ faixaIdadeInicial: e.target.value });
        });

        ageMax?.addEventListener('change', (e) => {
            this.handleFilterChange({ faixaIdadeFinal: e.target.value });
        });

        [clearFilters, clearFiltersBtn]?.forEach(btn => {
            btn?.addEventListener('click', () => {
                this.clearFilters();
            });
        });

        retryBtn?.addEventListener('click', () => {
            this.loadData();
        });
    }

    async loadStatistics() {
        try {
            const stats = await this.api.getEstatisticas();
            document.getElementById('hero-missing-count').textContent = stats.quantPessoasDesaparecidas || 0;
            document.getElementById('hero-found-count').textContent = stats.quantPessoasEncontradas || 0;
        } catch (error) {
            console.warn('Erro ao carregar estatísticas:', error);
        }
    }

    async loadData() {
        try {
            this.setState({ isLoading: true, error: null });
            this.showLoadingState();

            document.getElementById('search-status').textContent = 'Buscando...';

            const params = {
                pagina: this.state.currentPage,
                porPagina: this.state.itemsPerPage,
                ...this.getApiFilters()
            };

            const response = await this.api.getPessoas(params);

            this.setState({
                pessoas: response.content || [],
                totalPages: response.totalPages || 0,
                totalElements: response.totalElements || 0,
                isLoading: false
            });

            this.renderResults();

        } catch (error) {
            this.setState({
                isLoading: false,
                error: error.message || 'Erro desconhecido'
            });
            this.showErrorState(error.message);
        }
    }

    getApiFilters() {
        const filters = {};
        debugger;
        if (this.state.filters.nome) filters.nome = this.state.filters.nome;
        if (this.state.filters.sexo) filters.sexo = this.state.filters.sexo;
        if (this.state.filters.status) filters.status = this.state.filters.status;
        if (this.state.filters.faixaIdadeInicial) filters.faixaIdadeInicial = parseInt(this.state.filters.faixaIdadeInicial);
        if (this.state.filters.faixaIdadeFinal) filters.faixaIdadeFinal = parseInt(this.state.filters.faixaIdadeFinal);

        return filters;
    }

    renderResults() {
        debugger;
        if (this.state.pessoas.length === 0) {
            this.showEmptyState();
            return;
        }

        this.showResultsState();
        this.renderStats();
        this.renderCards();
        this.renderPagination();
    }

    renderStats() {
        const currentMissing = this.state.pessoas.filter(pessoa => !pessoa.vivo).length;
        const currentFound = this.state.pessoas.filter(pessoa => pessoa.vivo).length;

        document.getElementById('missing-count').textContent = currentMissing;
        document.getElementById('found-count').textContent = currentFound;

        const startItem = this.state.currentPage * this.state.itemsPerPage + 1;
        const endItem = Math.min(
            (this.state.currentPage + 1) * this.state.itemsPerPage,
            this.state.totalElements
        );

        document.getElementById('results-info').textContent =
            `Exibindo ${startItem}-${endItem} de ${this.state.totalElements} resultado(s)`;

        const hasFilters = Object.values(this.state.filters).some(filter => filter);
        document.getElementById('search-status').textContent =
            hasFilters ? 'Filtros aplicados' : 'Mostrando todos os resultados';
    }

    renderCards() {
        const cardsGrid = document.getElementById('cards-grid');
        cardsGrid.innerHTML = '';

        this.state.pessoas.forEach((pessoa, index) => {
            const card = this.createPersonCard(pessoa, index);
            cardsGrid.appendChild(card);
        });
    }

    createPersonCard(pessoa, index) {
        const card = document.createElement('div');
        const isFound = pessoa.vivo === true;
        const ultimaOcorrencia = pessoa.ultimaOcorrencia || {};
        const entrevista = ultimaOcorrencia.ocorrenciaEntrevDesapDTO || {};
        const isUrgent = entrevista.informacao && entrevista.informacao.includes('URGENTE');

        card.className = 'bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200';
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';

        card.innerHTML = `
            <div class="relative h-64 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                ${pessoa.urlFoto ?
                `<img src="${pessoa.urlFoto}" alt="${pessoa.nome}" class="w-full h-full object-cover">` :
                `<span class="text-white text-6xl font-bold">${pessoa.nome.charAt(0).toUpperCase()}</span>`
            }
                
                <div class="absolute top-3 right-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${isFound ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }">
                        ${isFound ? 'Localizado' : 'Desaparecido'}
                    </span>
                </div>
                
                ${isUrgent ? `
                    <div class="absolute top-3 left-3">
                        <span class="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full animate-pulse">
                            URGENTE
                        </span>
                    </div>
                ` : ''}
            </div>
            
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2 truncate" title="${pessoa.nome}">
                    ${pessoa.nome}
                </h3>
                
                <div class="flex items-center text-gray-600 mb-3">
                    <span>${pessoa.idade} anos • ${pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}</span>
                </div>
                
                <div class="flex items-center text-gray-600 mb-4">
                    <span class="truncate" title="${ultimaOcorrencia.localDesaparecimentoConcat || 'Local não informado'}">
                        ${ultimaOcorrencia.localDesaparecimentoConcat || 'Local não informado'}
                    </span>
                </div>
                
                <div class="text-sm text-gray-500 mb-4">
                    <span>
                        ${isFound ? 'Localizado' : 'Desaparecido'} em ${this.formatDateShort(
                isFound ? ultimaOcorrencia.dataLocalizacao : ultimaOcorrencia.dtDesaparecimento
            )}
                    </span>
                </div>
                
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Ver Detalhes
                </button>
            </div>
        `;

        card.addEventListener('click', () => {
            if (window.router) {
                window.router.navigate(`/pessoa/${pessoa.id}`);
            } else {
                console.error('Router não disponível');
            }
        });

        return card;
    }

    renderPagination() {

        const paginationContainer = document.getElementById('pagination-container');

        if (this.state.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        const { currentPage, totalPages } = this.state;
        const pages = [];

        const showPages = 5;
        const startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
        const endPage = Math.min(totalPages - 1, startPage + showPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <button 
                    class="pagination-btn px-4 py-2 mx-1 rounded-lg transition-colors ${i === currentPage
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }" 
                    data-page="${i}"
                >
                    ${i + 1}
                </button>
            `);
        }

        paginationContainer.innerHTML = `
            <div class="flex items-center justify-center space-x-2 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <button 
                    class="pagination-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    data-page="prev" 
                    ${currentPage === 0 ? 'disabled' : ''}
                >
                    Anterior
                </button>
                
                ${startPage > 0 ? `
                    <button class="pagination-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" data-page="0">1</button>
                    ${startPage > 1 ? '<span class="text-gray-500 px-2">...</span>' : ''}
                ` : ''}
                
                ${pages.join('')}
                
                ${endPage < totalPages - 1 ? `
                    ${endPage < totalPages - 2 ? '<span class="text-gray-500 px-2">...</span>' : ''}
                    <button class="pagination-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" data-page="${totalPages - 1}">${totalPages}</button>
                ` : ''}
                
                <button 
                    class="pagination-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    data-page="next" 
                    ${currentPage === totalPages - 1 ? 'disabled' : ''}
                >
                    Próximo
                </button>
            </div>
        `;

        paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.getAttribute('data-page');

                if (page === 'prev' && currentPage > 0) {
                    this.handlePageChange(currentPage - 1);
                } else if (page === 'next' && currentPage < totalPages - 1) {
                    this.handlePageChange(currentPage + 1);
                } else if (page !== 'prev' && page !== 'next') {
                    this.handlePageChange(parseInt(page));
                }
            });
        });
    }

    handleSearch(searchTerm) {
        this.setState({
            filters: { ...this.state.filters, nome: searchTerm },
            currentPage: 0
        });
        this.loadData();
    }

    handleFilterChange(filters) {
        this.setState({
            filters: { ...this.state.filters, ...filters },
            currentPage: 0
        });
        this.loadData();
    }

    handlePageChange(page) {
        this.setState({ currentPage: page });
        this.loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearFilters() {
        this.setState({
            filters: { nome: '', sexo: '', status: '', faixaIdadeInicial: '', faixaIdadeFinal: '' },
            currentPage: 0
        });

        document.getElementById('search-input').value = '';
        document.getElementById('gender-filter').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('age-min').value = '';
        document.getElementById('age-max').value = '';

        this.loadData();
    }

    formatDateShort(dateString) {
        if (!dateString) return 'data não informada';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'ontem';
        } else if (diffDays <= 7) {
            return `${diffDays} dias atrás`;
        } else if (diffDays <= 30) {
            const weeks = Math.ceil(diffDays / 7);
            return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
        } else if (diffDays <= 365) {
            const months = Math.ceil(diffDays / 30);
            return `${months} mês${months > 1 ? 'es' : ''} atrás`;
        } else {
            const years = Math.ceil(diffDays / 365);
            return `${years} ano${years > 1 ? 's' : ''} atrás`;
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    showLoadingState() {
        document.getElementById('loading-state')?.classList.remove('hidden');
        document.getElementById('results-section')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');
        document.getElementById('error-state')?.classList.add('hidden');
    }

    showResultsState() {
        document.getElementById('loading-state')?.classList.add('hidden');
        document.getElementById('results-section')?.classList.remove('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');
        document.getElementById('error-state')?.classList.add('hidden');
    }

    showEmptyState() {
        document.getElementById('loading-state')?.classList.add('hidden');
        document.getElementById('results-section')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.remove('hidden');
        document.getElementById('error-state')?.classList.add('hidden');
    }

    showErrorState(message) {
        document.getElementById('loading-state')?.classList.add('hidden');
        document.getElementById('results-section')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');
        document.getElementById('error-state')?.classList.remove('hidden');

        if (message) {
            const errorMsg = document.getElementById('error-message');
            if (errorMsg) errorMsg.textContent = message;
        }
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-md border border-gray-200">
                    <svg class="w-24 h-24 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01"></path>
                    </svg>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar página</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <button onclick="location.reload()" class="btn-primary text-white px-6 py-3 rounded-lg">
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    }

    destroy() {
    }
}