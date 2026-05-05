const execSync = require('child_process').execSync


const imageName = "devsecops-secrets-detection-image:latest";

const buildImageCmd = `docker build -f devsecops-secrets-detection/Dockerfile -t ${imageName} .`;

const scanRepositoryCmd = `docker run -v ${__dirname}/../:/app:ro\
 --rm ${imageName} protect \
--staged --source /app --verbose --no-banner --redact \
--config=/app/devsecops-secrets-detection/.gitleaks.toml`;

const removeImageCmd = `docker rmi ${imageName}`;

const playbookLink = "https://example.com/internal/security/gitleaks-playbook";
const complementaryMessage = `\n**Importante:** não altere o .gitleaks.toml sem alinhar com o time de segurança.\nLeia o playbook interno (configure o URL em devsecops-secrets-detection/secrets-detection.js) e contate o canal de segurança da sua organização.\n`;


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
