# Escopo de produto — Insights Platform

Documento de referência para **o que o produto é**, **para quem**, **o que deve entregar** e **o que está fora de escopo**. Complementa os READMEs técnicos e deve ser lido antes de planejar funcionalidades grandes ou revisões de arquitetura.

**Relacionados:** [README.md](../README.md) · [ai-workflow.md](./ai-workflow.md) · [insights-platform-agents-setup.md](./insights-platform-agents-setup.md)

---

## 1. Visão

**Insights Platform** é uma **plataforma SaaS multi-tenant** de **Business Intelligence white-label** que permite a organizações **fornecedoras** oferecerem **dashboards e relatórios Microsoft Power BI** de forma **embebida** na web, com **gestão de clientes, departamentos, usuários e permissões**, sem que o consumidor final precise operar o Power BI Service diretamente.

**Proposta de valor resumida**

- **Para o fornecedor (ex.: parceiro / Hi Solution / operador da plataforma):** operar vários clientes corporativos em um único produto, com isolamento lógico por tenant, embed seguro e integração com o ecossistema Microsoft.
- **Para o cliente corporativo (tenant):** acesso a relatórios profissionais, experiência de portal própria, usuários e departamentos alinhados à organização.

---

## 2. Personas (alto nível)

| Persona | Necessidade principal |
|---------|------------------------|
| **Administrador da plataforma / do tenant** | Configurar clientes, departamentos, usuários e quais relatórios cada perfil enxerga. |
| **Usuário final analista / gestor** | Consumir relatórios embebidos com filtros e contexto do departamento, sem fricção técnica. |
| **Equipe de produto / engenharia** | Manter API serverless, front Next.js, integrações Azure/Power BI e operação (Nx, Docker, CI). |

---

## 3. Modelo de negócio e hierarquia

### 3.1 Multi-tenant (SaaS)

- Cada **tenant** representa um contexto organizacional (ex.: um cliente corporativo da operadora).
- Dados e configurações sensíveis ao tenant devem permanecer **isolados** (modelagem em MongoDB, `realmId` Keycloak alinhado ao documento de tenant quando SSO for usado).

### 3.2 Hierarquia funcional

```
Tenant → Customers (clientes) → Departments → Users → Reports (Power BI)
```

- **Users** associam-se a **departments** e visualizam **reports** conforme política de acesso implementada no produto.
- **Administradores** gerenciam a estrutura (conforme telas em `insights.web` / rotas em `insights.api`).

---

## 4. Capacidades do produto (escopo in-scope)

### 4.1 Autenticação e sessão

- **JWT** como mecanismo principal de sessão/API autenticada.
- **Keycloak (opcional)** para SSO corporativo: o tenant pode usar `realmId` coerente entre MongoDB e Keycloak (ver [docker/KEYCLOAK.md](../docker/KEYCLOAK.md)).
- Fluxos de **definição / recuperação de senha** onde já existirem no produto (rotas e templates na API).

### 4.2 Gestão organizacional

- **Clientes (customers):** cadastro, atualização, vínculo com relatórios e configurações de negócio suportadas pelo modelo atual.
- **Departamentos (departments):** estrutura interna do cliente; associação a relatórios/páginas quando aplicável.
- **Usuários (users):** convite, papéis, status, associação a departamentos, fluxos administrativos expostos pela API e pelo front.

### 4.3 Relatórios e Power BI

- **Catálogo / metadados** de relatórios provenientes do **Power BI** (workspace externo, IDs armazenados conforme schema de tenant/relatório).
- **Sincronização** de relatórios e metadados com a **API REST do Power BI** (Azure AD obrigatório para operações reais).
- **Token de embed** seguro: fluxo em que a **API** obtém token no **Azure AD** e chama endpoints como **GenerateToken** na API do Power BI; o **browser** usa `powerbi-client-react` com o token retornado.
- **Filtros:** `report-filter` e `target-filter` (e equivalentes) para contextualizar visualizações por negócio.

### 4.4 Configurações e plataforma

- **Settings** conforme módulo existente na API.
- **Health check** operacional (`/api/health-check`) para observabilidade básica.

### 4.5 Experiência web (insights.web)

- **Portal** com área logada, **administração** (clientes, usuários, relatórios conforme rotas em `src/pages`).
- **Embed** de relatórios na experiência do usuário final.
- **UI responsiva** (Tailwind + SASS conforme padrão atual).

---

