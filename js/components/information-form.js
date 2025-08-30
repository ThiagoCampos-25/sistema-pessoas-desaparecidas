
import { ErrorHandler } from '../utils/error-handler.js';

export class InformationForm {
    constructor(options = {}) {
        this.person = options.person;
        this.onSubmit = options.onSubmit || (() => { });
        this.onCancel = options.onCancel || (() => { });
        this.errorHandler = new ErrorHandler();

        this.container = null;
        this.formData = {
            observations: '',
            location: '',
            date: '',
            phone: '',
            files: null
        };
    }

    async render(container) {
        this.container = container;

        container.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="flex justify-between items-start mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">Informar Avistamento</h2>
                        <p class="text-gray-600">
                            Você tem informações sobre <strong>${this.person.nome}</strong>?<br>
                            Qualquer detalhe pode ser importante para a investigação.
                        </p>
                    </div>
                    <button 
                        id="form-close"
                        class="glass p-3 rounded-full hover:bg-black/10 transition-all"
                        aria-label="Fechar formulário"
                    >
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Form -->
                <form id="information-form" class="space-y-6">
                    <!-- Observations -->
                    <div>
                        <label for="observations" class="block text-lg font-semibold text-gray-700 mb-3">
                            Observações *
                        </label>
                        <textarea 
                            id="observations"
                            name="observations"
                            rows="4"
                            required
                            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                            placeholder="Descreva detalhadamente o que você viu ou sabe sobre esta pessoa. Inclua informações como: onde viu, quando, com quem estava, o que estava fazendo, como estava vestida, etc."
                        ></textarea>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-sm text-gray-500">Mínimo 20 caracteres</span>
                            <span id="char-count" class="text-sm text-gray-500">0/500</span>
                        </div>
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="location" class="block text-lg font-semibold text-gray-700 mb-3">
                            Local do Avistamento *
                        </label>
                        <input 
                            id="location"
                            name="location"
                            type="text"
                            required
                            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ex: Rua das Flores, 123, Centro - Cuiabá"
                        >
                        <p class="text-sm text-gray-500 mt-2">
                            Seja o mais específico possível sobre o endereço ou ponto de referência
                        </p>
                    </div>

                    <!-- Date and Phone Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Date -->
                        <div>
                            <label for="sighting-date" class="block text-lg font-semibold text-gray-700 mb-3">
                                Data do Avistamento *
                            </label>
                            <input 
                                id="sighting-date"
                                name="date"
                                type="date"
                                required
                                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                max="${new Date().toISOString().split('T')[0]}"
                            >
                        </div>

                        <!-- Phone -->
                        <div>
                            <label for="contact-phone" class="block text-lg font-semibold text-gray-700 mb-3">
                                Telefone para Contato
                            </label>
                            <input 
                                id="contact-phone"
                                name="phone"
                                type="tel"
                                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                placeholder="(65) 9 9999-9999"
                            >
                            <p class="text-sm text-gray-500 mt-2">
                                Opcional. Pode ser útil para esclarecimentos adicionais
                            </p>
                        </div>
                    </div>

                    <!-- File Upload -->
                    <div>
                        <label for="evidence-files" class="block text-lg font-semibold text-gray-700 mb-3">
                            Fotos ou Documentos
                        </label>
                        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                            <input 
                                id="evidence-files"
                                name="files"
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                multiple
                                class="hidden"
                            >
                            <div id="upload-area" class="cursor-pointer">
                                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p class="text-lg text-gray-600 font-medium mb-2">Clique para selecionar arquivos</p>
                                <p class="text-sm text-gray-500">ou arraste e solte aqui</p>
                                <p class="text-xs text-gray-400 mt-3">PNG, JPG, PDF até 5MB cada</p>
                            </div>
                            <div id="file-preview" class="hidden mt-4">
                                <div class="flex items-center justify-center space-x-2 text-green-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span id="file-name" class="font-medium">Arquivo selecionado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Important Notice -->
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div class="flex items-start space-x-3">
                            <svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div class="text-sm">
                                <p class="font-semibold text-blue-800 mb-2">Informações Importantes:</p>
                                <ul class="text-blue-700 space-y-1 list-disc list-inside">
                                    <li>Suas informações serão enviadas diretamente para as autoridades competentes</li>
                                    <li>Todos os dados fornecidos são confidenciais e protegidos</li>
                                    <li>Em caso de emergência, ligue imediatamente para 190</li>
                                    <li>Informações falsas constituem crime e podem ser punidas por lei</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <button 
                            type="button"
                            id="form-cancel"
                            class="flex-1 glass text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            id="form-submit"
                            class="flex-1 btn-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled
                        >
                            Enviar Informações
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.bindEvents();
        this.applyMasks();
        this.setupValidation();
    }

