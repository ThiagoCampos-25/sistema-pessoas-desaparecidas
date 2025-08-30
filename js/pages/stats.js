
export default class StatsPage {
    constructor(params = {}) {
        this.params = params;
        this.api = null;
        this.stats = null;
    }

    async render(container) {
        this.container = container;

        try {
            await this.loadDependencies();
            this.showLoading();
            await this.loadStats();
            this.renderStats();
        } catch (error) {
            this.renderError(error.message);
        }
    }

    async loadDependencies() {
        try {
            const apiModule = await import('../services/api.js');
            // this.api = new apiModule.MockApiService();
            // Para produção: 
            this.api = new apiModule.ApiService();
        } catch (error) {
            console.error('Erro ao carregar API:', error);
            throw error;
        }
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-gray-300 border-t-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-700 text-xl">Carregando estatísticas...</p>
                </div>
            </div>
        `;
    }

    async loadStats() {
        debugger;
        this.stats = await this.api.getEstatisticas();
    }

    renderStats() {
        debugger;
        const total = (this.stats.quantPessoasDesaparecidas || 0) + (this.stats.quantPessoasEncontradas || 0);
        const percentualEncontradas = total > 0 ? ((this.stats.quantPessoasEncontradas / total) * 100).toFixed(1) : 0;

        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-8">
                <!-- Breadcrumb -->
                <nav class="text-gray-600 text-sm mb-6">
                    <a href="#" data-route="/" class="hover:text-blue-700 transition-colors">Início</a>
                    <span class="mx-2">></span>
                    <span class="text-blue-800 font-medium">Estatísticas</span>
                </nav>

                <div class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Estatísticas</h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dados atualizados sobre pessoas desaparecidas em Mato Grosso.
                    </p>
                </div>

                <!-- Cards de Estatísticas -->
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-8 text-center shadow-md border border-red-200">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <div class="text-4xl font-bold text-red-600 mb-2">
                            ${this.stats.quantPessoasDesaparecidas || 0}
                        </div>
                        <div class="text-gray-800 text-lg font-medium">Pessoas Desaparecidas</div>
                        <div class="text-gray-500 text-sm mt-2">Casos ativos</div>
                    </div>

                    <div class="bg-white rounded-2xl p-8 text-center shadow-md border border-green-200">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="text-4xl font-bold text-green-600 mb-2">
                            ${this.stats.quantPessoasEncontradas || 0}
                        </div>
                        <div class="text-gray-800 text-lg font-medium">Pessoas Localizadas</div>
                        <div class="text-gray-500 text-sm mt-2">Casos resolvidos</div>
                    </div>

                    <div class="bg-white rounded-2xl p-8 text-center shadow-md border border-blue-200">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div class="text-4xl font-bold text-blue-600 mb-2">
                            ${total}
                        </div>
                        <div class="text-gray-800 text-lg font-medium">Total de Casos</div>
                        <div class="text-gray-500 text-sm mt-2">Todos os registros</div>
                    </div>
                </div>

                <!-- Gráfico de Taxa de Sucesso -->
                <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                    <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">Taxa de Localização</h2>
                    <div class="max-w-2xl mx-auto">
                        <div class="mb-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-700 font-medium">Pessoas Localizadas</span>
                                <span class="text-blue-800 font-bold">${percentualEncontradas}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div 
                                    class="h-4 bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-1000 ease-out"
                                    style="width: ${percentualEncontradas}%"
                                ></div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-6">
                            <p class="text-gray-700 text-lg">
                                <span class="font-bold text-green-600">${this.stats.quantPessoasEncontradas}</span> de 
                                <span class="font-bold text-blue-600">${total}</span> pessoas foram localizadas
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Informações dos Dados -->
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Atualizações em Tempo Real
                        </h3>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            Os dados são atualizados automaticamente conforme novos casos são registrados 
                            e pessoas são localizadas pela Polícia Civil de Mato Grosso.
                        </p>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Colaboração Cidadã
                        </h3>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            Você pode contribuir reportando informações sobre pessoas desaparecidas. 
                            Sua colaboração é fundamental para reunir famílias.
                        </p>
                    </div>
                </div>

                <!-- Call to Action -->
                <div class="bg-white rounded-2xl p-8 text-center shadow-md border border-blue-200">
                    <h3 class="text-xl font-bold text-blue-800 mb-4">Ajude a Salvar Vidas</h3>
                    <p class="text-gray-600 mb-6">
                        Cada informação pode fazer a diferença. Se você viu alguma das pessoas em nossa lista, 
                        não hesite em reportar.
                    </p>
                    <a href="#" data-route="/" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Ver Lista de Pessoas
                    </a>
                </div>

                <div class="text-center pt-8">
                    <a href="#" data-route="/" class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span>Voltar ao Início</span>
                    </a>
                </div>
            </div>
        `;
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="bg-white rounded-2xl p-8 text-center max-w-md mx-auto shadow-md border border-gray-200">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
                    </svg>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Erro ao carregar</h2>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <a href="#" data-route="/" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Voltar ao Início
                    </a>
                </div>
            </div>
        `;
    }

    destroy() {

    }
}