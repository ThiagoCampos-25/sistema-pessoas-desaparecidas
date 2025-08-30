
export class LoadingManager {
    constructor() {
        this.loadingOverlay = document.getElementById('global-loading');
        this.loadingText = this.loadingOverlay?.querySelector('p');
        this.isVisible = false;
    }

    show(message = 'Carregando...') {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
            this.loadingOverlay.style.opacity = '0';

            if (this.loadingText) {
                this.loadingText.innerHTML = `${message}<span class="loading-dots"></span>`;
            }


            setTimeout(() => {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.opacity = '1';
                }
            }, 10);

            this.isVisible = true;
        }
    }

    hide() {
        if (this.loadingOverlay && this.isVisible) {
            this.loadingOverlay.style.opacity = '0';

            setTimeout(() => {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.display = 'none';
                }
            }, 300);

            this.isVisible = false;
        }
    }

    isShowing() {
        return this.isVisible;
    }

    updateMessage(message) {
        if (this.loadingText && this.isVisible) {
            this.loadingText.innerHTML = `${message}<span class="loading-dots"></span>`;
        }
    }
}


export function createInlineLoader(size = 'md', color = 'blue') {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
        xl: 'w-12 h-12 border-4'
    };

    const colorClasses = {
        blue: 'border-blue-200 border-t-blue-600',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-200 border-t-gray-600'
    };

    return `
        <div class="inline-flex items-center justify-center">
            <div class="${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin"></div>
        </div>
    `;
}