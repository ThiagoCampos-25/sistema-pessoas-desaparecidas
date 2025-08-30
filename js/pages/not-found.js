
export default class NotFoundPage {
    constructor(params = {}) {
        this.params = params;
        this.container = null;
        this.keydownHandler = null;
    }

    async render(container) {
        this.container = container;
        
        container.innerHTML = `
            <div class="min-h-[70vh] flex items-center justify-center px-4">
                <div class="bg-white rounded-2xl p-8 md:p-12 text-center max-w-lg w-full shadow-lg border border-gray-200">
                    <div class="mb-8">
                        <div class="relative mb-8">
                            <!-- Ícone de fundo -->
                            <div class="w-32 h-32 mx-auto mb-6 relative">
                                <div class="absolute inset-0 bg-blue-100 rounded-full"></div>
                                <div class="relative w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                                    <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.045-5.709-2.573M15 17h.01M9 17h.01M12 3C9.348 3 7.138 5.21 7.138 7.862c0 2.652 2.21 4.862 4.862 4.862s4.862-2.21 4.862-4.862C16.862 5.21 14.652 3 12 3z"></path>
                                    </svg>
                                </div>
                                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">?</span>
                                </div>
                            </div>
                        </div>
                        
                        <h1 class="text-6xl font-bold mb-4 text-blue-800">
                            404
                        </h1>
                        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
                        <p class="text-gray-600 text-lg leading-relaxed mb-8">
                            A página que você está procurando não existe ou foi movida. 
                            Verifique se o endereço está correto ou use uma das opções abaixo.
                        </p>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Botão principal -->
                        <button 
                            id="go-home"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 w-full sm:w-auto inline-flex items-center justify-center shadow-md"
                        >
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            Voltar ao Início
                        </button>
                        
                        <!-- Opções secundárias -->
                        <div class="border-t border-gray-200 pt-6">
                            <p class="text-sm text-gray-500 mb-4">Ou você pode:</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button 
                                    id="search-people"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200 inline-flex items-center justify-center border border-gray-300"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    Buscar pessoas
                                </button>
                                <button 
                                    id="go-back"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200 inline-flex items-center justify-center border border-gray-300"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Página anterior
                                </button>
                            </div>
                        </div>
                        
                        <!-- Links úteis -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                            <a href="#" data-route="/sobre" class="text-blue-600 hover:text-blue-800 text-sm transition-colors inline-flex items-center justify-center py-2">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Sobre o sistema
                            </a>
                            <a href="#" data-route="/estatisticas" class="text-blue-600 hover:text-blue-800 text-sm transition-colors inline-flex items-center justify-center py-2">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                Ver estatísticas
                            </a>
                        </div>
                        
                        <!-- Dica para usuários -->
                        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div class="text-sm">
                                    <p class="font-semibold text-blue-800 mb-1">Procurando por uma pessoa específica?</p>
                                    <p class="text-blue-700">
                                        Use a busca na página principal ou verifique se o ID da pessoa está correto. 
                                        Você também pode navegar pelas categorias disponíveis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Informação adicional -->
                        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 text-left">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                                <div class="text-sm">
                                    <p class="font-semibold text-orange-800 mb-1">Em caso de emergência</p>
                                    <p class="text-orange-700">
                                        Ligue imediatamente 190 (PM) ou 197 (Polícia Civil). 
                                        Este sistema é para consulta e colaboração cidadã.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.bindEvents();
    }

    bindEvents() {

        const goHomeBtn = document.getElementById('go-home');

        const searchBtn = document.getElementById('search-people');

        const goBackBtn = document.getElementById('go-back');        
        
        goHomeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToHome();
        });
        
        searchBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToHome();
        });
        
        goBackBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateBack();
        });

               this.keydownHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.navigateToHome();
            } else if (e.key === 'Enter') {
                // Enter para ir ao início
                e.preventDefault();
                this.navigateToHome();
            }
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }

    navigateToHome() {

        if (window.router) {
            window.router.navigate('/');
        } else {
           
            window.location.href = '/';
        }
    }

    navigateBack() {

        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateToHome();
        }
    }

    destroy() {
       
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }        
      
        const buttons = ['go-home', 'search-people', 'go-back'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.removeEventListener('click', this.handleClick);
            }
        });
    }
}