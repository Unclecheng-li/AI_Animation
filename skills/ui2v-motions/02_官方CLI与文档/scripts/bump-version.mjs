import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const nextVersion = process.argv[2];

if (!nextVersion) {
  fail('Usage: node scripts/bump-version.mjs <version>');
}

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(nextVersion)) {
  fail(`Invalid semver version: ${nextVersion}`);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageFiles = [
  join(root, 'package.json'),
  ...readdirSync(join(root, 'packages'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(root, 'packages', entry.name, 'package.json'))
    .filter(existsSync),
];

for (const file of packageFiles) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  pkg.version = nextVersion;

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = pkg[field];
    if (!deps) continue;

    for (const name of Object.keys(deps)) {
      if (name.startsWith('@ui2v/')) {
        deps[name] = nextVersion;
      }
    }
  }

  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  console.log(`Updated ${relativePath(file)} -> ${nextVersion}`);
}

function relativePath(file) {
  return file.replace(root, '').replace(/^[/\\]/, '').replaceAll('\\', '/');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