    bindEvents() {
        const form = document.getElementById('information-form');
        const closeBtn = document.getElementById('form-close');
        const cancelBtn = document.getElementById('form-cancel');
        const fileInput = document.getElementById('evidence-files');
        const uploadArea = document.getElementById('upload-area');

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        closeBtn?.addEventListener('click', this.onCancel);
        cancelBtn?.addEventListener('click', this.onCancel);

        uploadArea?.addEventListener('click', () => {
            fileInput?.click();
        });

        fileInput?.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });


        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-blue-400', 'bg-blue-50');
        });

        uploadArea?.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            this.handleFileSelect(e.dataTransfer.files);
        });


        const observationsField = document.getElementById('observations');
        observationsField?.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value);
        });
    }

    applyMasks() {
        const phoneInput = document.getElementById('contact-phone');

        phoneInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{1})(\d{4})(\d+)/, '($1) $2 $3-$4');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }

            e.target.value = value;
        });
    }

    setupValidation() {
        const form = document.getElementById('information-form');
        const submitBtn = document.getElementById('form-submit');

        const validateForm = () => {
            const observations = document.getElementById('observations').value.trim();
            const location = document.getElementById('location').value.trim();
            const date = document.getElementById('sighting-date').value;

            const isValid = observations.length >= 20 && location.length >= 5 && date;

            if (submitBtn) {
                submitBtn.disabled = !isValid;
                submitBtn.classList.toggle('opacity-50', !isValid);
                submitBtn.classList.toggle('cursor-not-allowed', !isValid);
            }
        };

        form?.addEventListener('input', validateForm);
        form?.addEventListener('change', validateForm);
    }

    updateCharCount(text) {
        const charCount = document.getElementById('char-count');
        const length = text.length;

        if (charCount) {
            charCount.textContent = `${length}/500`;
            charCount.classList.toggle('text-red-500', length > 500);
            charCount.classList.toggle('text-green-600', length >= 20 && length <= 500);
        }
    }

    handleFileSelect(files) {
        if (files.length === 0) return;

        const file = files[0];

        try {
            this.errorHandler.validateFileSize(file, 5);
            this.errorHandler.validateFileType(file, [
                'image/jpeg', 'image/png', 'image/gif',
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]);

            this.formData.files = file;
            this.showFilePreview(file);

        } catch (error) {
            this.errorHandler.handleError(error, 'Erro no arquivo selecionado');
            document.getElementById('evidence-files').value = '';
        }
    }

    showFilePreview(file) {
        const preview = document.getElementById('file-preview');
        const fileName = document.getElementById('file-name');

        if (preview && fileName) {
            fileName.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
            preview.classList.remove('hidden');
            document.getElementById('upload-area').classList.add('hidden');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async handleSubmit() {
        try {
            const formElement = document.getElementById('information-form');
            const formData = new FormData(formElement);

            const data = {
                observations: formData.get('observations').trim(),
                location: formData.get('location').trim(),
                date: formData.get('date'),
                phone: formData.get('phone').trim(),
                files: this.formData.files
            };

            this.validateSubmissionData(data);

            this.setFormLoading(true);

            await this.onSubmit(data);

        } catch (error) {
            this.setFormLoading(false);
            this.errorHandler.handleError(error, 'Erro ao enviar informações');
        }
    }

    validateSubmissionData(data) {
        if (!data.observations || data.observations.length < 20) {
            throw new Error('As observações devem ter pelo menos 20 caracteres');
        }

        if (!data.location || data.location.length < 5) {
            throw new Error('O local deve ser informado com mais detalhes');
        }

        if (!data.date) {
            throw new Error('A data do avistamento é obrigatória');
        }

        const selectedDate = new Date(data.date);
        const today = new Date();
        if (selectedDate > today) {
            throw new Error('A data não pode ser no futuro');
        }

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (selectedDate < oneYearAgo) {
            throw new Error('A data não pode ser anterior a um ano');
        }
    }

    setFormLoading(loading) {
        const submitBtn = document.getElementById('form-submit');
        const form = document.getElementById('information-form');

        if (loading) {
            submitBtn.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enviando...
                </div>
            `;
            submitBtn.disabled = true;
            form.classList.add('opacity-50', 'pointer-events-none');
        } else {
            submitBtn.innerHTML = 'Enviar Informações';
            submitBtn.disabled = false;
            form.classList.remove('opacity-50', 'pointer-events-none');
        }
    }

    destroy() {
        this.container = null;
        this.formData = null;
    }
}