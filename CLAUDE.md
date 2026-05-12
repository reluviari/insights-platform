# CLAUDE.md — Insights Platform

## Finalidade

Este é o arquivo principal de instruções do Claude Code para o repositório `insights-platform`.

A partir deste pacote, o fluxo operacional antes descrito em `docs/ai-workflow.md` e `docs/insights-platform-agents-setup.md` está consolidado aqui e em `.claude/agents/`.

Claude puro deve usar:

- `CLAUDE.md` para regras persistentes do projeto.
- `.claude/agents/*.md` para agentes especializados.
- READMEs e `docs/PRODUCT_SCOPE.md` como documentação de produto e operação.

Não dependa de `.cursor/rules`, `docs/ai-workflow.md` ou `docs/insights-platform-agents-setup.md` para operar com Claude Code.

---

## Contexto do produto

Insights Platform é uma plataforma SaaS multi-tenant de BI white-label.

Hierarquia principal:

```text
Tenant → Customers → Departments → Users → Reports
```

Stack principal:

- Monorepo com Nx e npm workspaces.
- `insights.web`: Next.js 13, React 18, TypeScript, Redux Toolkit / RTK Query, Tailwind CSS, SASS, NextAuth e Power BI embed.
- `insights.api`: Serverless Framework 3, AWS Lambda, TypeScript, Middy, MongoDB/Mongoose, class-validator/class-transformer, Axios, Azure AD e Power BI REST.
- Execução local com Docker Compose: MongoDB, seed, API serverless-offline e Web Next.js.

---

## Fontes de verdade

Antes de mudanças relevantes, leia conforme o impacto:

1. `docs/PRODUCT_SCOPE.md`
2. `README.md`
3. `insights.api/README.md`, se API for afetada
4. `insights.web/README.md`, se Web for afetada
5. Configurações reais envolvidas:
   - `docker-compose.yml`
   - `.env.docker.example`
   - `nx.json`
   - `package.json`
   - `insights.api/project.json`
   - `insights.web/project.json`
   - `insights.api/serverless.yml`
   - `insights.api/config/*.yml`

Ordem de decisão:

```text
Produto e segurança
→ PRODUCT_SCOPE.md
→ README raiz
→ README do app afetado
→ arquitetura existente
→ padrões atuais do código
→ preferência pessoal
```

---

## Disciplina operacional obrigatória

Não gere código automaticamente sem contexto.

Para toda mudança relevante:

```text
Inspecionar → Diagnosticar → Planejar → Implementar pouco → Validar → Revisar escopo
```

Antes de implementar:

1. Inspecione o repositório.
2. Leia a documentação relevante.
3. Registre diagnóstico curto.
4. Proponha plano mínimo.
5. Liste arquivos prováveis.
6. Aponte riscos.
7. Só implemente o escopo aprovado ou claramente solicitado.

Prefira mudanças mínimas, reversíveis e revisáveis.

### Critérios de mudança relevante

Considere mudança relevante quando houver qualquer um destes pontos:

- alteração em mais de dois arquivos;
- mudança de contrato entre API e Web;
- alteração de autenticação, autorização, tenant, usuário, relatório, embed token ou Power BI;
- alteração de infraestrutura, Docker, Serverless, Nx, env ou scripts;
- criação, remoção ou renomeação de módulo, rota, schema, DTO, serviço ou configuração;
- impacto em documentação de produto, operação local ou escopo funcional.

Para mudanças pequenas e óbvias, ainda leia o arquivo afetado e valide o menor escopo possível.

---

## Regras de produto e segurança

Sempre preserve:

- isolamento multi-tenant;
- autenticação JWT atual;
- separação entre API e Web;
- contratos explícitos entre frontend e backend;
- Power BI embed via API;
- Azure AD / Power BI REST apenas no backend;
- segredos fora do frontend;
- logs sem tokens, senhas, secrets ou PII;
- erros sem stack trace exposto ao cliente.

Keycloak existe como preparação futura. Não ative nem reestruture o login para Keycloak sem solicitação explícita.

Sem credenciais Azure válidas, falhas reais de embed ou sync podem ser esperadas. Não trate isso automaticamente como bug.

