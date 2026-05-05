# Keycloak em Docker (`docker compose --profile keycloak up`)

URL interna para a API (rede Docker): `http://keycloak:8080`.  
Console admin (navegador): [http://localhost:8080](http://localhost:8080) (usuário/senha padrão `admin` / `admin`, sobrescreva com `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` no `.env`).

## Alinhar ao MongoDB (`tenants.realmId`)

O modelo de tenant exige que o campo `realmId` aponte para o **realm** do Keycloak usado naquele tenant (veja [insights.api/src/modules/tenant/repositories/mongo/tenant/tenant.schema.ts](../insights.api/src/modules/tenant/repositories/mongo/tenant/tenant.schema.ts)).

1. No admin do Keycloak, crie um **Realm** (ex.: `meu-cliente`).
2. No MongoDB, o documento em `tenants` para esse cliente deve ter `realmId` igual ao nome do realm (ex.: `"realmId": "meu-cliente"`).
3. Crie **Clients** e usuários no realm conforme o fluxo de login esperado pela aplicação (a API usa o endpoint de token do realm: `/realms/{realmId}/protocol/openid-connect/token`).

Sem esse alinhamento, o login via Keycloak retorna erro de realm/client inexistente ou certificado inválido.

## Variável de ambiente

No `.env` na raiz do repositório **insights-platform**, com o profile Keycloak ativo:

```env
KEYCLOAK_URL=http://keycloak:8080
```

A API resolve essa URL a partir de `config/local.yml` via `process.env` (substituição `${env:KEYCLOAK_URL, ''}`) ao subir o `serverless-offline` dentro do container.
