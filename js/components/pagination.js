
export class Pagination {
    constructor(options = {}) {
        this.currentPage = options.currentPage || 0;
        this.totalPages = options.totalPages || 0;
        this.onPageChange = options.onPageChange || (() => { });
        this.maxVisiblePages = options.maxVisiblePages || 7;
        this.container = null;
    }

    render(container) {
        this.container = container;

        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <nav class="glass rounded-2xl p-6" role="navigation" aria-label="Navegação de páginas">
                <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <!-- Page Info -->
                    <div class="text-white/80 text-sm font-medium">
                        Página ${this.currentPage + 1} de ${this.totalPages}
                    </div>
                    
                    <!-- Pagination Controls -->
                    <div class="flex items-center space-x-1">
                        ${this.renderPaginationButtons()}
                    </div>
                    
                    <!-- Page Size Info (optional) -->
                    <div class="text-white/60 text-xs hidden sm:block">
                        ${this.totalPages} página${this.totalPages > 1 ? 's' : ''} no total
                    </div>
                </div>
            </nav>
        `;

        this.bindEvents();
    }

    renderPaginationButtons() {

        const buttons = [];

        buttons.push(this.renderButton({
            text: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="hidden sm:inline ml-1">Anterior</span>
            `,
            page: this.currentPage - 1,
            disabled: this.currentPage === 0,
            className: 'px-3 sm:px-4 py-2',
            ariaLabel: 'Página anterior'
        }));


        const pageNumbers = this.getVisiblePages();

        pageNumbers.forEach((pageInfo, index) => {
            if (pageInfo.type === 'ellipsis') {
                buttons.push(`
                    <span class="px-2 py-2 text-white/60">...</span>
                `);
            } else {
                buttons.push(this.renderButton({
                    text: pageInfo.number + 1,
                    page: pageInfo.number,
                    active: pageInfo.number === this.currentPage,
                    className: 'w-10 h-10 flex items-center justify-center',
                    ariaLabel: `Página ${pageInfo.number + 1}`
                }));
            }
        });

        buttons.push(this.renderButton({
            text: `
                <span class="hidden sm:inline mr-1">Próxima</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            `,
            page: this.currentPage + 1,
            disabled: this.currentPage >= this.totalPages - 1,
            className: 'px-3 sm:px-4 py-2',
            ariaLabel: 'Próxima página'
        }));

        return buttons.join('');
    }

    renderButton({ text, page, active = false, disabled = false, className = '', ariaLabel = '' }) {
        const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50';

        let buttonClasses = baseClasses;
        let buttonProps = '';

        if (disabled) {
            buttonClasses += ' bg-white/10 text-white/40 cursor-not-allowed';
            buttonProps = 'disabled';
        } else if (active) {
            buttonClasses += ' bg-white text-blue-600 shadow-lg';
        } else {
            buttonClasses += ' bg-white/20 text-white hover:bg-white/30 hover:scale-105';
        }

        return `
            <button 
                class="${buttonClasses} ${className}"
                data-page="${page}"
                aria-label="${ariaLabel}"
                ${buttonProps}
            >
                ${text}
            </button>
        `;
    }

    getVisiblePages() {
        const pages = [];
        const halfVisible = Math.floor(this.maxVisiblePages / 2);

        let startPage = Math.max(0, this.currentPage - halfVisible);
        let endPage = Math.min(this.totalPages - 1, startPage + this.maxVisiblePages - 1);

        if (endPage - startPage < this.maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - this.maxVisiblePages + 1);
        }


        if (startPage > 0) {
            pages.push({ type: 'page', number: 0 });
            if (startPage > 1) {
                pages.push({ type: 'ellipsis' });
            }
        }


        for (let i = startPage; i <= endPage; i++) {
            pages.push({ type: 'page', number: i });
        }

        if (endPage < this.totalPages - 1) {
            if (endPage < this.totalPages - 2) {
                pages.push({ type: 'ellipsis' });
            }
            pages.push({ type: 'page', number: this.totalPages - 1 });
        }

        return pages;
    }

    bindEvents() {
        const buttons = this.container?.querySelectorAll('button[data-page]');

        buttons?.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(button.getAttribute('data-page'));

                if (!button.disabled && page !== this.currentPage && page >= 0 && page < this.totalPages) {
                    this.currentPage = page;
                    this.onPageChange(page);


                    button.classList.add('scale-95');
                    setTimeout(() => {
                        button.classList.remove('scale-95');
                    }, 150);
                }
            });
        });


        this.container?.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.currentPage > 0) {
                e.preventDefault();
                this.onPageChange(this.currentPage - 1);
            } else if (e.key === 'ArrowRight' && this.currentPage < this.totalPages - 1) {
                e.preventDefault();
                this.onPageChange(this.currentPage + 1);
            }
        });
    }

    updatePage(currentPage, totalPages) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;

        if (this.container) {
            this.render(this.container);
        }
    }


    getState() {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages
        };
    }

    destroy() {
        this.container = null;
    }
}