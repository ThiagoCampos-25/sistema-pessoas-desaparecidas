export default class AboutPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render(container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-8">
                <!-- Breadcrumb -->
                <nav class="text-gray-600 text-sm mb-6">
                    <a href="#" data-route="/" class="hover:text-blue-700 transition-colors">Início</a>
                    <span class="mx-2">></span>
                    <span class="text-blue-800 font-medium">Sobre o Sistema</span>
                </nav>

                <div class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Sobre o Sistema</h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Conheça mais sobre o Sistema de Pessoas Desaparecidas da Polícia Civil de Mato Grosso.
                    </p>
                </div>

                <div class="space-y-8">
                    <!-- Missão -->
                    <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                        <h2 class="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                            <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Nossa Missão
                        </h2>
                        <div class="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                O Sistema de Pessoas Desaparecidas foi desenvolvido pela Polícia Judiciária Civil 
                                do Estado de Mato Grosso com o objetivo de facilitar a localização de pessoas 
                                desaparecidas através da colaboração da sociedade.
                            </p>
                            <p>
                                Nosso sistema permite que cidadãos consultem informações sobre pessoas 
                                desaparecidas e contribuam com informações que podem ser fundamentais 
                                para o reencontro de famílias.
                            </p>
                        </div>
                    </div>

                    <!-- Como Funciona e Contatos -->
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                            <h3 class="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                Como Funciona
                            </h3>
                            <ul class="text-gray-700 space-y-3">
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    <span>Consulte a lista de pessoas desaparecidas</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    <span>Use filtros para encontrar casos específicos</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    <span>Visualize detalhes completos de cada caso</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    <span>Reporte informações sobre avistamentos</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    <span>Anexe fotos que possam ajudar na identificação</span>
                                </li>
                            </ul>
                        </div>

                        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                            <h3 class="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                Contatos de Emergência
                            </h3>
                            <div class="text-gray-700 space-y-3">
                                <div class="flex items-center">
                                    <span class="font-semibold text-blue-800 w-20">190</span>
                                    <span>Polícia Militar</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="font-semibold text-blue-800 w-20">197</span>
                                    <span>Polícia Civil</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="font-semibold text-blue-800 w-20">0800</span>
                                    <span>647 7900 - Ouvidoria</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="font-semibold text-blue-800 w-20">192</span>
                                    <span>Emergência Médica (SAMU)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Aviso Importante -->
                    <div class="bg-orange-50 rounded-2xl p-8 border border-orange-200 shadow-md">
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-orange-800 mb-3">Importante</h3>
                                <p class="text-orange-700 leading-relaxed mb-4">
                                    <strong>Em caso de emergência, procure imediatamente a delegacia mais próxima 
                                    ou ligue 190.</strong>
                                </p>
                                <p class="text-orange-600">
                                    Este sistema é uma ferramenta complementar para consulta 
                                    e colaboração cidadã, mas não substitui o registro oficial de ocorrência.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Polícia Civil MT -->
                    <div class="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                        <h2 class="text-2xl font-bold text-blue-800 mb-6">Polícia Judiciária Civil - MT</h2>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 class="font-semibold text-blue-800 mb-3">Endereço</h4>
                                <p class="text-gray-700 text-sm">
                                    Rua Engenheiro Edgar Prado, 215<br>
                                    Centro Político Administrativo<br>
                                    CEP: 78.049-909 - Cuiabá - MT
                                </p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-blue-800 mb-3">Informações</h4>
                                <p class="text-gray-700 text-sm">
                                    Telefone: (65) 3613-7900<br>
                                    CNPJ: 06.284.531/0001-30<br>
                                    Site: <a href="https://geia.pjc.mt.gov.br" class="text-blue-600 hover:text-blue-800">geia.pjc.mt.gov.br</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="text-center pt-8">
                        <a href="#" data-route="/" class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            <span>Voltar ao Início</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    destroy() {}
}