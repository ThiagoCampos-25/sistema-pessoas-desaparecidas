
export default class DetailPage {
    constructor(params = {}) {
        this.params = params;
        this.pessoaId = params.id;
        this.api = null;
        this.pessoa = null;
    }

    async render(container) {
        this.container = container;

        try {
            await this.loadDependencies();

            if (!this.pessoaId) {
                this.renderError('ID da pessoa não fornecido');
                return;
            }

            this.showLoading();
            await this.loadPessoa();
            this.renderPessoa();

        } catch (error) {          
            this.renderError(error.message);
        }
    }

    async loadDependencies() {
        try {

            const apiModule = await import('../services/api.js');

            this.api = new apiModule.AbitusApiServiceForProduction();

        } catch (error) {
            throw error;
        }
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-gray-300 border-t-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-700 text-xl">Carregando detalhes...</p>
                </div>
            </div>
        `;
    }

    async loadPessoa() {
        this.pessoa = await this.api.getPessoaById(this.pessoaId);
    }

    renderPessoa() {

        const isFound = this.pessoa.vivo === true ||
            (this.pessoa.vivo === undefined && this.pessoa.ultimaOcorrencia?.dataLocalizacao);

        const ultimaOcorrencia = this.pessoa.ultimaOcorrencia || {};
        const entrevista = ultimaOcorrencia.ocorrenciaEntrevDesapDTO || {};
        const isUrgent = entrevista.informacao && entrevista.informacao.includes('URGENTE');

        this.container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-8">
                <!-- Breadcrumb -->
                <nav class="text-gray-600 text-sm mb-6">
                    <a href="#" data-route="/" class="hover:text-blue-700 transition-colors">Início</a>
                    <span class="mx-2">></span>
                    <span class="text-blue-800 font-medium">Detalhes da Pessoa</span>
                </nav>

                <!-- Header Card -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
                    <div class="relative">
                        ${isUrgent ? `
                            <div class="absolute top-4 left-4 z-10">
                                <span class="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                                    ⚠ CASO URGENTE
                                </span>
                            </div>
                        ` : ''}
                        
                        <div class="absolute top-4 right-4 z-10">
                            <span class="px-4 py-2 rounded-full text-sm font-medium ${isFound
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }">
                                ${isFound ? '✓ LOCALIZADO' : '⚠ DESAPARECIDO'}
                            </span>
                        </div>

                        <div class="p-8">
                            <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <!-- Foto -->
                                <div class="flex-shrink-0">
                                    <div class="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-6xl font-bold overflow-hidden">
                                        ${this.pessoa.urlFoto ?
                `<img src="${this.pessoa.urlFoto}" alt="${this.pessoa.nome || 'Pessoa'}" class="w-full h-full object-cover rounded-2xl">` :
                (this.pessoa.nome ? this.pessoa.nome.charAt(0).toUpperCase() : '?')
            }
                                    </div>
                                </div>

                                <!-- Informações Básicas -->
                                <div class="flex-1 min-w-0">
                                    <h1 class="text-4xl font-bold text-blue-800 mb-4">${this.pessoa.nome || 'Nome não informado'}</h1>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div class="text-gray-600 text-sm">Idade</div>
                                            <div class="text-gray-800 text-xl font-semibold">${this.pessoa.idade || 'Não informado'} ${this.pessoa.idade ? 'anos' : ''}</div>
                                        </div>
                                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div class="text-gray-600 text-sm">Sexo</div>
                                            <div class="text-gray-800 text-xl font-semibold">${this.formatSexo(this.pessoa.sexo)}</div>
                                        </div>
                                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div class="text-gray-600 text-sm">Status</div>
                                            <div class="text-gray-800 text-xl font-semibold">${isFound ? 'Localizado' : 'Desaparecido'}</div>
                                        </div>
                                    </div>

                                    <!-- Data importante -->
                                    ${this.renderDateInfo(ultimaOcorrencia, isFound)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detalhes Grid -->
                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Coluna Principal -->
                    <div class="lg:col-span-2 space-y-8">
                        ${this.renderMainInfo(entrevista)}
                        ${this.renderVestimentas(entrevista)}
                        ${this.renderCartazes(ultimaOcorrencia)}
                    </div>

                    <!-- Coluna Lateral -->
                    <div class="space-y-8">
                        ${this.renderLocalInfo(ultimaOcorrencia)}
                        ${this.renderActionButton(isFound, ultimaOcorrencia)}
                        ${this.renderUrgencyWarning(isUrgent)}
                        ${this.renderEmergencyInfo()}
                    </div>
                </div>

                ${this.renderReportForm(ultimaOcorrencia)}
                ${this.renderBackButton()}
            </div>
        `;

        this.bindEvents();
    }

