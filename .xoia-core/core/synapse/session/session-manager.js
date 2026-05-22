'use strict';

const fs = require('fs');
const path = require('path');

function updateSession(sessionId, sessionsDir, data) {
  if (!sessionId || !sessionsDir) return;
  try {
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

    const filePath = path.join(sessionsDir, `${sessionId}.json`);
    let existing = {};
    if (fs.existsSync(filePath)) {
      try { existing = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (_) {}
    }

    const updated = deepMerge(existing, data);
    updated.updated_at = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  } catch (_) {}
}

function loadSession(sessionId, sessionsDir) {
  if (!sessionId || !sessionsDir) return null;
  try {
    const filePath = path.join(sessionsDir, `${sessionId}.json`);
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {}
  return null;
}

function deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = deepMerge(result[key] || {}, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

module.exports = { updateSession, loadSession };
