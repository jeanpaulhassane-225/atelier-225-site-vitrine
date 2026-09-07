// Active les hooks git versionnes du dossier .githooks/.
// Lance automatiquement apres `npm install` (script postinstall).
// Sans effet si on n'est pas dans un depot git (archive telechargee, etc.).

import { execSync } from 'node:child_process';

try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  process.exit(0); // pas un depot git, rien a faire
}

try {
  execSync('git config core.hooksPath .githooks');
  console.log('Hooks git actives : .githooks/');
} catch (err) {
  console.warn('Impossible d’activer les hooks git :', err.message);
}
