# Git e GitHub — repositório único (raiz)

O objetivo é um **único repositório Git** na raiz **`insights-platform`**, contendo `insights.api`, `insights.web`, `docs/`, `.cursor/`, Nx na raiz, etc.

## Se existir `.git` só dentro de `insights.api` ou `insights.web`

1. **Faça backup** dos remotes e branches que importem (`git remote -v`, `git branch -a` em cada subpasta).
2. Na **raiz** `insights-platform`:
   ```bash
   git init
   ```
3. **Remova** os repositórios aninhados (isso não apaga o código, só o histórico local daquela pasta):
   ```bash
   rm -rf insights.api/.git insights.web/.git
   ```
   (Confirme com o time se há histórico exclusivo a preservar — nesse caso use `git subtree` ou migração manual antes.)
4. Ajuste [`.gitignore`](../.gitignore) na raiz (`.env`, `node_modules/`, `.nx/`, artefatos de build).
5. Primeiro commit na raiz:
   ```bash
   git add .
   git status
   git commit -m "chore: inicializa monorepo insights-platform na raiz"
   ```
6. Crie o repositório no GitHub (vazio) e associe:
   ```bash
   git remote add origin https://github.com/<org>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

## Boas práticas

- Não commitar `.env` com segredos reais.
- `package-lock.json` na raiz e locks dos apps conforme política do time.
- CI: workflows em [`.github/workflows/`](../.github/workflows/) com filtros por `insights.api/**` e `insights.web/**` quando fizer sentido.

Para fluxo de trabalho com IA: [ai-workflow.md](./ai-workflow.md).
