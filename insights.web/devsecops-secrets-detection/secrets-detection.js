const execSync = require('child_process').execSync


const imageName = "devsecops-secrets-detection-image:latest";

const buildImageCmd = `docker build -f devsecops-secrets-detection/Dockerfile -t ${imageName} .`;

const scanRepositoryCmd = `docker run -v ${__dirname}/../:/app:ro\
 --rm ${imageName} protect \
--staged --source /app --verbose --no-banner --redact \
--config=/app/devsecops-secrets-detection/.gitleaks.toml`;

const removeImageCmd = `docker rmi ${imageName}`;

const playbookLink = "https://nreeducacional.sharepoint.com/:w:/r/sites/SREAfya/Documentos%20Compartilhados/playbooks-devsecops/medcel/playbook-gitleaks.docx?d=w748de0d70a7b4a7cb11df2dfba359621&csf=1&web=1&e=C76vB6";
const complementaryMessage = `\n**Importante não alterar o arquivo de configuração, sem antes alinhar com o time de desecops(Foundation).\nEm caso de dúvidas e/ou ter credenciais hardcoded no projeto, realizar \
a leitura do playbook em: ${playbookLink}, e em caso de dúvidas remanescentes entrar em contato com o \
time de devsecops:\nJan Palach: jan.palach@afya.com.br\nDiego Sandrim: diego.sandrim@afya.com.br\n\
Rafael Amaral: rafael.amaral@afya.com.br\n`;


function execCommandSync(command) {
    return execSync(command);
};

function main() {
    try {
        let exitCode = execCommandSync(buildImageCmd);
        exitCode = execCommandSync(scanRepositoryCmd);
    } catch(e) {
        console.log(`${e.stdout}\n${complementaryMessage}`);
        execCommandSync(removeImageCmd);
        process.exit(1);
    } finally {
        execCommandSync(removeImageCmd);
    }
};

main();
