-- ============================================================
-- Seed — Bica Bar & AMP 213
-- Dados iniciais para ambiente operacional
-- ============================================================

-- ------------------------------------------------------------
-- EQUIPE
-- ------------------------------------------------------------
INSERT INTO equipe (id, nome, funcao, turno, ativo, casa) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Lana',    'Gerente Operacional', 'abertura',   true, 'bica'),
  ('e1000000-0000-0000-0000-000000000002', 'Ruan',    'Estoquista',          'fechamento',  true, 'bica'),
  ('e1000000-0000-0000-0000-000000000003', 'Thaynan', 'Auditor',             'abertura',   true, 'bica')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CHECKLISTS
-- ------------------------------------------------------------
INSERT INTO checklists (id, nome, turno, itens, casa) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Abertura do Bar',
    'abertura',
    '["Ligar sistema de som","Ligar iluminação","Abrir caixa registradora","Conferir estoque de bebidas","Conferir estoque de gelo","Abastecer bar com gelo","Limpar balcão e mesas","Conferir validade dos insumos","Ligar ar-condicionado","Verificar higiene dos banheiros"]'::jsonb,
    'bica'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'Fechamento do Bar',
    'fechamento',
    '["Fechar caixa registradora","Registrar vendas do dia","Guardar bebidas abertas","Lavar copos e utensílios","Limpar balcão e mesas","Recolher lixo","Desligar ar-condicionado","Desligar som e iluminação","Travar portas e janelas","Verificar cofre"]'::jsonb,
    'bica'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- ESTOQUE — Categorias
-- ------------------------------------------------------------
INSERT INTO estoque_categorias (id, nome, emoji, ordem, casa) VALUES
  ('ec000001-0000-0000-0000-000000000001', 'Cervejas',       '🍺', 1, 'bica'),
  ('ec000001-0000-0000-0000-000000000002', 'Destilados',     '🥃', 2, 'bica'),
  ('ec000001-0000-0000-0000-000000000003', 'Não Alcoólicos', '🥤', 3, 'bica'),
  ('ec000001-0000-0000-0000-000000000004', 'Alimentos',      '🍽️', 4, 'bica'),
  ('ec000001-0000-0000-0000-000000000005', 'Limpeza',        '🧹', 5, 'bica'),
  ('ec000001-0000-0000-0000-000000000006', 'Descartáveis',   '📦', 6, 'bica')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- ESTOQUE — Itens
