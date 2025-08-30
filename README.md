# Sistema de Pessoas Desaparecidas - Polícia Civil MT

Uma Single Page Application (SPA) moderna desenvolvida em JavaScript puro para consulta e envio de informações sobre pessoas desaparecidas em Mato Grosso.

## 📋 Dados de Inscrição

**Nome:** Thiago Filipe Fernandes Leite Campos
**Email:** thiago.f.f.l@hotmail.com
**Telefone:** 65 98119-98544
**Cidade:** Cuiabá--MT

## 🚀 Tecnologias Utilizadas

- **Frontend:** JavaScript ES6+
- **CSS:** Tailwind CSS
- **Arquitetura:** SPA
- **Empacotamento:** Docker
- **API:** Integração com API da Polícia Civil MT

🛠️ Pré-requisitos

Docker instalado
Navegador web moderno (Chrome, Firefox, Safari, Edge)
Editor de código (VS Code recomendado)

Instalação e Execução

### Método 1: Docker (Recomendado)

bash
# Clone o repositório
git remote add origin https://github.com/ThiagoCampos-25/sistema-pessoas-desaparecidas.git
cd sistema-pessoas-desaparecidas

# Build da imagem Docker
bashdocker build -t pessoas-desaparecidas .

# Execute o container
bashdocker run -p 8080:80 --name app-pessoas pessoas-desaparecidas

# Acesse a aplicação
http://localhost:8080


### Método 2: Desenvolvimento Local

bash
# Clone o repositório
git remote add origin https://github.com/ThiagoCampos-25/sistema-pessoas-desaparecidas.git
cd sistema-pessoas-desaparecidas

# Instale um servidor HTTP simples
npm install -g http-server

# Execute o servidor
http-server . -p 8080 -c-1

# Acesse http://localhost:8080


### Método 3: Desenvolvimento Local

bash
# Clone o repositório
git remote add origin https://github.com/ThiagoCampos-25/sistema-pessoas-desaparecidas.git
cd sistema-pessoas-desaparecidas

# Instale um servidor HTTP simples
npm install -g http-server

# Execute o servidor
http-server . -p 8080 -c-1

# Acesse http://localhost:8080



### Método 4: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Abra o projeto no VS Code
3. Clique com o botão direito em `index.html`
4. Selecione "Open with Live Server"
