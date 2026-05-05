# AI Workflow — Insights Platform

Este repositório usa assistência de IA como **acelerador de planejamento e implementação**, não como gerador automático de código sem critério.

## Princípios

- Ler o **escopo de produto** em [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md), o **README da raiz** e os READMEs de `insights.api` / `insights.web` antes de planejar mudanças grandes.
- Seguir **`.cursor/rules/`** como fonte de verdade para comportamento persistente do projeto.
- Preferir fluxos **revisão → plano → implementação** (especialmente para auth, Power BI, multi-tenant e deploy).
- Preferir mudanças **mínimas e reversíveis**.
- Manter **front** e **back** com contratos explícitos; não vazar detalhes de Lambda/Mongo para o cliente além do necessário.
- Não introduzir abstrações antes do **segundo uso real**.
- Requisitos de **produto e segurança** prevalecem sobre preferências pessoais de stack.
- Não inventar URLs de ambiente, nomes de realm Keycloak ou credenciais Azure: usar o que está em `.env.example` / `config/local.yml` / documentação.

## Fluxo esperado com IA

1. Inspecionar o repositório (estrutura Nx, `insights.api`, `insights.web`).
2. Ler documentação relevante (`docs/PRODUCT_SCOPE.md`, `README.md`, READMEs por app, este arquivo).
3. Registrar um diagnóstico curto.
4. Propor plano de implementação mínimo.
5. Listar arquivos a criar ou alterar.
6. Aguardar revisão do plano quando a mudança for ampla.
7. Implementar só o escopo aprovado.
8. Antes de encerrar a fase: checagem de aderência a [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md), regras e riscos (embed, tenants, segredos).

## Agentes e subagentes

Definições completas (instruções, quando usar cada um, orquestração):  
**[insights-platform-agents-setup.md](./insights-platform-agents-setup.md)**

Resumo:

| Agente | Papel |
|--------|--------|
| `platform-orchestrator` | Planeja a fase, alinha escopo, escolhe o subagente |
| `frontend-implementer` | Next.js / React / Redux / embed no `insights.web` |
| `backend-implementer` | Serverless / Lambda / Mongo / Power BI no `insights.api` |
| `workspace-devops` | Nx, Docker, CI, READMEs operacionais |
| `scope-reviewer` | Revisão de aderência a regras, README e objetivo |

## Execução por fases

Dividir trabalho em fases pequenas, por exemplo:

- ajuste de rota ou handler na API;
- tela ou fluxo no front;
- integração Power BI (token / relatório);
- melhoria Nx / Docker / CI;
- revisão final de documentação.

## Expectativas de revisão

Antes de considerar uma fase concluída:

- Objetivo da tarefa atendido sem deriva de escopo.
- Conformidade com `.cursor/rules/`.
- Sem abstrações desnecessárias.
- README / exemplos de env coerentes com o comportamento real.
- Nada de segredos versionados; variáveis sensíveis só em `.env` local ou cofre.

## Integração com Cursor

- Regras: `.cursor/rules/*.mdc`
- Para fases grandes: preferir **Plan Mode** e o orquestrador definido em `insights-platform-agents-setup.md`.
