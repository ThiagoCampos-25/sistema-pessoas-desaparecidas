export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentComponent = null;
        this.appContainer = document.getElementById('app');
        this.loadingManager = null;
        this.notFoundRoute = '/404'; 
    }

    addRoute(path, componentLoader) {
        this.routes.set(path, {
            loader: componentLoader,
            component: null,
            params: this.extractParams(path)
        });
    }

    setNotFoundRoute(path) {
        this.notFoundRoute = path;
    }

    extractParams(path) {
        const params = [];
        const segments = path.split('/');
        segments.forEach((segment, index) => {
            if (segment.startsWith(':')) {
                params.push({
                    name: segment.slice(1),
                    index: index
                });
            }
        });
        return params;
    }

    async init() {
        try {
           
            const { LoadingManager } = await import('../utils/loading.js');

            this.loadingManager = new LoadingManager();
           
            await this.navigate(window.location.pathname, false);
        } catch (error) {
            this.showError('Erro ao inicializar a aplicação');
        }
    }

    async navigate(path, pushState = true) {
        try {
            if (pushState) {
                history.pushState(null, '', path);
            }

            const route = this.matchRoute(path);
            if (!route) {
                console.warn(`Rota não encontrada: ${path}, redirecionando para 404`);
                return this.navigateToNotFound();
            }

            this.currentRoute = path;
            await this.loadComponent(route, path);

        } catch (error) {
          
            this.navigateToNotFound();
        }
    }

    matchRoute(path) {
      
        if (this.routes.has(path)) {
            return { ...this.routes.get(path), matchedPath: path, params: {} };
        }
       
        for (const [routePath, routeConfig] of this.routes) {
            if (routeConfig.params.length > 0) {
                const match = this.matchParametricRoute(routePath, path);
                if (match) {
                    return { ...routeConfig, matchedPath: routePath, params: match };
                }
            }
        }

        return null;
    }

    matchParametricRoute(routePath, actualPath) {
        const routeSegments = routePath.split('/');
        const actualSegments = actualPath.split('/');

        if (routeSegments.length !== actualSegments.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const actualSegment = actualSegments[i];

            if (routeSegment.startsWith(':')) {
                params[routeSegment.slice(1)] = actualSegment;
            } else if (routeSegment !== actualSegment) {
                return null;
            }
        }

        return params;
    }

    async loadComponent(route, path) {
        try {
            this.loadingManager.show('Carregando página...');

            if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
                this.currentComponent.destroy();
            }

            if (!route.component) {
                const module = await route.loader();
                route.component = module.default;
            }

            this.currentComponent = new route.component(route.params);

            this.appContainer.innerHTML = '';


            await this.currentComponent.render(this.appContainer);

            this.loadingManager.hide();

        } catch (error) {
            this.loadingManager.hide();         
            this.showError('Erro ao carregar a página');
            throw error;
        }
    }

    async navigateToNotFound() {
        try {

            history.replaceState({}, '', this.notFoundRoute);

            if (this.routes.has(this.notFoundRoute)) {
                const route = this.routes.get(this.notFoundRoute);
                this.currentRoute = this.notFoundRoute;
                await this.loadComponent({
                    ...route,
                    matchedPath: this.notFoundRoute,
                    params: {}
                }, this.notFoundRoute);
            } else {
                this.showNotFoundFallback();
            }
        } catch (error) {           
            this.showNotFoundFallback();
        }
    }

    showNotFoundFallback() {
        this.appContainer.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
                    <p class="text-gray-500 mb-8">A página que você está procurando não existe.</p>
                    <button onclick="router.navigate('/')" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Voltar para a Página Inicial
                    </button>
                </div>
            </div>
        `;
    }

    showError(message) {
        this.appContainer.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="glass-card rounded-2xl p-8 text-center max-w-md mx-4">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${message}</h3>
                    <p class="text-gray-600 mb-6">Tente recarregar a página ou voltar ao início</p>
                    <div class="space-x-3">
                        <button onclick="location.reload()" class="btn-primary text-white px-4 py-2 rounded-lg">
                            Recarregar
                        </button>
                        <button data-route="/" class="glass text-gray-700 px-4 py-2 rounded-lg">
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    handlePopState() {
        this.navigate(window.location.pathname, false);
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentComponent() {
        return this.currentComponent;
    }
}