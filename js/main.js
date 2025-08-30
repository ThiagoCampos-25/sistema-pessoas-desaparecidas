
import { Router } from './core/router.js';

async function initApp() {
    try {
        console.log('Inicializando aplicação...');

        const router = new Router();

        router.addRoute('/', () => import('./pages/home.js'));
        router.addRoute('/pessoa/:id', () => import('./pages/detail.js'));
        router.addRoute('/sobre', () => import('./pages/about.js'));
        router.addRoute('/estatisticas', () => import('./pages/stats.js'));
        router.addRoute('/404', () => import('./pages/not-found.js'));

        router.setNotFoundRoute('/404');

        window.router = router;

        console.log('Rotas registradas:', Array.from(router.routes.keys()));

        await router.init();

        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                console.log('Navegando para:', route);
                router.navigate(route);
            }
        });

        window.addEventListener('popstate', () => {
            router.handlePopState();
        });

        console.log('Aplicação inicializada com sucesso!');

    } catch (error) {
        showCriticalError(error);
    }
}

function showCriticalError(error) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
                <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
                    </svg>
                    <h2 class="text-xl font-bold text-gray-900 mb-2">Erro de Inicialização</h2>
                    <p class="text-gray-600 mb-4">Não foi possível carregar a aplicação.</p>
                    <p class="text-sm text-gray-500 mb-4">${error.message}</p>
                    <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export { initApp };