-- ------------------------------------------------------------
INSERT INTO estoque_itens (id, nome, unidade, atual, minimo, categoria_id, ativo, casa) VALUES
  -- Cervejas
  ('ei000001-0000-0000-0000-000000000001', 'Skol Lata 350ml',     'un',  48,  24, 'ec000001-0000-0000-0000-000000000001', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000002', 'Brahma Lata 350ml',   'un',  36,  24, 'ec000001-0000-0000-0000-000000000001', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000003', 'Heineken Long Neck',  'un',  24,  12, 'ec000001-0000-0000-0000-000000000001', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000004', 'Corona Long Neck',    'un',  12,  12, 'ec000001-0000-0000-0000-000000000001', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000005', 'Gelo',                'kg',   8,  20, 'ec000001-0000-0000-0000-000000000001', true, 'bica'),
  -- Destilados
  ('ei000001-0000-0000-0000-000000000006', 'Vodka Smirnoff 1L',   'un',   4,   2, 'ec000001-0000-0000-0000-000000000002', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000007', 'Gin Tanqueray 750ml', 'un',   2,   1, 'ec000001-0000-0000-0000-000000000002', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000008', 'Whisky Jack Daniel''s 1L', 'un', 2, 1, 'ec000001-0000-0000-0000-000000000002', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000009', 'Cachaça 51 1L',       'un',   3,   2, 'ec000001-0000-0000-0000-000000000002', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000010', 'Rum Bacardi 750ml',   'un',   1,   1, 'ec000001-0000-0000-0000-000000000002', true, 'bica'),
  -- Não Alcoólicos
  ('ei000001-0000-0000-0000-000000000011', 'Coca-Cola Lata 350ml',  'un', 24, 12, 'ec000001-0000-0000-0000-000000000003', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000012', 'Soda Limonada 350ml',   'un', 12,  6, 'ec000001-0000-0000-0000-000000000003', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000013', 'Água Mineral 500ml',    'un', 18, 12, 'ec000001-0000-0000-0000-000000000003', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000014', 'Energético Red Bull',   'un',  8,  6, 'ec000001-0000-0000-0000-000000000003', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000015', 'Suco de Limão (L)',      'L',   2,  2, 'ec000001-0000-0000-0000-000000000003', true, 'bica'),
  -- Alimentos
  ('ei000001-0000-0000-0000-000000000016', 'Amendoim Torrado (kg)',  'kg',  3,  2, 'ec000001-0000-0000-0000-000000000004', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000017', 'Chips Batata (pacote)',  'un',  5,  4, 'ec000001-0000-0000-0000-000000000004', true, 'bica'),
  -- Limpeza
  ('ei000001-0000-0000-0000-000000000018', 'Álcool 70% (L)',         'L',   2,  1, 'ec000001-0000-0000-0000-000000000005', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000019', 'Detergente 500ml',       'un',  3,  2, 'ec000001-0000-0000-0000-000000000005', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000020', 'Pano de Bar',            'un',  6,  4, 'ec000001-0000-0000-0000-000000000005', true, 'bica'),
  -- Descartáveis
  ('ei000001-0000-0000-0000-000000000021', 'Copo Plástico 300ml (pct)', 'pct', 4, 2, 'ec000001-0000-0000-0000-000000000006', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000022', 'Canudinho (cx)',         'cx',  2,  1, 'ec000001-0000-0000-0000-000000000006', true, 'bica'),
  ('ei000001-0000-0000-0000-000000000023', 'Guardanapo (pct)',       'pct', 3,  2, 'ec000001-0000-0000-0000-000000000006', true, 'bica')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- COMPRAS — Categorias
-- ------------------------------------------------------------
INSERT INTO compras_categorias (id, nome, emoji, ordem) VALUES
  ('cc000001-0000-0000-0000-000000000001', 'Bebidas',        '🍺', 1),
  ('cc000001-0000-0000-0000-000000000002', 'Alimentos',      '🍽️', 2),
  ('cc000001-0000-0000-0000-000000000003', 'Limpeza',        '🧹', 3),
  ('cc000001-0000-0000-0000-000000000004', 'Descartáveis',   '📦', 4)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- COMPRAS — Itens do catálogo
-- ------------------------------------------------------------
INSERT INTO compras_itens (id, nome, unidade, categoria_id) VALUES
  ('ci000001-0000-0000-0000-000000000001', 'Skol Lata 350ml',         'cx 12un', 'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000002', 'Brahma Lata 350ml',       'cx 12un', 'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000003', 'Heineken Long Neck',      'cx 12un', 'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000004', 'Vodka Smirnoff 1L',       'un',      'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000005', 'Gin Tanqueray 750ml',     'un',      'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000006', 'Coca-Cola Lata 350ml',    'cx 12un', 'cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000007', 'Gelo',                    'saco 8kg','cc000001-0000-0000-0000-000000000001'),
  ('ci000001-0000-0000-0000-000000000008', 'Amendoim Torrado',        'kg',      'cc000001-0000-0000-0000-000000000002'),
  ('ci000001-0000-0000-0000-000000000009', 'Álcool 70%',              'L',       'cc000001-0000-0000-0000-000000000003'),
  ('ci000001-0000-0000-0000-000000000010', 'Detergente',              'un',      'cc000001-0000-0000-0000-000000000003'),
  ('ci000001-0000-0000-0000-000000000011', 'Copo Plástico 300ml',     'pct 50un','cc000001-0000-0000-0000-000000000004'),
  ('ci000001-0000-0000-0000-000000000012', 'Guardanapo',              'pct',     'cc000001-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- FICHAS TÉCNICAS (exemplos)
-- ------------------------------------------------------------
INSERT INTO fichas_tecnicas (id, nome, categoria, preco_venda, custo_total, cmv_pct, ativo) VALUES
  ('ft000001-0000-0000-0000-000000000001', 'Caipirinha de Limão',  'Drinques',  22.00, 4.50,  20.5, true),
  ('ft000001-0000-0000-0000-000000000002', 'Long Island Ice Tea',  'Drinques',  35.00, 9.80,  28.0, true),
  ('ft000001-0000-0000-0000-000000000003', 'Gin Tônica',           'Drinques',  30.00, 7.20,  24.0, true),
  ('ft000001-0000-0000-0000-000000000004', 'Heineken Long Neck',   'Cervejas',  15.00, 4.00,  26.7, true),
  ('ft000001-0000-0000-0000-000000000005', 'Skol Lata',            'Cervejas',   8.00, 2.50,  31.2, true),
  ('ft000001-0000-0000-0000-000000000006', 'Corona Long Neck',     'Cervejas',  18.00, 5.00,  27.8, true)
ON CONFLICT (id) DO NOTHING;
