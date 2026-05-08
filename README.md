# DashUp Server

API REST para gerenciamento de animes, permitindo organização por categoria, ano, temporadas, personagens e muito mais.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para MongoDB
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação
- **Cloudinary** - Upload de imagens e vídeos
- **Zod** - Validação de dados
- **bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ ou Docker
- MongoDB (local ou via Docker)
- Conta no Cloudinary (para uploads)

## 🔧 Instalação

### Opção 1: Instalação Local

1. Clone o repositório e entre na pasta do servidor:
```bash
cd dashup-server
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env-example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL=mongodb://localhost:27017/dashup
AUTH_SECRET=seu-secret-jwt-aqui
CLOUD_NAME=seu-cloud-name
CLOUD_API_KEY=sua-api-key
CLOUD_API_SECRET=seu-api-secret
```

5. Gere o cliente Prisma:
```bash
npx prisma generate
```

6. Execute as migrações (se necessário):
```bash
npx prisma db push
```

7. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O servidor estará rodando em `http://localhost:1818`

### Opção 2: Docker Compose

1. Configure o arquivo `.env`:
```bash
cp .env-example .env
```

2. Inicie os containers:
```bash
docker-compose up -d
```

Isso irá iniciar:
- MongoDB na porta `27017`
- Servidor na porta `1818`

3. Para ver os logs:
```bash
docker-compose logs -f server
```

4. Para parar os containers:
```bash
docker-compose down
```

## 📁 Estrutura do Projeto

```
dashup-server/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── prismaService.ts        # Cliente Prisma
├── src/
│   ├── controllers/            # Controladores das rotas
│   ├── services/               # Lógica de negócio
│   ├── routes/                 # Definição das rotas
│   ├── middlewares/            # Middlewares (auth, error handling)
│   ├── validations/            # Validações com Zod
│   ├── integrations/           # Integrações externas (Cloudinary)
│   ├── utils/                  # Utilitários
│   └── server.ts               # Arquivo principal
├── Dockerfile
├── docker-compose.yml
├── .env-example
└── package.json
```

## 🗄️ Modelos de Dados

### User
- Gerenciamento de usuários do sistema
- Autenticação JWT
- Relacionamento com animes

### Anime
- Título, descrição, episódios
- Ano de lançamento
- Rating pessoal e público
- Status (assistindo, completo, etc.)
- Favorito, seguindo
- Relacionamentos com: User, Category, Character, Season

### Category
- Categorias para organização dos animes

### Character
- Personagens dos animes
- Informações como idade, altura, imagens, GIFs, vídeos

### Season
- Temporadas dos animes
- Episódios, ano, status

### AnimeOpenings
- Openings dos animes
- Áudio e vídeo

## 🔌 Endpoints Principais

### Autenticação
- `POST /user/create` - Criar usuário
- `POST /user/authenticate` - Autenticar e obter token

### Animes
- `GET /anime/get` - Listar todos os animes
- `GET /anime/best` - Listar melhores animes (favoritos)
- `POST /anime/create` - Criar anime
- `PUT /anime/update/:id` - Atualizar anime (requer autenticação)
- `DELETE /anime/delete/:id` - Deletar anime (requer autenticação)

### Categorias
- `GET /category/get` - Listar categorias
- `POST /category/create` - Criar categoria
- `PUT /category/update/:id` - Atualizar categoria
- `DELETE /category/delete/:id` - Deletar categoria

### Personagens
- `GET /character/get` - Listar personagens
- `POST /character/create` - Criar personagem
- `PUT /character/update/:id` - Atualizar personagem
- `DELETE /character/delete/:id` - Deletar personagem

### Temporadas
- `GET /season/get` - Listar temporadas
- `POST /season/create` - Criar temporada
- `PUT /season/update/:id` - Atualizar temporada
- `DELETE /season/delete/:id` - Deletar temporada

### Openings
- `GET /opening/get` - Listar openings
- `POST /opening/create` - Criar opening
- `PUT /opening/update/:id` - Atualizar opening
- `DELETE /opening/delete/:id` - Deletar opening

## 🔐 Autenticação

A maioria das rotas de criação, atualização e exclusão requerem autenticação via JWT.

Envie o token no header:
```
Authorization: Bearer <seu-token-jwt>
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run start` - Inicia o servidor em modo produção
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:push` - Aplica as mudanças do schema ao banco
- `npm run prisma:studio` - Abre o Prisma Studio para visualizar dados

## 🐳 Docker

### Build da imagem
```bash
docker build -t dashup-server .
```

### Executar container
```bash
docker run -p 1818:1818 --env-file .env dashup-server
```

## 🔍 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PORT` | Porta do servidor | Não (padrão: 1818) |
| `DATABASE_URL` | URL de conexão do MongoDB | Sim |
| `AUTH_SECRET` | Chave secreta para JWT | Sim |
| `CLOUD_NAME` | Nome da conta Cloudinary | Sim |
| `CLOUD_API_KEY` | API Key do Cloudinary | Sim |
| `CLOUD_API_SECRET` | API Secret do Cloudinary | Sim |
| `NODE_ENV` | Ambiente (development/production) | Não |

## 🛠️ Desenvolvimento

### Estrutura de Código

O projeto segue uma arquitetura em camadas:

1. **Routes** - Define as rotas e middlewares
2. **Controllers** - Recebe requisições e retorna respostas
3. **Services** - Contém a lógica de negócio
4. **Validations** - Valida dados com Zod
5. **Utils** - Funções auxiliares

### Adicionando uma Nova Rota

1. Crie o service em `src/services/`
2. Crie o controller em `src/controllers/`
3. Crie as validações em `src/validations/`
4. Adicione a rota em `src/routes/`
5. Registre a rota em `src/routes/index.ts`

## 📦 Dependências Principais

- `express` - Framework web
- `@prisma/client` - Cliente Prisma
- `jsonwebtoken` - JWT
- `bcrypt` - Hash de senhas
- `cloudinary` - Upload de arquivos
- `zod` - Validação
- `cors` - CORS
- `express-fileupload` - Upload de arquivos

## 🐛 Troubleshooting

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a `DATABASE_URL` no `.env`
- Para Docker: verifique se o container está rodando

### Erro ao gerar Prisma Client
```bash
npx prisma generate
```

### Erro de autenticação
- Verifique se o `AUTH_SECRET` está configurado
- Confirme que o token está sendo enviado corretamente no header

## 📄 Licença

ISC

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