---

## Fases funcionais do projeto

Use estas fases como referência para evitar implementação fora de ordem. Elas orientam prioridade, não substituem o escopo explícito do usuário.

### Fase 1 — Base local e autenticação atual

Foco:

- ambiente local via Docker Compose;
- MongoDB, seed e health check;
- login JWT atual;
- usuários locais de desenvolvimento;
- documentação mínima para subir API e Web.

Evite nesta fase:

- ativar Keycloak;
- trocar estratégia de auth;
- integrar browser diretamente com Azure AD ou Power BI.

### Fase 2 — Multi-tenant e cadastros centrais

Foco:

- isolamento por tenant;
- Customers, Departments e Users;
- filtros por tenant em queries e comandos;
- autorização coerente com o JWT atual;
- contratos explícitos entre API e Web.

Checklist obrigatório:

- nenhuma listagem deve atravessar tenant;
- nenhum update/delete deve operar sem escopo de tenant quando aplicável;
- respostas públicas não devem expor documento Mongo cru.

### Fase 3 — Reports, filtros e Power BI embed

Foco:

- cadastro e sincronização de reports;
- embed-token via API;
- filtros de report, target filters e regras de visibilidade;
- Azure AD / Power BI REST exclusivamente no backend;
- frontend consumindo apenas embed config/token retornados pela API.

Checklist obrigatório:

- segredos Azure/Power BI nunca vão para o frontend;
- logs não incluem tokens, embed tokens, access tokens ou PII;
- falhas por ausência de credenciais reais não devem ser tratadas automaticamente como bug.

### Fase 4 — Operação, qualidade e hardening

Foco:

- scripts Nx/npm/yarn;
- lint, testes e coverage;
- documentação operacional;
- Docker Compose e env examples;
- revisão de segurança, escopo e qualidade de testes.

Evite nesta fase:

- reestruturar monorepo sem necessidade real;
- mover para `libs/` por antecipação;
- adicionar dependência opcional sem justificativa.

---

## Arquitetura do monorepo

- Mantenha `insights.api` e `insights.web` independentes.
- Nx deve orquestrar sem esconder scripts reais.
- Não mova código para `libs/` por antecipação.
- Crie `libs/` apenas com reuso real e estável.
- Não mude a estrutura do monorepo só por preferência.
- Evite dependência circular.
- Mudança de contrato API/Web deve ser explícita.

---

## Backend — `insights.api`

Use DDD pragmático:

```text
HTTP Handler / Controller
→ DTO / Validation
→ Use Case
→ Domain Service, se houver regra relevante
→ Repository / Provider / Integration
→ MongoDB / Azure AD / Power BI
```

Regras:

- handlers/controllers finos;
- regras de aplicação em use cases;
- persistência em repositories;
- integração externa em providers/services dedicados;
- DTOs validando fronteiras HTTP;
- Mongoose schemas sem virar “Deus objeto”;
- rotas alinhadas com `serverless.yml` e `functions/*.yml`;
- logs pelo logger do projeto;
- nada de tokens, secrets ou PII em logs;
- não retornar documento Mongo cru sem filtrar campos públicos;
- usar padrões existentes em `embed-token` e `report` para Microsoft/Power BI.

Bounded contexts práticos:

- `auth`
- `tenant`
- `customer`
- `department`
- `user`
- `report`
- `embed-token`
- `report-filter`
- `target-filter`
- `settings`
- `health-check`

---

## Frontend — `insights.web`

Regras:

- pages finas;
- componentes coesos;
- chamadas HTTP em `src/services` / RTK Query conforme padrão;
- estado global em Redux apenas quando fizer sentido;
- tratar estados `loading`, `error`, `empty` e `success`;
- handlers com prefixo `handle`;
- não criar componente compartilhado antes do segundo uso real;
- não expor segredo no browser;
- `NEXT_PUBLIC_*` apenas para valores públicos;
- Power BI no browser deve receber embed config/token da API;
- não autenticar diretamente no Azure/Power BI pelo browser fora do fluxo documentado;
- manter UI simples, responsiva e coerente com Tailwind/SASS existentes.

---

## SOLID pragmático

