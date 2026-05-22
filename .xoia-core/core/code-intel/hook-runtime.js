'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Resolve code intelligence for the file being written/edited.
 */
async function resolveCodeIntel(filePath, cwd) {
  const absPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const relPath = path.relative(cwd, absPath);

  const intel = {
    filePath: relPath,
    exists: fs.existsSync(absPath),
    entityType: detectEntityType(relPath),
    dependencies: [],
    references: [],
  };

  if (intel.exists) {
    try {
      const content = fs.readFileSync(absPath, 'utf8');
      intel.dependencies = extractImports(content);
    } catch (_) {}
  }

  intel.references = findReferences(absPath, cwd, path.basename(relPath, path.extname(relPath)));

  return intel;
}

/**
 * Format intel as XML for additionalContext injection.
 * Returns null when there is nothing meaningful to inject.
 */
function formatAsXml(intel, filePath) {
  if (!intel) return null;

  const parts = [];

  if (intel.entityType) {
    parts.push(`<entity type="${intel.entityType}" path="${escapeAttr(intel.filePath)}" />`);
  }

  if (intel.dependencies.length > 0) {
    const items = intel.dependencies.slice(0, 10)
      .map(d => `  <dep>${escapeXml(d)}</dep>`).join('\n');
    parts.push(`<dependencies>\n${items}\n</dependencies>`);
  }

  if (intel.references.length > 0) {
    const items = intel.references.slice(0, 5)
      .map(r => `  <ref>${escapeXml(r)}</ref>`).join('\n');
    parts.push(`<references>\n${items}\n</references>`);
  }

  if (parts.length === 0) return null;

  return `<code-intel-context file="${escapeAttr(intel.filePath)}">\n${parts.join('\n')}\n</code-intel-context>`;
}

function detectEntityType(relPath) {
  if (/\/components\//.test(relPath)) return 'component';
  if (/\/actions\//.test(relPath)) return 'action';
  if (/\/lib\//.test(relPath)) return 'library';
  if (/\/types\//.test(relPath)) return 'type';
  if (/\/api\//.test(relPath)) return 'api';
  if (/\/hooks\//.test(relPath)) return 'hook';
  if (/page\.(tsx?|jsx?)$/.test(relPath)) return 'page';
  if (/layout\.(tsx?|jsx?)$/.test(relPath)) return 'layout';
  if (/\.(tsx?|jsx?)$/.test(relPath)) return 'module';
  return null;
}

function extractImports(content) {
  const imports = [];
  const lines = content.split('\n').slice(0, 60);
  for (const line of lines) {
    const m = line.match(/^import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
    if (m) imports.push(m[1]);
  }
  return imports;
}

function findReferences(absPath, cwd, stem) {
  const results = [];
  if (!stem || stem.length < 2) return results;

  const searchDir = findSrcDir(cwd);
  if (searchDir) walkSearch(searchDir, stem, results, absPath, 5);

  return results;
}

function findSrcDir(cwd) {
  for (const candidate of ['app/src', 'src', 'app']) {
    const p = path.join(cwd, candidate);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function walkSearch(dir, term, results, excludePath, max) {
  if (results.length >= max) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }

  for (const entry of entries) {
    if (results.length >= max) return;
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSearch(full, term, results, excludePath, max);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && full !== excludePath) {
      try {
        if (fs.readFileSync(full, 'utf8').includes(term)) results.push(full);
      } catch (_) {}
    }
  }
}

function escapeXml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeXml(str).replace(/"/g, '&quot;');
}

module.exports = { resolveCodeIntel, formatAsXml };
