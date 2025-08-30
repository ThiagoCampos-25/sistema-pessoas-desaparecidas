export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(type, message, duration = 5000) {
        const toast = this.createToast(type, message);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    createToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type} transform translate-x-full transition-all duration-300 opacity-0`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-orange-500',
            info: 'bg-blue-500'
        };

        toast.innerHTML = `
            <div class="${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-72">
                <span class="text-lg">${icons[type]}</span>
                <span class="flex-1">${message}</span>
                <button class="toast-close opacity-70 hover:opacity-100" onclick="this.closest('.toast').remove()">✕</button>
            </div>
        `;

        return toast;
    }

    remove(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('translate-x-full', 'opacity-0');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    success(message) {
        return this.show('success', message);
    }

    error(message) {
        return this.show('error', message);
    }

    warning(message) {
        return this.show('warning', message);
    }

    info(message) {
        return this.show('info', message);
    }

    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}