Aplique SOLID para reduzir manutenção, não para aumentar cerimônia.

- SRP: cada arquivo deve ter um motivo principal para mudar.
- OCP: estenda por composição quando houver variação real.
- LSP: contratos substituíveis sem surpresa.
- ISP: interfaces pequenas.
- DIP: abstraia integrações externas ou múltiplas implementações reais.

Não crie interface, adapter, factory ou camada nova para um único caso sem ganho claro.

---

## Clean Code prático

Prefira:

- nomes claros;
- funções curtas;
- early returns;
- baixo aninhamento;
- contratos explícitos;
- validação nas bordas;
- constantes nomeadas;
- composição.

Evite:

- `any`;
- números mágicos;
- abstrações antecipadas;
- reescrever código funcional;
- misturar HTTP, domínio, banco e integração no mesmo arquivo.

---

## Operação local

Caminho recomendado:

```bash
cp .env.docker.example .env
docker compose up --build
```

Portas e endpoints:

```text
Frontend: http://localhost:3000
API: http://localhost:4001
Health check: GET http://localhost:4001/api/health-check
MongoDB: mongodb://localhost:27017
```

Credenciais locais de seed:

```text
admin@example.com / DevPass123!
dev@example.com / DevPass123!
```

Essas credenciais são apenas para desenvolvimento local.

---

## Testes e validação

API:

```bash
cd insights.api
npm test
npm run test-coverage
npm run lint
```

Web:

```bash
cd insights.web
yarn lint
```

Nx:

```bash
npx nx graph
npx nx affected -t lint,test,build
npx nx run-many -t lint --all
```

Valide o menor escopo primeiro.  
Só rode suíte ampla quando a mudança justificar.

---

## Formato para planejamento

Use este formato antes de implementar mudanças relevantes:

```text
## Diagnóstico
...

## Escopo interpretado
...

## Plano mínimo
1. ...
2. ...
3. ...

## Arquivos prováveis
- ...

## Riscos
- Multi-tenant:
- Auth/JWT:
- Power BI/Azure:
- Operação/env:
- Testes:

## Agente recomendado
...

## Validação sugerida
- ...
```

---

## Formato após implementação

```text
## O que foi alterado
- ...

## Arquivos alterados
- ...

## Como validar
- ...

## Riscos remanescentes
- ...

## Próximo passo recomendado
- ...
```

---

## Roteamento de agentes

Use o menor conjunto de agentes necessário para a tarefa. Evite criar novos agentes enquanto os atuais cobrirem o domínio.

### Planejamento inicial

Use `platform-orchestrator` quando:

- a tarefa abrir uma nova fase;
- o escopo ainda estiver ambíguo;
- a mudança tocar API e Web ao mesmo tempo;
- for necessário comparar pedido do usuário com PRODUCT_SCOPE, READMEs e estado real do repo.

Saída esperada:

- diagnóstico curto;
- escopo interpretado;
- plano mínimo;
- arquivos prováveis;
- riscos;
- validação sugerida;
- agente implementador recomendado.

### Implementação

Use `backend-implementer` quando a mudança principal envolver:

- `insights.api`;
- handlers, controllers, DTOs, use cases, repositories ou schemas;
- `serverless.yml` e `functions/*.yml`, quando relacionados a rotas da API;
- MongoDB/Mongoose;
- auth/JWT no backend;
- tenant, customer, department, user, report, filters ou settings no backend.

Use `frontend-implementer` quando a mudança principal envolver:

- `insights.web`;
- páginas Next.js;
- componentes React;
- Redux Toolkit / RTK Query;
- serviços HTTP no frontend;
- Tailwind/SASS;
- estados de loading, error, empty e success;
- integração visual com Power BI embed já fornecida pela API.

Use `powerbi-integration-specialist` quando a mudança envolver:

- Azure AD;
- Power BI REST;
- embed-token;
- report sync;
- workspace, dataset, report id ou embed config;
- separação de responsabilidades entre API e browser para Power BI.

Use `workspace-devops` quando a mudança envolver:

- Nx;
- npm workspaces ou yarn;
- Docker Compose;
- `.env*` e exemplos de env;
- `project.json`;
- scripts de build, lint, test ou dev;
- CI/CD;
- documentação operacional.

