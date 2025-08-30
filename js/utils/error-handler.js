export class ErrorHandler {
    constructor() {
        this.toast = null;
        this.init();
    }

    async init() {

        try {
            const toastModule = await import('./toast.js');
            this.toast = new toastModule.ToastManager();
        } catch (err) {
            console.warn('Toast Manager não disponível para ErrorHandler');
        }
    }

    handleError(error, context = 'Erro') {
        console.error(`${context}:`, error);

        let userMessage = 'Ocorreu um erro inesperado';


        if (error.message) {
            if (error.message.includes('fetch')) {
                userMessage = 'Erro de conexão. Verifique sua internet.';
            } else if (error.message.includes('404')) {
                userMessage = 'Recurso não encontrado';
            } else if (error.message.includes('500')) {
                userMessage = 'Erro interno do servidor';
            } else if (error.message.includes('timeout')) {
                userMessage = 'Tempo limite esgotado';
            } else {
                userMessage = error.message;
            }
        }

        if (this.toast) {
            this.toast.error(userMessage);
        } else {
            console.warn('Erro:', userMessage);
        }


        this.logError(error, context);
    }

    logError(error, context) {

        const errorLog = {
            message: error.message,
            stack: error.stack,
            context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
       
        console.error('Error Log:', errorLog);
    }

    handleApiError(response) {
        if (response.status === 401) {
            this.handleError(new Error('Sessão expirada'), 'Autenticação');
            // Redirecionar para login se necessário
        } else if (response.status === 403) {
            this.handleError(new Error('Acesso negado'), 'Autorização');
        } else if (response.status === 404) {
            this.handleError(new Error('Recurso não encontrado'), 'API');
        } else if (response.status >= 500) {
            this.handleError(new Error('Erro interno do servidor'), 'API');
        } else {
            this.handleError(new Error(`Erro HTTP ${response.status}`), 'API');
        }
    }
}