    formatSexo(sexo) {
        if (!sexo) return 'Não informado';
        return sexo === 'MASCULINO' ? 'Masculino' :
            sexo === 'FEMININO' ? 'Feminino' : sexo;
    }

    renderDateInfo(ultimaOcorrencia, isFound) {
        const dataDesaparecimento = ultimaOcorrencia.dtDesaparecimento;
        const dataLocalizacao = ultimaOcorrencia.dataLocalizacao;

        if (!dataDesaparecimento && !dataLocalizacao) return '';

        return `
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-blue-800 font-medium">
                        ${isFound && dataLocalizacao ? 'Data da Localização' : 'Data do Desaparecimento'}
                    </span>
                </div>
                <div class="text-gray-800">
                    ${this.formatDate(isFound && dataLocalizacao ? dataLocalizacao : dataDesaparecimento)}
                    ${!isFound && dataDesaparecimento ? `<div class="text-sm text-gray-600 mt-1">${this.getDaysAgo(dataDesaparecimento)}</div>` : ''}
                </div>
            </div>
        `;
    }

    renderMainInfo(entrevista) {
        if (!entrevista.informacao) return '';

        return `
            <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                <h2 class="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.045-5.709-2.573"></path>
                    </svg>
                    Informações sobre o Desaparecimento
                </h2>
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p class="text-gray-700 leading-relaxed text-lg">${entrevista.informacao}</p>
                </div>
            </div>
        `;
    }

    renderVestimentas(entrevista) {
        if (!entrevista.vestimentasDesaparecido) return '';

        return `
            <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Vestimentas no Momento do Desaparecimento
                </h3>
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p class="text-gray-700 leading-relaxed">${entrevista.vestimentasDesaparecido}</p>
                </div>
            </div>
        `;
    }

