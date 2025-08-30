// js/app.js - Single Page Application Principal
import { Router } from './core/router.js';
import { ApiService } from './services/api.js';
import { LoadingManager } from './utils/loading.js';
import { ToastManager } from './utils/toast.js';
import { ErrorHandler } from './utils/error-handler.js';

class App {
    constructor() {
        this.router = new Router();
        this.api = new ApiService();
        this.loading = new LoadingManager();
        this.toast = new ToastManager();
        this.errorHandler = new ErrorHandler();

        this.init();
    }

    async init() {
        try {

            this.setupGlobalErrorHandling();


            this.setupRouting();


            this.setupNavigation();


            await this.router.init();
           
        } catch (error) {
            this.errorHandler.handleError(error, 'Erro na inicialização da aplicação');
        }
    }

    setupGlobalErrorHandling() {

        window.addEventListener('error', (event) => {
            this.errorHandler.handleError(event.error, 'Erro não tratado');
        });


        window.addEventListener('unhandledrejection', (event) => {
            this.errorHandler.handleError(event.reason, 'Promise rejeitada');
        });
    }

    setupRouting() {

        this.router.addRoute('/', () => import('./pages/home.js'));
        this.router.addRoute('/pessoa/:id', () => import('./pages/detail.js'));
        this.router.addRoute('/404', () => import('./pages/not-found.js'));
    }

    setupNavigation() {

        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-route]');
            if (target) {
                e.preventDefault();
                const route = target.dataset.route;
                this.router.navigate(route);
            }
        });


        window.addEventListener('popstate', () => {
            this.router.handlePopState();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});