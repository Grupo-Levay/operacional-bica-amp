'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Resolve the SYNAPSE hook runtime from UserPromptSubmit input.
 * Returns null if the project has no xoia-memory → silent skip.
 */
function resolveHookRuntime(input) {
  const cwd = (input && input.cwd) ? input.cwd : process.cwd();
  const memoryDir = path.join(cwd, 'docs', 'xoia-memory');

  if (!fs.existsSync(memoryDir)) return null;

  const sessionsDir = path.join(memoryDir, 'sessions');
  const sessionId = (input && input.session_id) ? input.session_id : null;

  return {
    engine: createSynapseEngine(cwd, memoryDir),
    session: loadSession(sessionId, sessionsDir),
    sessionId,
    sessionsDir,
    cwd,
  };
}

function createSynapseEngine(cwd, memoryDir) {
  return {
    async process(prompt, session) {
      const xml = buildContextXml(prompt, cwd, memoryDir, session);
      const bracket = detectBracket(prompt);
      return { xml, bracket };
    },
  };
}

function buildContextXml(prompt, cwd, memoryDir, session) {
  const parts = [];

  // Inject learnings when non-trivial content exists
  const learningsPath = path.join(memoryDir, 'learnings.md');
  if (fs.existsSync(learningsPath)) {
    try {
      const raw = fs.readFileSync(learningsPath, 'utf8').trim();
      const hasEntries = raw.includes('## [');
      if (hasEntries) {
        parts.push(`<learnings>${escapeXml(raw)}</learnings>`);
      }
    } catch (_) {}
  }

  // Inject active story if one is in progress
  const storiesDir = path.join(cwd, 'docs', 'stories');
  if (fs.existsSync(storiesDir)) {
    try {
      const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(storiesDir, file), 'utf8');
        if (content.includes('status: doing') || content.includes('**Status:** doing')) {
          parts.push(`<active-story file="${file}">${escapeXml(content.slice(0, 1500))}</active-story>`);
          break;
        }
      }
    } catch (_) {}
  }

  // Inject current session bracket when available
  if (session && session.context && session.context.last_bracket) {
    parts.push(`<session-bracket>${escapeXml(session.context.last_bracket)}</session-bracket>`);
  }

  if (parts.length === 0) return '';
  return `<synapse-context>\n${parts.join('\n')}\n</synapse-context>`;
}

function detectBracket(prompt) {
  if (!prompt) return 'FRESH';
  const p = prompt.toLowerCase();
  if (p.match(/\bplan\b|\bstory\b|\bspec\b|\bprd\b/)) return 'PLAN';
  if (p.match(/\bbuild\b|\bimplement\b|\bfix\b|\bcreate\b|\badd\b/)) return 'BUILD';
  if (p.match(/\btest\b|\blint\b|\bcheck\b|\bvalidat\b/)) return 'CHECK';
  if (p.match(/\bpush\b|\bpr\b|\bship\b|\bdeploy\b|\bcommit\b/)) return 'SHIP';
  return 'FRESH';
}

function loadSession(sessionId, sessionsDir) {
  if (!sessionId || !sessionsDir) return null;
  try {
    const p = path.join(sessionsDir, `${sessionId}.json`);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {}
  return null;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Build the stdout payload for Claude Code UserPromptSubmit hook.
 * Returns empty object when xml is blank so no empty block is injected.
 */
function buildHookOutput(xml) {
  if (!xml || !xml.trim()) return {};
  return { prompt_injection: xml };
}

module.exports = { resolveHookRuntime, buildHookOutput };
