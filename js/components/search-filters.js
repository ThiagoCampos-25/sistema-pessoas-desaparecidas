// js/components/search-filters.js - Componente para filtros de busca
export class SearchFilters {
    constructor(options = {}) {
        this.onSearch = options.onSearch || (() => { });
        this.onFilterChange = options.onFilterChange || (() => { });
        this.container = null;

        this.searchTimeout = null;
        this.searchDelay = 500; // ms

        this.filters = {
            nome: '',
            sexo: '',
            status: ''
        };
    }

    async render(container) {
        this.container = container;

        container.innerHTML = `
            <div class="glass rounded-3xl p-6 mb-8">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-white text-center mb-2">
                        Buscar Pessoas
                    </h2>
                    <p class="text-white/80 text-center">
                        Use os filtros abaixo para encontrar informações específicas
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search Input -->
                    <div class="lg:col-span-2">
                        <label for="search-input" class="block text-sm font-semibold text-white mb-2">
                            Nome da Pessoa
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input 
                                id="search-input"
                                type="text" 
                                placeholder="Digite o nome para buscar..." 
                                class="w-full pl-12 pr-4 py-3 bg-white/90 border-2 border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 font-medium"
                                autocomplete="off"
                            >
                            <div id="search-loading" class="absolute right-3 top-1/2 transform -translate-y-1/2 hidden">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status Filter -->
                    <div>
                        <label for="status-filter" class="block text-sm font-semibold text-white mb-2">
                            Status
                        </label>
                        <select 
                            id="status-filter"
                            class="w-full py-3 px-4 bg-white/90 border-2 border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 font-medium"
                        >
                            <option value="">Todos os status</option>
                            <option value="DESAPARECIDO">Desaparecido</option>
                            <option value="LOCALIZADO">Localizado</option>
                        </select>
                    </div>
                    
                    <!-- Gender Filter -->
                    <div>
                        <label for="gender-filter" class="block text-sm font-semibold text-white mb-2">
                            Sexo
                        </label>
                        <select 
                            id="gender-filter"
                            class="w-full py-3 px-4 bg-white/90 border-2 border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 font-medium"
                        >
                            <option value="">Todos os sexos</option>
                            <option value="MASCULINO">Masculino</option>
                            <option value="FEMININO">Feminino</option>
                        </select>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                        id="clear-filters"
                        class="flex-1 glass text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Limpar Filtros
                    </button>
                    
                    <div class="flex-1 flex gap-2">
                        <button 
                            id="quick-filter-missing"
                            class="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                            title="Filtrar apenas desaparecidos"
                        >
                            Desaparecidos
                        </button>
                        <button 
                            id="quick-filter-found"
                            class="flex-1 bg-green-500/80 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                            title="Filtrar apenas localizados"
                        >
                            Localizados
                        </button>
                    </div>
                </div>
                
                <!-- Search Stats -->
                <div id="search-stats" class="mt-4 text-center text-white/70 text-sm hidden">
                    <span id="stats-text"></span>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {

        const searchInput = document.getElementById('search-input');

        const statusFilter = document.getElementById('status-filter');

        const genderFilter = document.getElementById('gender-filter');

        const clearButton = document.getElementById('clear-filters');

        const quickFilterMissing = document.getElementById('quick-filter-missing');
        
        const quickFilterFound = document.getElementById('quick-filter-found');
        
        searchInput?.addEventListener('input', (e) => {
            const value = e.target.value.trim();

            this.showSearchLoading(!!value);

            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.filters.nome = value;
                this.onSearch(value);
                this.hideSearchLoading();
            }, this.searchDelay);
        });
       
        statusFilter?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.onFilterChange({ status: e.target.value });
            this.updateQuickFilterStates();
        });

       
        genderFilter?.addEventListener('change', (e) => {
            this.filters.sexo = e.target.value;
            this.onFilterChange({ sexo: e.target.value });
        });

       
        clearButton?.addEventListener('click', () => {
            this.clearFilters();
        });

        quickFilterMissing?.addEventListener('click', () => {
            this.setQuickFilter('DESAPARECIDO');
        });

        quickFilterFound?.addEventListener('click', () => {
            this.setQuickFilter('LOCALIZADO');
        });


        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(this.searchTimeout);
                const value = e.target.value.trim();
                this.filters.nome = value;
                this.onSearch(value);
                this.hideSearchLoading();
            }
        });
    }

    setQuickFilter(status) {
        this.filters.status = status;
        document.getElementById('status-filter').value = status;
        this.onFilterChange({ status });
        this.updateQuickFilterStates();
    }

    updateQuickFilterStates() {

        const missingBtn = document.getElementById('quick-filter-missing');

        const foundBtn = document.getElementById('quick-filter-found');

        missingBtn?.classList.remove('bg-red-600', 'ring-2', 'ring-white');
        foundBtn?.classList.remove('bg-green-600', 'ring-2', 'ring-white');


        if (this.filters.status === 'DESAPARECIDO') {
            missingBtn?.classList.add('bg-red-600', 'ring-2', 'ring-white');
        } else if (this.filters.status === 'LOCALIZADO') {
            foundBtn?.classList.add('bg-green-600', 'ring-2', 'ring-white');
        }
    }

    clearFilters() {

        this.filters = { nome: '', sexo: '', status: '' };

        const searchInput = document.getElementById('search-input');

        const statusFilter = document.getElementById('status-filter');

        const genderFilter = document.getElementById('gender-filter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = '';
        if (genderFilter) genderFilter.value = '';

        this.updateQuickFilterStates();
        this.hideSearchStats();
        this.hideSearchLoading();

        this.onSearch('');
        this.onFilterChange({ nome: '', sexo: '', status: '' });
    }

    showSearchLoading(show = true) {

        const loadingIndicator = document.getElementById('search-loading');

        if (loadingIndicator) {
            loadingIndicator.classList.toggle('hidden', !show);
        }
    }

    hideSearchLoading() {
        this.showSearchLoading(false);
    }

    showSearchStats(text) {

        const statsElement = document.getElementById('search-stats');

        const statsText = document.getElementById('stats-text');

        if (statsElement && statsText) {
            statsText.textContent = text;
            statsElement.classList.remove('hidden');
        }
    }

    hideSearchStats() {

        const statsElement = document.getElementById('search-stats');

        if (statsElement) {
            statsElement.classList.add('hidden');
        }
    }

    getFilters() {
        return { ...this.filters };
    }

    setFilters(newFilters) {

        this.filters = { ...this.filters, ...newFilters };

        const searchInput = document.getElementById('search-input');
        const statusFilter = document.getElementById('status-filter');
        const genderFilter = document.getElementById('gender-filter');

        if (searchInput && newFilters.nome !== undefined) {
            searchInput.value = newFilters.nome;
        }
        if (statusFilter && newFilters.status !== undefined) {
            statusFilter.value = newFilters.status;
        }
        if (genderFilter && newFilters.sexo !== undefined) {
            genderFilter.value = newFilters.sexo;
        }

        this.updateQuickFilterStates();
    }

    updateResultsCount(count, total) {
        if (count === total) {
            this.hideSearchStats();
        } else {
            this.showSearchStats(`Mostrando ${count} de ${total} resultados`);
        }
    }

    destroy() {
        clearTimeout(this.searchTimeout);
        this.container = null;
    }
}