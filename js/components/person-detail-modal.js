// js/components/person-detail-modal.js - Modal para API Real
export class PersonDetailModal {
    constructor(apiService) {
        this.api = apiService;
        this.modal = null;
        this.currentPersonId = null;
        this.currentPerson = null;
        this.isVisible = false;
    }

    async show(personId) {

        try {
            this.currentPersonId = personId;
            
            if (!this.modal) {
                this.createModal();
            }

            this.showLoading();
            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');
            
            setTimeout(() => {
                this.modal.classList.add('modal-show');
            }, 10);
            
            this.isVisible = true;
            document.body.style.overflow = 'hidden';

            // Carregar dados da pessoa
            const pessoa = await this.api.getPessoaById(personId);
            this.currentPerson = pessoa;
            this.renderPersonDetails(pessoa);

        } catch (error) {
            this.showError(error.message);
        }
    }

    hide() {

        if (!this.modal || !this.isVisible) return;

        this.modal.classList.remove('modal-show');
        
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('flex');
            this.isVisible = false;
            document.body.style.overflow = '';
        }, 300);
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center p-4 modal-overlay';
        this.modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl modal-content">
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-900">Detalhes da Pessoa</h2>
                    <button class="close-btn text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="overflow-y-auto max-h-[calc(90vh-80px)]" id="modal-content"></div>
            </div>
        `;

        this.modal.querySelector('.close-btn').addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        document.body.appendChild(this.modal);
    }

    showLoading() {

        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <div class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600">Carregando detalhes...</p>
                </div>
            </div>
        `;
    }

    showError(message) {

        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <div class="flex items-center justify-center py-20">
                <div class="text-center">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar</h3>
                    <p class="text-gray-600 mb-4">${message}</p>
                    <button class="retry-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        `;

        content.querySelector('.retry-btn').addEventListener('click', () => {
            if (this.currentPersonId) {
                this.show(this.currentPersonId);
            }
        });
    }

    renderPersonDetails(pessoa) {

        const content = document.getElementById('modal-content');

        const isFound = pessoa.vivo === true;

        const ultimaOcorrencia = pessoa.ultimaOcorrencia || {};

        const entrevista = ultimaOcorrencia.ocorrenciaEntrevDesapDTO || {};
        
        content.innerHTML = `
            <div class="p-6 space-y-8">
                <!-- Status Banner -->
                <div class="rounded-2xl p-4 ${isFound ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 rounded-full ${isFound ? 'bg-green-500' : 'bg-red-500'}"></div>
                        <span class="font-semibold ${isFound ? 'text-green-800' : 'text-red-800'}">
                            ${isFound ? 'PESSOA LOCALIZADA' : 'PESSOA DESAPARECIDA'}
                        </span>
                        ${isFound && ultimaOcorrencia.dataLocalizacao ? 
                            `<span class="text-green-600 text-sm">em ${this.formatDate(ultimaOcorrencia.dataLocalizacao)}</span>` : 
                            ultimaOcorrencia.dtDesaparecimento ?
                            `<span class="text-red-600 text-sm">desde ${this.formatDate(ultimaOcorrencia.dtDesaparecimento)}</span>` : ''
                        }
                    </div>
                </div>

                <!-- Person Info Grid -->
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Photo/Avatar -->
                    <div class="text-center">
                        <div class="w-48 h-48 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-6xl font-bold mb-4 overflow-hidden">
                            ${pessoa.urlFoto ? 
                                `<img src="${pessoa.urlFoto}" alt="${pessoa.nome}" class="w-full h-full object-cover rounded-2xl">` : 
                                pessoa.nome.charAt(0).toUpperCase()
                            }
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">${pessoa.nome}</h3>
                        <p class="text-gray-600">${pessoa.idade} anos • ${pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}</p>
                    </div>

                    <!-- Details -->
                    <div class="md:col-span-2 space-y-6">
                        <!-- Informações Gerais -->
                        ${entrevista.informacao ? `
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Informações sobre o Desaparecimento</h4>
                                <p class="text-gray-700 leading-relaxed">${entrevista.informacao}</p>
                            </div>
                        ` : ''}

                        <!-- Vestimentas -->
                        ${entrevista.vestimentasDesaparecido ? `
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Vestimentas no Momento do Desaparecimento</h4>
                                <p class="text-gray-700 leading-relaxed">${entrevista.vestimentasDesaparecido}</p>
                            </div>
                        ` : ''}

                        <!-- Última Ocorrência -->
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Detalhes da Ocorrência</h4>
                            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                                ${ultimaOcorrencia.dtDesaparecimento ? `
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <span class="text-sm font-medium text-gray-500">Data do Desaparecimento</span>
                                            <p class="text-gray-900">${this.formatDate(ultimaOcorrencia.dtDesaparecimento)}</p>
                                        </div>
                                        ${isFound && ultimaOcorrencia.dataLocalizacao ? `
                                            <div>
                                                <span class="text-sm font-medium text-gray-500">Data da Localização</span>
                                                <p class="text-gray-900">${this.formatDate(ultimaOcorrencia.dataLocalizacao)}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                                
                                ${ultimaOcorrencia.localDesaparecimentoConcat ? `
                                    <div>
                                        <span class="text-sm font-medium text-gray-500">Local</span>
                                        <p class="text-gray-900">${ultimaOcorrencia.localDesaparecimentoConcat}</p>
                                    </div>
                                ` : ''}

                                ${isFound && ultimaOcorrencia.encontradoVivo !== null ? `
                                    <div>
                                        <span class="text-sm font-medium text-gray-500">Status da Localização</span>
                                        <p class="text-gray-900">${ultimaOcorrencia.encontradoVivo ? 'Encontrado vivo' : 'Encontrado morto'}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cartazes -->
                ${ultimaOcorrencia.listaCartaz && ultimaOcorrencia.listaCartaz.length > 0 ? `
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Cartazes de Divulgação</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${ultimaOcorrencia.listaCartaz.map(cartaz => `
                                <a href="${cartaz.urlCartaz}" target="_blank" class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                                    <div class="text-gray-600 mb-2">
                                        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <span class="text-xs text-gray-600">${this.formatTipoCartaz(cartaz.tipoCartaz)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Action Buttons -->
                ${!isFound ? `
                    <div class="border-t border-gray-200 pt-6">
                        <div class="bg-blue-50 rounded-2xl p-6 text-center">
                            <h4 class="font-semibold text-gray-900 mb-2">Você tem informações sobre esta pessoa?</h4>
                            <p class="text-gray-600 mb-4">Sua informação pode ajudar a família a reencontrar seu ente querido.</p>
                            <button class="report-info-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Reportar Informação
                            </button>
                        </div>
                    </div>
                ` : ''}

                <!-- Emergency Note -->
                ${entrevista.informacao && entrevista.informacao.includes('URGENTE') ? `
                    <div class="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                        <div class="flex items-center space-x-2 text-orange-800">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="font-semibold">Situação Urgente</span>
                        </div>
                        <p class="text-orange-700 mt-1">Esta pessoa precisa de atenção especial. Se você a viu, entre em contato imediatamente.</p>
                    </div>
                ` : ''}
            </div>
        `;
       
        const reportBtn = content.querySelector('.report-info-btn');

        if (reportBtn && ultimaOcorrencia.ocoId) {
            reportBtn.addEventListener('click', () => {
                this.showReportForm(ultimaOcorrencia.ocoId);
            });
        }
    }

    showReportForm(ocorrenciaId) {

        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <div class="p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Reportar Informação</h3>
                    <p class="text-gray-600">Compartilhe qualquer informação que possa ajudar a localizar esta pessoa.</p>
                </div>

                <form class="report-form space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Informação sobre a pessoa *</label>
                        <textarea name="informacao" rows="4" required 
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Descreva onde e quando você viu esta pessoa, ou qualquer informação relevante..."></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Descrição da informação *</label>
                        <input type="text" name="descricao" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Ex: Avistamento, informação sobre localização, etc.">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data da observação *</label>
                        <input type="date" name="data" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               max="${new Date().toISOString().split('T')[0]}">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Anexar fotos (opcional)</label>
                        <input type="file" name="files" multiple accept="image/*"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <p class="text-sm text-gray-500 mt-1">Você pode anexar fotos que ajudem na identificação</p>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Enviar Informação
                        </button>
                        <button type="button" class="back-btn px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        const form = content.querySelector('.report-form');

        const backBtn = content.querySelector('.back-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitReport(ocorrenciaId, new FormData(form));
        });

        backBtn.addEventListener('click', () => {
            this.renderPersonDetails(this.currentPerson);
        });
    }

    async submitReport(ocorrenciaId, formData) {

        const submitBtn = document.querySelector('.report-form button[type="submit"]');

        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const dados = {
                informacao: formData.get('informacao'),
                descricao: formData.get('descricao'),
                data: formData.get('data'),
                files: formData.getAll('files').filter(file => file.size > 0)
            };

            await this.api.reportarInformacao(ocorrenciaId, dados);
            this.showSuccessMessage();

        } catch (error) {           
            alert(`Erro ao enviar informação: ${error.message}`);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {

        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <div class="p-6 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Informação Enviada!</h3>
                <p class="text-gray-600 mb-6">Obrigado por sua colaboração. Sua informação foi encaminhada às autoridades competentes.</p>
                <button class="close-success-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Fechar
                </button>
            </div>
        `;

        content.querySelector('.close-success-btn').addEventListener('click', () => {
            this.hide();
        });
    }

    formatDate(dateString) {

        if (!dateString) return 'Data não informada';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const formattedDate = date.toLocaleDateString('pt-BR', options);
        
        if (diffDays === 1) {
            return `${formattedDate} (ontem)`;
        } else if (diffDays <= 7) {
            return `${formattedDate} (${diffDays} dias atrás)`;
        } else if (diffDays <= 30) {
            const weeks = Math.ceil(diffDays / 7);
            return `${formattedDate} (${weeks} semana${weeks > 1 ? 's' : ''} atrás)`;
        } else if (diffDays <= 365) {
            const months = Math.ceil(diffDays / 30);
            return `${formattedDate} (${months} mês${months > 1 ? 'es' : ''} atrás)`;
        } else {
            const years = Math.ceil(diffDays / 365);
            return `${formattedDate} (${years} ano${years > 1 ? 's' : ''} atrás)`;
        }
    }

    formatTipoCartaz(tipo) {
        const tipos = {
            'PDF_DESAPARECIDO': 'PDF Desaparecido',
            'PDF_LOCALIZADO': 'PDF Localizado',
            'JPG_DESAPARECIDO': 'JPG Desaparecido',
            'JPG_LOCALIZADO': 'JPG Localizado',
            'INSTA_DESAPARECIDO': 'Instagram Desaparecido',
            'INSTA_LOCALIZADO': 'Instagram Localizado'
        };
        return tipos[tipo] || tipo;
    }

    destroy() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
        document.body.style.overflow = '';
        this.isVisible = false;
    }}