-- 0004 — Estados de comparecimento em reservas
-- Adiciona 'presente' (check-in: cliente chegou) e 'nao_compareceu' (no-show)
-- ao enum reservation_status, ampliando a máquina de estados operacional.
--
-- Máquina de estados resultante:
--   pendente   → confirmada | cancelada
--   confirmada → presente | nao_compareceu | cancelada
--   presente   → concluida | cancelada
--   concluida / cancelada / nao_compareceu = terminais
--
-- Idempotente. ADD VALUE não pode ser usado na mesma transação em que é criado,
-- mas como esta migração apenas declara os valores (sem usá-los), é seguro.

ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'presente' AFTER 'confirmada';
ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'nao_compareceu' AFTER 'cancelada';
