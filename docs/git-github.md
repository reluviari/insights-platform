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
6. Associe o remoto e envie a branch principal (repositório canônico deste monorepo):
   ```bash
   git remote add origin https://github.com/reluviari/insights-platform.git
   git branch -M main
   git push -u origin main
   ```
   Se o remoto já existir com outro nome, use `git remote set-url origin https://github.com/reluviari/insights-platform.git`.

## Hooks Git (sem Co-authored-by do Cursor)

Na raiz, para usar os hooks versionados em [`.githooks/`](../.githooks/) (remove `Co-authored-by: Cursor <cursoragent@cursor.com>` das mensagens):

```bash
git config core.hooksPath .githooks
```

Quem não configurar continua a poder commitar; o IDE pode voltar a acrescentar o trailer — basta apagar manualmente ou ativar o `hooksPath` acima.

## Boas práticas

- Não commitar `.env` com segredos reais.
- `package-lock.json` na raiz e locks dos apps conforme política do time.
- CI: quando workflows forem versionados na raiz, usar filtros por `insights.api/**` e `insights.web/**` quando fizer sentido.

Para fluxo de trabalho com IA: [ai-workflow.md](./ai-workflow.md).
