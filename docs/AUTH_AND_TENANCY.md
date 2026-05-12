# Autenticação e tenancy

Este documento explica login, JWT, tenant, `Origin`, roles e isolamento de acesso na Insights Platform.

---

## Resumo

| Tema | Implementação atual |
|------|---------------------|
| Login principal | E-mail + senha contra MongoDB. |
| Senha | Hash bcrypt. |
| Sessão | JWT emitido pela API. |
| Tenant | Determinado pelo `Origin` / `urlSlug` no login e carregado na sessão. |
| Autorização | Roles e vínculo do usuário com tenant, customer, departamentos e relatórios. |
| SSO / Keycloak | Preparado para futuro, mas não usado no fluxo normal atual. |

---

## Login clássico

O formulário da página `/login` usa o fluxo clássico:

```text
POST /api/auth/sign-in
```

Payload típico:

```json
{
  "email": "admin@example.com",
  "password": "DevPass123!"
}
```

O browser envia o cabeçalho `Origin`. A API usa esse valor como referência de tenant / `urlSlug`.

Exemplo via `curl`:

```bash
curl -sS -X POST http://localhost:4001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"admin@example.com","password":"DevPass123!"}'
```

Em sucesso, a resposta inclui `accessToken`.

---

## Por que o `Origin` importa

O handler HTTP de login lê o cabeçalho `Origin` ou `origin`. Esse valor é usado como `urlSlug` para validar e associar a sessão a um tenant.

Fluxo resumido:

1. Browser acessa `http://localhost:3000`.
2. Browser envia `Origin: http://localhost:3000` na chamada de login.
3. API procura tenant compatível com esse `urlSlug`.
4. API valida se o usuário pertence ao tenant.
5. API emite JWT com informações como usuário, roles e tenant.

Se o host ou a porta do front mudar, pode ser necessário alinhar dados no Mongo ou variáveis de ambiente (`SITE_URL`, tenant, etc.).

---

## Credenciais de desenvolvimento

As credenciais abaixo existem apenas quando o seed local foi aplicado:

| Persona | E-mail | Senha | Uso |
|---------|--------|-------|-----|
| Administrador | `admin@example.com` | `DevPass123!` | Configurações e gestão. |
| Usuário final | `dev@example.com` | `DevPass123!` | Consumo de relatórios. |

O seed fica em:

```text
docker/mongo/seed-insights-keycloak-dev.js
```

---

## JWT

A API assina o JWT com segredo configurado por ambiente, como `SECRET_TOKEN`.

O token deve carregar informações suficientes para a API validar:

- usuário;
- roles;
- tenant;
- origem / `urlSlug`, quando aplicável.

Tokens, senhas e segredos nunca devem aparecer em logs ou código versionado.

---

## Roles

Roles esperadas no fluxo atual:

| Role | Uso |
|------|-----|
| `ADMIN` | Administração da plataforma / tenant. |
| `USER` | Consumo de relatórios autorizados. |

A UI e a API devem respeitar essas roles, mas a decisão de segurança deve estar no backend. O front pode esconder botões; a API precisa bloquear acesso indevido.

---

## Modelo multi-tenant

Hierarquia conceitual:

```text
Tenant
└── Customer
    ├── Department
    ├── User
    └── Report
        ├── Pages
        └── Filters / Target filters
```

O isolamento esperado é:

- um usuário só acessa dados do seu tenant;
- clientes pertencem a um tenant;
- departamentos, relatórios e filtros devem ser consultados com escopo de tenant;
- endpoints administrativos devem receber tenant da sessão, não confiar em tenant arbitrário vindo do cliente.

---

## Login clássico vs Keycloak

O fluxo diário usa login clássico com e-mail e senha.

Keycloak:

- não está ligado no Compose por padrão;
- não deve ser necessário para rodar a stack local;
- pode existir como botão desativado no front quando `NEXT_PUBLIC_INSIGHTS_SSO_ENABLED=false`;
- tem material versionado para implementação futura.

Documentação relacionada: [docker/KEYCLOAK.md](../docker/KEYCLOAK.md).

---

## Falhas comuns

| Sintoma | Possível causa |
|---------|----------------|
| Login retorna 401 | Credenciais erradas, senha sem hash no seed ou usuário fora do tenant. |
| Login retorna erro de tenant | `Origin` não corresponde ao tenant local. |
| Admin não vê configurações | Usuário sem role `ADMIN` ou sessão antiga. |
| Botão SSO desativado | Esperado quando `NEXT_PUBLIC_INSIGHTS_SSO_ENABLED=false`. |

---

## Links relacionados

- [README raiz](../README.md)
- [Desenvolvimento local](./LOCAL_DEVELOPMENT.md)
- [Escopo de produto](./PRODUCT_SCOPE.md)
- [Arquitetura](./ARCHITECTURE.md)
