
export class AbitusApiService {
    constructor() {
        this.baseURL = 'https://abitus-api.geia.vip';
        this.timeout = 10000;
        this.accessToken = null;
    }

    async request(endpoint, options = {}) {

        const url = `${this.baseURL}${endpoint}`;

        const config = {
            timeout: this.timeout,
            headers: {
                'Accept': 'application/json',
                ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
                ...options.headers
            },
            ...options
        };

        if (!(options.body instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        try {

            const controller = new AbortController();

            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorText;
                try {
                    const errorJson = await response.json();
                    errorText = JSON.stringify(errorJson);
                } catch {

                    errorText = await response.text().catch(() => 'Erro desconhecido');
                }
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const contentLength = response.headers.get('content-length');

            const contentType = response.headers.get('content-type');

            if (contentLength === '0' || !contentType?.includes('application/json')) {

                return { success: true, status: response.status };
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Timeout: A requisição demorou muito para responder');
            }
            throw error;
        }
    }

    async getPessoas(params = {}) {

        const queryParams = new URLSearchParams();

        if (params.pagina !== undefined) queryParams.set('pagina', params.pagina);
        if (params.porPagina !== undefined) queryParams.set('porPagina', params.porPagina);
        if (params.nome) queryParams.set('nome', params.nome);
        if (params.sexo) queryParams.set('sexo', params.sexo);
        if (params.status) queryParams.set('status', params.status);
        if (params.faixaIdadeInicial) queryParams.set('faixaIdadeInicial', params.faixaIdadeInicial);
        if (params.faixaIdadeFinal) queryParams.set('faixaIdadeFinal', params.faixaIdadeFinal);

        const endpoint = `/v1/pessoas/aberto/filtro${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return await this.request(endpoint);
    }

    async getPessoaById(id) {
        return await this.request(`/v1/pessoas/${id}`);
    }

    async reportarInformacao(ocorrenciaId, dados) {

        const formData = new FormData();


        formData.append('informacao', dados.informacao);
        formData.append('descricao', dados.descricao || 'Informação reportada pelo cidadão');
        formData.append('data', dados.data);
        formData.append('ocoId', parseInt(ocorrenciaId).toString());


        if (dados.files && dados.files.length > 0) {
            dados.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const endpoint = '/v1/ocorrencias/informacoes-desaparecido';

        try {
            const result = await this.request(endpoint, {
                method: 'POST',
                body: formData
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getEstatisticas() {
        return await this.request('/v1/pessoas/aberto/estatistico');
    }
}


export class MockApiService {
    constructor() {
        this.pessoas = [
            {
                id: 1,
                nome: 'João Silva Santos',
                idade: 25,
                sexo: 'MASCULINO',
                vivo: false, // false = desaparecido
                urlFoto: null,
                ultimaOcorrencia: {
                    ocoId: 1001,
                    dtDesaparecimento: '2024-01-15T10:30:00',
                    dataLocalizacao: null,
                    encontradoVivo: null,
                    localDesaparecimentoConcat: 'Centro de Cuiabá, próximo ao Shopping Popular',
                    ocorrenciaEntrevDesapDTO: {
                        informacao: 'Saiu de casa pela manhã para trabalhar e não retornou. Família perdeu contato por volta das 14h. Pessoa muito responsável, nunca havia sumido antes.',
                        vestimentasDesaparecido: 'Camiseta azul da empresa, calça jeans escura e tênis preto Nike'
                    },
                    listaCartaz: [
                        {
                            urlCartaz: '#',
                            tipoCartaz: 'JPG_DESAPARECIDO'
                        }
                    ]
                }
            },
            {
                id: 2,
                nome: 'Maria Santos Oliveira',
                idade: 32,
                sexo: 'FEMININO',
                vivo: true, // true = localizada
                urlFoto: null,
                ultimaOcorrencia: {
                    ocoId: 1002,
                    dtDesaparecimento: '2024-02-10T18:00:00',
                    dataLocalizacao: '2024-02-15',
                    encontradoVivo: true,
                    localDesaparecimentoConcat: 'Várzea Grande, próximo ao Terminal do CPA',
                    ocorrenciaEntrevDesapDTO: {
                        informacao: 'Saiu para encontrar uma amiga e não retornou para casa. Foi encontrada em estado de confusão mental, mas fisicamente bem.',
                        vestimentasDesaparecido: 'Blusa rosa florida, saia jeans azul e sandália marrom'
                    },
                    listaCartaz: []
                }
            },
            {
                id: 3,
                nome: 'Carlos Mendes Silva',
                idade: 45,
                sexo: 'MASCULINO',
                vivo: false,
                urlFoto: null,
                ultimaOcorrencia: {
                    ocoId: 1003,
                    dtDesaparecimento: '2024-03-05T07:15:00',
                    dataLocalizacao: null,
                    encontradoVivo: null,
                    localDesaparecimentoConcat: 'Bairro Popular da Baixada, Cuiabá',
                    ocorrenciaEntrevDesapDTO: {
                        informacao: 'Saiu de casa para comprar remédios e não voltou. Sofre de episódios de confusão mental. URGENTE: Precisa tomar insulina regularmente devido ao diabetes tipo 1.',
                        vestimentasDesaparecido: 'Camisa branca de botão, bermuda marrom e chinelo preto'
                    },
                    listaCartaz: []
                }
            },
            {
                id: 4,
                nome: 'Lucia Ferreira Lima',
                idade: 67,
                sexo: 'FEMININO',
                vivo: false,
                urlFoto: null,
                ultimaOcorrencia: {
                    ocoId: 1004,
                    dtDesaparecimento: '2024-03-20T15:45:00',
                    dataLocalizacao: null,
                    encontradoVivo: null,
                    localDesaparecimentoConcat: 'Feira do Porto, Centro de Cuiabá',
                    ocorrenciaEntrevDesapDTO: {
                        informacao: 'Saiu para fazer compras na feira e se perdeu. Família procura desesperadamente. Portadora de Alzheimer em estágio inicial, pode estar confusa e assustada.',
                        vestimentasDesaparecido: 'Vestido florido azul e branco, sapato preto fechado e bolsa pequena marrom'
                    },
                    listaCartaz: []
                }
            }
        ];
    }

    async getPessoas(params = {}) {

        await this.delay(800);

        let filtered = [...this.pessoas];

        if (params.nome) {
            const searchTerm = params.nome.toLowerCase();
            filtered = filtered.filter(pessoa =>
                pessoa.nome.toLowerCase().includes(searchTerm)
            );
        }

        if (params.sexo) {
            filtered = filtered.filter(pessoa => pessoa.sexo === params.sexo);
        }

        if (params.status) {
            if (params.status === 'LOCALIZADO') {
                filtered = filtered.filter(pessoa => pessoa.vivo === true);
            } else if (params.status === 'DESAPARECIDO') {
                filtered = filtered.filter(pessoa => pessoa.vivo === false);
            }
        }

        const page = params.pagina || 0;
        const size = params.porPagina || 10;
        const start = page * size;
        const end = start + size;
        const content = filtered.slice(start, end);

        return {
            content,
            totalElements: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
            number: page,
            size: size,
            first: page === 0,
            last: page >= Math.ceil(filtered.length / size) - 1,
            empty: content.length === 0
        };
    }

    async getPessoaById(id) {

        await this.delay(500);

        const pessoa = this.pessoas.find(p => p.id === parseInt(id));

        if (!pessoa) {
            throw new Error('Pessoa não encontrada');
        }
        return pessoa;
    }

    async reportarInformacao(ocorrenciaId, dados) {

        await this.delay(1000);


        const payload = {
            ocoId: parseInt(ocorrenciaId),
            informacao: dados.informacao,
            data: dados.data,
            id: Date.now(),
            anexos: dados.files?.map(f => f.name) || []
        };

        return payload;
    }

    async getEstatisticas() {
        await this.delay(300);
        const desaparecidos = this.pessoas.filter(p => !p.vivo).length;
        const localizados = this.pessoas.filter(p => p.vivo).length;

        return {
            quantPessoasDesaparecidas: desaparecidos,
            quantPessoasEncontradas: localizados
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


export class AbitusApiServiceForProduction extends AbitusApiService {
    constructor() {
        super();
    }

    async reportarInformacao(ocorrenciaId, dados) {
        debugger;


        if (!ocorrenciaId || !dados.informacao || !dados.data) {
            throw new Error('Dados obrigatórios não fornecidos');
        }


        const queryParams = new URLSearchParams({
            informacao: dados.informacao.trim(),
            data: dados.data,
            ocoId: parseInt(ocorrenciaId)
        });


        if (dados.descricao && dados.descricao.trim()) {
            queryParams.append('descricao', dados.descricao.trim());
        }

        const endpoint = `/v1/ocorrencias/informacoes-desaparecido?${queryParams.toString()}`;

        const formData = new FormData();


        if (dados.files && dados.files.length > 0) {
            dados.files.forEach((file, index) => {
                formData.append('files', file);
            });
        } else {
            formData.append('files', new Blob(), '');
        }


        try {

            const result = await this.uploadWithFormData(endpoint, formData, 'POST');

            return result;

        } catch (error) {
            console.error('Erro detalhado da API:', {
                endpoint,
                error: error.message,
                stack: error.stack
            });

            if (error.message.includes('500')) {
                throw new Error('Erro interno do servidor. Tente novamente em alguns minutos.');
            } else if (error.message.includes('400')) {
                throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
            } else if (error.message.includes('404')) {
                throw new Error('Ocorrência não encontrada.');
            }

            throw error;
        }
    }

    async uploadWithFormData(endpoint, formData, method = 'POST') {

        const url = `${this.baseURL}${endpoint}`;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.setRequestHeader('accept', '*/*');


            if (this.accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
            }

            xhr.timeout = this.timeout;

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = xhr.responseText ? JSON.parse(xhr.responseText) : { success: true };
                        resolve(response);
                    } catch (e) {
                        resolve({ success: true, rawResponse: xhr.responseText });
                    }
                } else {
                    let errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`;
                    try {
                        const errorJson = JSON.parse(xhr.responseText);
                        errorMessage = `HTTP ${xhr.status}: ${JSON.stringify(errorJson)}`;
                    } catch {

                    }
                    reject(new Error(errorMessage));
                }
            };

            xhr.onerror = function () {
                reject(new Error('Erro de rede ao fazer a requisição'));
            };

            xhr.ontimeout = function () {
                reject(new Error(`Timeout: A requisição demorou mais de ${this.timeout}ms`));
            };

            xhr.send(formData);
        });
    }
}

export { AbitusApiService as ApiService };