### Revisão obrigatória por risco

Use `security-reviewer` quando houver mudança em:

- autenticação ou autorização;
- JWT/session;
- tenant isolation;
- usuários, roles ou permissões;
- dados sensíveis;
- logs de request/erro;
- env/config/secrets;
- Azure AD ou Power BI tokens.

Use `domain-design-reviewer` quando houver dúvida ou alteração relevante em:

- boundaries de bounded contexts;
- divisão handler/use case/repository/provider;
- regras de domínio;
- acoplamento entre módulos;
- criação de interfaces, services ou abstrações.

Use `test-quality-reviewer` quando:

- testes forem adicionados ou alterados;
- a mudança corrigir bug com risco de regressão;
- houver alteração em fluxo crítico de API/Web;
- a validação depender de Nx, Jest, lint ou coverage.

Use `scope-reviewer` antes de fechar fase ou entrega relevante:

- compare contra pedido do usuário, PRODUCT_SCOPE, READMEs e CLAUDE.md;
- identifique gaps e excessos de escopo;
- aponte correções mínimas;
- não implemente correções sem aprovação quando mudarem o escopo.

---

## Checklist de fechamento

Antes de reportar uma entrega relevante como concluída:

1. Escopo:
   - o pedido explícito foi atendido?
   - houve implementação fora do pedido?
   - alguma decisão precisa ser confirmada pelo usuário?
2. Produto:
   - preserva a hierarquia Tenant → Customers → Departments → Users → Reports?
   - mantém separação entre API e Web?
   - mantém Power BI embed via API?
3. Segurança:
   - tenant isolation foi preservado?
   - auth/JWT atual foi preservado?
   - nenhum segredo foi para o frontend?
   - logs não expõem token, senha, secret ou PII?
   - erros ao cliente não expõem stack trace?
4. Contratos:
   - DTOs, tipos e serviços estão alinhados?
   - mudanças API/Web foram explicitadas?
   - rotas estão alinhadas com Serverless/functions quando aplicável?
5. Operação:
   - env examples continuam coerentes?
   - Docker/Nx/scripts continuam alinhados?
   - documentação operacional só foi alterada quando necessário?
6. Validação:
   - menor teste/lint relevante foi executado ou justificado?
   - falhas conhecidas foram registradas com causa provável?
   - suíte ampla só foi rodada quando a mudança justificou?
7. Revisão:
   - `security-reviewer` foi usado se tocou auth/tenant/dados/config/Power BI?
   - `test-quality-reviewer` foi usado se tocou testes ou fluxo crítico?
   - `scope-reviewer` foi usado para fechar fase/entrega relevante?

---

## Agentes Claude Code

Use estes agentes em `.claude/agents/`:

```text
platform-orchestrator
→ backend-implementer OR frontend-implementer OR workspace-devops OR powerbi-integration-specialist
→ test-quality-reviewer
→ security-reviewer, quando mexer em auth/tenant/dados/config/Power BI
→ domain-design-reviewer, quando houver dúvida de DDD/SOLID/boundary
→ scope-reviewer
```

Para iniciar uma fase:

```text
Use o platform-orchestrator.
Leia PRODUCT_SCOPE, README raiz e README do app afetado.
Inspecione o repositório.
Produza plano mínimo.
Não implemente ainda.
```

Para fechar uma fase:

```text
Use o scope-reviewer.
Compare a entrega contra escopo, READMEs, CLAUDE.md e estado real do repositório.
Liste gaps, riscos e correções mínimas.
Não implemente sem aprovação.
```

---

## Proibições

- Não dependa de `.cursor/rules`.
- Não dependa de `docs/ai-workflow.md`.
- Não dependa de `docs/insights-platform-agents-setup.md`.
- Não invente URLs, realms Keycloak ou credenciais Azure.
- Não versionar segredos.
- Não trocar Power BI por outro motor de BI.
- Não ativar Keycloak sem solicitação explícita.
- Não mover para `apps/` só por preferência.
- Não adicionar biblioteca opcional sem justificar.
- Não renomear recursos Serverless/AWS sem aprovação.
