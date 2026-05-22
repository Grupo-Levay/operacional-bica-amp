'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Handle PreCompact event — append session digest to xoia-memory before compaction.
 */
async function onPreCompact(context) {
  const { sessionId, projectDir, transcriptPath, trigger } = context;
  if (!projectDir) return;

  const memoryDir = path.join(projectDir, 'docs', 'xoia-memory');
  if (!fs.existsSync(memoryDir)) return;

  const digest = {
    date: new Date().toISOString().slice(0, 10),
    session_id: sessionId || null,
    trigger: trigger || 'auto',
    compacted_at: new Date().toISOString(),
  };

  if (transcriptPath && fs.existsSync(transcriptPath)) {
    try {
      const raw = fs.readFileSync(transcriptPath, 'utf8');
      digest.line_count = raw.split('\n').length;
    } catch (_) {}
  }

  try {
    const sessionsLog = path.join(memoryDir, 'sessions.jsonl');
    fs.appendFileSync(sessionsLog, JSON.stringify(digest) + '\n');
  } catch (_) {}
}

module.exports = { onPreCompact };