    renderCartazes(ultimaOcorrencia) {
        if (!ultimaOcorrencia.listaCartaz || ultimaOcorrencia.listaCartaz.length === 0) return '';

        return `
            <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Cartazes de Divulgação
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ultimaOcorrencia.listaCartaz.map(cartaz => `
                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div class="aspect-w-3 aspect-h-4 mb-3">
                                ${cartaz.urlCartaz && cartaz.urlCartaz !== '#' ?
                `<img src="${cartaz.urlCartaz}" alt="Cartaz de desaparecimento" class="w-full h-48 object-cover rounded-lg">` :
                `<div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>`
            }
                            </div>
                            <p class="text-gray-600 text-sm">${this.formatTipoCartaz(cartaz.tipoCartaz)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLocalInfo(ultimaOcorrencia) {
        if (!ultimaOcorrencia.localDesaparecimentoConcat) return '';

        return `
            <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 class="text-lg font-bold text-blue-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Local do Desaparecimento
                </h3>
                <p class="text-gray-700">${ultimaOcorrencia.localDesaparecimentoConcat}</p>
            </div>
        `;
    }

    renderActionButton(isFound, ultimaOcorrencia) {
        if (isFound || !ultimaOcorrencia.ocoId) return '';

        return `
            <div class="bg-white rounded-2xl p-6 shadow-md border border-blue-200">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-blue-800 mb-2">Você tem informações?</h3>
                    <p class="text-gray-600 text-sm mb-4">
                        Sua informação pode ajudar a família a reencontrar seu ente querido
                    </p>
                    <button id="show-report-form" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors w-full">
                        Reportar Informação
                    </button>
                </div>
            </div>
        `;
    }

    renderUrgencyWarning(isUrgent) {
        if (!isUrgent) return '';

        return `
            <div class="bg-orange-50 rounded-2xl p-6 shadow-md border border-orange-200">
                <div class="text-center">
                    <div class="text-orange-500 text-2xl mb-2">⚠</div>
                    <h3 class="text-lg font-bold text-orange-700 mb-2">Caso Urgente</h3>
                    <p class="text-orange-600 text-sm">
                        Esta pessoa precisa de atenção médica. Se você a viu, 
                        entre em contato imediatamente com as autoridades.
                    </p>
                </div>
            </div>
        `;
    }

    renderEmergencyInfo() {
        return `
            <div class="bg-red-50 rounded-2xl p-6 shadow-md border border-red-200">
                <h3 class="text-lg font-bold text-red-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Emergência
                </h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-red-700">Polícia Militar:</span>
                        <span class="text-red-800 font-medium">190</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-red-700">Polícia Civil:</span>
                        <span class="text-red-800 font-medium">197</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-red-700">Emergência:</span>
                        <span class="text-red-800 font-medium">193</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderReportForm(ultimaOcorrencia) {
        if (!ultimaOcorrencia.ocoId) return '';

        return `
            <!-- Formulário de Reportar (Oculto) -->
            <div id="report-form-section" class="hidden">
                <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                    <h2 class="text-2xl font-bold text-blue-800 mb-6">Reportar Informação</h2>
                    <form id="report-form" class="space-y-6">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Informações sobre a pessoa *</label>
                            <textarea 
                                name="informacao" 
                                required
                                rows="4" 
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Descreva onde e quando você viu esta pessoa, ou qualquer informação relevante..."
                            ></textarea>
                        </div>

                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Descrição da informação *</label>
                            <input 
                                type="text" 
                                name="descricao" 
                                required
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Ex: Avistamento, informação sobre localização, etc."
                            />
                        </div>

                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Data da observação *</label>
                            <input 
                                type="date" 
                                name="data" 
                                required
                                max="${new Date().toISOString().split('T')[0]}"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Anexar fotos (opcional)</label>
                            <input 
                                type="file" 
                                name="files" 
                                multiple 
                                accept="image/*"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            <p class="text-gray-500 text-sm mt-2">Você pode anexar fotos que ajudem na identificação</p>
                        </div>

                        <div class="flex space-x-4 pt-4">
                            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                Enviar Informação
                            </button>
                            <button type="button" id="cancel-report" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </form>

                    <!-- Indicador de envio -->
                    <div id="submit-indicator" class="hidden mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span class="text-blue-700">Enviando informação...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBackButton() {
        return `
            <!-- Voltar -->
            <div class="text-center pt-8">
                <a href="#" data-route="/" class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>Voltar à lista</span>
                </a>
            </div>
        `;
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="text-center max-w-md">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 14.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Erro ao Carregar</h2>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <a href="#" data-route="/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-block">
                        Voltar ao Início
                    </a>
                </div>
            </div>
        `;
    }

    bindEvents() {

        const showReportBtn = document.getElementById('show-report-form');
        if (showReportBtn) {
            showReportBtn.addEventListener('click', () => {
                const formSection = document.getElementById('report-form-section');
                formSection.classList.remove('hidden');
                formSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        const cancelBtn = document.getElementById('cancel-report');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('report-form-section').classList.add('hidden');
            });
        }

        const reportForm = document.getElementById('report-form');
        if (reportForm) {
            reportForm.addEventListener('submit', this.handleReportSubmit.bind(this));
        }
    }

    async handleReportSubmit(e) {
        e.preventDefault();

        const submitIndicator = document.getElementById('submit-indicator');
        const submitBtn = e.target.querySelector('button[type="submit"]');

        try {

            submitIndicator.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const formData = new FormData(e.target);
            const files = Array.from(formData.getAll('files')).filter(file => file.size > 0);

            const dados = {
                informacao: formData.get('informacao'),
                descricao: formData.get('descricao'),
                data: formData.get('data'),
                files: files
            };

            await this.api.reportarInformacao(this.pessoa.ultimaOcorrencia.ocoId, dados);

            this.showSuccessMessage();
            e.target.reset();
            document.getElementById('report-form-section').classList.add('hidden');

        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {

            submitIndicator.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Informação';
        }
    }

    showSuccessMessage() {

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                    <div class="font-medium">Informação Enviada!</div>
                    <div class="text-sm opacity-90">Obrigado por ajudar</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }

    showErrorMessage(message) {

        const notification = document.createElement('div');

        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 14.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <div class="font-medium">Erro ao Enviar</div>
                    <div class="text-sm opacity-90">${message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }

    formatDate(dateString) {
        if (!dateString) return 'Data não informada';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Data inválida';

            return date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }

    getDaysAgo(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = now - date;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Hoje';
            if (diffDays === 1) return 'Há 1 dia';
            if (diffDays < 30) return `Há ${diffDays} dias`;
            if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                return months === 1 ? 'Há 1 mês' : `Há ${months} meses`;
            }

            const years = Math.floor(diffDays / 365);
            return years === 1 ? 'Há 1 ano' : `Há ${years} anos`;
        } catch (error) {
            return '';
        }
    }

    formatTipoCartaz(tipo) {
        if (!tipo) return 'Cartaz';

        const tipos = {
            'JPG_DESAPARECIDO': 'Cartaz de Desaparecimento',
            'PDF_DESAPARECIDO': 'Boletim de Desaparecimento',
            'PNG_DESAPARECIDO': 'Cartaz de Divulgação'
        };

        return tipos[tipo] || tipo.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}