
export class PersonCard {
    constructor(options = {}) {
        this.person = options.person;
        this.onClick = options.onClick || (() => { });
        this.container = null;
    }

    async render(container) {
        this.container = container;

        const isFound = !!this.person.ultimaOcorrencia?.dataLocalizacao;
        const status = isFound ? 'Localizado' : 'Desaparecido';
        const statusClass = isFound ? 'status-found' : 'status-missing';

        container.className = 'glass-card rounded-2xl overflow-hidden card-hover cursor-pointer fade-in-up';
        container.innerHTML = this.getCardHTML(status, statusClass);

        this.bindEvents();
    }

    getCardHTML(status, statusClass) {
        debugger;
        const location = this.person.ultimaOcorrencia?.localDesaparecimentoConcat || 'Local não informado';
        const date = this.formatDate(this.person.ultimaOcorrencia?.dtDesaparecimento);
        const age = this.person.idade || 'Não informada';
        const gender = this.person.sexo === 'FEMININO' ? 'Feminino' : 'Masculino';

        return `
            <div class="relative">
                <!-- Image Container -->
                <div class="relative h-64 overflow-hidden bg-gray-200">
                    <img 
                        src="${this.person.urlFoto}" 
                        alt="Foto de ${this.person.nome}"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDMTA4LjI4NCA4MCA1My41IDg1IDgwIDEwMC4yNjdDMTA2LjUgODUgODAgMTA4LjI4NCA4MCA5Mi4wNjY2IDg1IDkyLjA2NjYgODVMMTAwIDg1Wk0xMDAgODVDOTEuNzE2IDg1IDg1IDc4LjI4NCA4NSA3MEM4NSA2MS43MTYgOTEuNzE2IDU1IDEwMCA1NUMxMDguMjg0IDU1IDExNSA2MS43MTYgMTE1IDcwQzExNSA3OC4yODQgMTA4LjI4NCA4NSAxMDAgODVaIiBmaWxsPSIjOUI5RkE5Ii8+Cjwvc3ZnPgo='"
                    >
                    
                    <!-- Status Badge -->
                    <div class="absolute top-4 right-4">
                        <span class="${statusClass} px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ${status}
                        </span>
                    </div>
                    
                    <!-- Gradient Overlay -->
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6">
                        <h3 class="text-xl font-bold text-white mb-1 truncate">
                            ${this.person.nome}
                        </h3>
                        <p class="text-white/90 text-sm">
                            ${age} anos • ${gender}
                        </p>
                    </div>
                </div>
                
                <!-- Card Content -->
                <div class="p-6 space-y-4">
                    <!-- Location -->
                    <div class="flex items-start space-x-3">
                        <svg class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-700 mb-1">Última localização</p>
                            <p class="text-sm text-gray-600 break-words">${location}</p>
                        </div>
                    </div>
                    
                    <!-- Date -->
                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div class="flex items-center space-x-2 text-gray-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-xs font-medium">${date}</span>
                        </div>
                        
                        <div class="flex items-center space-x-1 text-blue-600">
                            <span class="text-xs font-medium">Ver detalhes</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return 'Data não informada';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = now - date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Hoje';
            } else if (diffDays === 1) {
                return 'Ontem';
            } else if (diffDays < 30) {
                return `${diffDays} dias atrás`;
            } else if (diffDays < 365) {
                const diffMonths = Math.floor(diffDays / 30);
                return `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'} atrás`;
            } else {
                return date.toLocaleDateString('pt-BR');
            }
        } catch (error) {
            return 'Data inválida';
        }
    }

    bindEvents() {
        if (this.container) {
            this.container.addEventListener('click', (e) => {
                e.preventDefault();
                this.onClick(this.person.id);
            });

            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.onClick(this.person.id);
                }
            });

            this.container.setAttribute('tabindex', '0');
            this.container.setAttribute('role', 'button');
            this.container.setAttribute('aria-label', `Ver detalhes de ${this.person.nome}`);
        }
    }

    destroy() {
        if (this.container) {
            this.container.removeEventListener('click', this.onClick);
            this.container = null;
        }
    }
}