## 5. Integrações externas (obrigatórias para cenários completos)

| Sistema | Papel no produto |
|---------|------------------|
| **Microsoft Azure AD** | OAuth / token para chamar a **API do Power BI**. |
| **Microsoft Power BI Service** | Hospedagem de relatórios; **api.powerbi.com** e embed em **app.powerbi.com**. |
| **MongoDB** | Persistência principal da aplicação. |
| **AWS (Lambda + API Gateway)** | Runtime da API em produção (Serverless Framework). |
| **Keycloak** | Opcional; SSO e realms por tenant quando habilitado. |

**Sem credenciais Azure válidas**, a plataforma pode **subir em ambiente local**, mas **embed e sincronização reais** de relatórios **não funcionam** — isso é **esperado**, não bug de produto.

---

## 6. Fora de escopo (non-goals) — salvo decisão explícita de roadmap

- Substituir o **Power BI** por outro motor de BI no mesmo produto.
- **ETL / data warehouse** ou preparação de dados fora do que o cliente já resolve no Power BI.
- **Mobile nativo** (iOS/Android) como entregável principal; o escopo é **web** (Next.js).
- **Multi-cloud** da API além do modelo **AWS Lambda** descrito no `serverless.yml`, sem projeto de migração.
- **Compliance formal completo** (ex.: ISO, SOC2) como requisito deste documento — apenas boas práticas de segurança operacional (sem segredos no repositório, validação de entrada, etc.).

---

## 7. Requisitos não funcionais

- **Segurança:** não versionar segredos; tokens e segredos apenas em variáveis de ambiente / cofre; logs sem PII/credenciais.
- **Disponibilidade:** dependente de AWS, MongoDB e da disponibilidade do Power BI / Azure — comunicar dependências em materiais de operação.
- **Manutenibilidade:** mudanças **mínimas e revisáveis**; front e back com limites claros (ver `CLAUDE.md`).
- **Operação local:** Docker Compose na raiz + Nx para facilitar onboarding e CI com **filtros por app** quando aplicável.

---

## 8. Domínios da API (mapa rápido)

Alinhado aos módulos em `insights.api/src/modules/`:

| Domínio | Responsabilidade em produto |
|---------|------------------------------|
| `auth` | Login, JWT, integração Keycloak quando configurada |
| `tenant` | Dados de tenant; vínculo com realm SSO |
| `customer` | Clientes do tenant |
| `department` | Departamentos |
| `user` | Usuários e permissões na medida do modelo |
| `report` | Relatórios, páginas, sincronização Power BI |
| `embed-token` | Token de embed para o front |
| `report-filter` / `target-filter` | Filtros de relatório e alvo |
| `settings` | Configurações diversas |
| `health-check` | Saúde do serviço |

Novas features devem **encaixar** nesse mapa ou **explicitamente** propor novo bounded context com ADR/revisão.

---

## 9. Critérios gerais de aceite (qualidade de entrega)

Uma entrega é “dentro do escopo de produto” quando:

1. Respeita a **hierarquia tenant → customer → department → user → report** onde aplicável.
2. **Não quebra** embed nem sync **sem motivo documentado** (mudanças em Azure/Power BI devem ser operacionalizáveis).
3. Mantém **isolamento multi-tenant** nos dados expostos pela API.
4. Atualiza **README / env de exemplo** quando o fluxo operacional mudar.
5. Para trabalho assistido por IA: aderência a [CLAUDE.md](../CLAUDE.md) e aos agentes em [`.claude/agents/`](../.claude/agents/).

---

## 10. Roadmap — placeholder para o time de produto

_Use esta seção para datas ou épico. Exemplos de linhas (editar / remover):_

| Épico | Status | Notas |
|-------|--------|-------|
| CI Nx com filtros front/back | Opcional | Criar workflows na raiz quando a estratégia de CI for ativada |
| Testes E2E no front | Backlog | Playwright ou similar |
| Observabilidade (tracing) | Backlog | Além de health-check |

---

## 11. Governança deste documento

- **Dono sugerido:** produto + tech lead.
- **Alterações:** via PR com revisão; mudanças que expandam escopo devem ser **explícitas**.
- Em decisões de implementação, em caso de dúvida entre “scope do produto” e “conveniência técnica”, **prevalece este documento** e os READMEs oficiais após atualização.

Data da última revisão deste arquivo: **2026-05-04** (criação inicial no repositório).
