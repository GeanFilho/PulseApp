-- migrations/001_create_initial_tables.sql

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para a tabela de usuários
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Tabela de feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  motivation INTEGER NOT NULL CHECK (motivation >= 0 AND motivation <= 10),
  workload INTEGER NOT NULL CHECK (workload >= 0 AND workload <= 10),
  performance INTEGER NOT NULL CHECK (performance >= 0 AND performance <= 10),
  support VARCHAR(20) NOT NULL CHECK (support IN ('Sim', 'Não', 'Em partes')),
  positive_event TEXT,
  improvement_suggestion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para a tabela de feedbacks
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_date ON feedbacks(date);

-- Função para atualizar o timestamp "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp "updated_at" na tabela de usuários
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o timestamp "updated_at" na tabela de feedbacks
CREATE TRIGGER update_feedbacks_updated_at
BEFORE UPDATE ON feedbacks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de usuários para demonstração (apenas se a tabela estiver vazia)
INSERT INTO users (name, email, password, department, role)
SELECT 
  'Maria Santos', 
  'admin@exemplo.com', 
  '$2b$10$XZB5XE6JkYUuL3UNXHIp.eVbG3eLRbqh.oTUYwZP4ys2QH.DT/9I2', -- hash para 'senha123'
  'Gestão',
  'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@exemplo.com');

INSERT INTO users (name, email, password, department, role)
SELECT 
  'João Silva', 
  'joao@exemplo.com', 
  '$2b$10$XZB5XE6JkYUuL3UNXHIp.eVbG3eLRbqh.oTUYwZP4ys2QH.DT/9I2', -- hash para 'senha123'
  'Desenvolvimento',
  'employee'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'joao@exemplo.com');

INSERT INTO users (name, email, password, department, role)
SELECT 
  'Ana Oliveira', 
  'ana@exemplo.com', 
  '$2b$10$XZB5XE6JkYUuL3UNXHIp.eVbG3eLRbqh.oTUYwZP4ys2QH.DT/9I2', -- hash para 'senha123'
  'Marketing',
  'employee'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ana@exemplo.com');

-- Inserir alguns dados de feedbacks para demonstração (apenas se a tabela estiver vazia)
DO $$
DECLARE
  joao_id INTEGER;
  ana_id INTEGER;
BEGIN
  SELECT id INTO joao_id FROM users WHERE email = 'joao@exemplo.com';
  SELECT id INTO ana_id FROM users WHERE email = 'ana@exemplo.com';
  
  IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE user_id = joao_id AND date = CURRENT_DATE - INTERVAL '2 days') THEN
    INSERT INTO feedbacks (user_id, date, motivation, workload, performance, support, improvement_suggestion)
    VALUES (joao_id, CURRENT_DATE - INTERVAL '2 days', 4, 9, 4, 'Sim', 'teste yuri 2');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE user_id = ana_id AND date = CURRENT_DATE - INTERVAL '2 days') THEN
    INSERT INTO feedbacks (user_id, date, motivation, workload, performance, support, positive_event)
    VALUES (ana_id, CURRENT_DATE - INTERVAL '2 days', 7, 6, 8, 'Em partes', 'Conseguimos terminar o projeto no prazo');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE user_id = joao_id AND date = CURRENT_DATE - INTERVAL '9 days') THEN
    INSERT INTO feedbacks (user_id, date, motivation, workload, performance, support, improvement_suggestion)
    VALUES (joao_id, CURRENT_DATE - INTERVAL '9 days', 5, 8, 6, 'Não', 'Precisamos organizar melhor as prioridades');
  END IF;
END $$;