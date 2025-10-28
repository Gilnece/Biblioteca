-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Unidades (bibliotecas)
CREATE TABLE unit (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Perfis / roles
CREATE TABLE role (
  id serial PRIMARY KEY,
  name varchar(50) UNIQUE NOT NULL -- e.g. super_admin, admin, librarian, clerk, reader
);

-- Usuários
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(255) UNIQUE NOT NULL,
  password_hash text,
  full_name text,
  phone text,
  active boolean DEFAULT true,
  role_id int REFERENCES role(id),
  unit_id uuid REFERENCES unit(id), -- null para super admin ou leitores globais
  created_at timestamptz DEFAULT now()
);

-- Autores
CREATE TABLE author (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  bio text
);

-- Categorias
CREATE TABLE category (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  parent_id uuid REFERENCES category(id)
);

-- Obras / títulos (obra que representa um livro/registro bibliográfico)
CREATE TABLE work (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  subtitle text,
  isbn varchar(20),
  publisher text,
  year int,
  description text,
  language varchar(10),
  cover_url text,
  created_at timestamptz DEFAULT now()
);

-- relação obra <-> autor (muitos para muitos)
CREATE TABLE work_author (
  work_id uuid REFERENCES work(id),
  author_id uuid REFERENCES author(id),
  PRIMARY KEY (work_id, author_id)
);

-- Campos customizáveis para obras (salvo em JSON)
ALTER TABLE work ADD COLUMN custom JSONB DEFAULT '{}'::jsonb;

-- Exemplares (cópias físicas/eletrônicas)
CREATE TABLE copy (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id uuid REFERENCES work(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES unit(id),
  barcode varchar(100) UNIQUE,
  accession_number varchar(100),
  status varchar(20) NOT NULL DEFAULT 'available', -- available, loaned, reserved, lost, maintenance
  location text,
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Reservas
CREATE TABLE reservation (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES "user"(id),
  work_id uuid REFERENCES work(id),
  copy_id uuid REFERENCES copy(id),
  status varchar(20) DEFAULT 'pending', -- pending, notified, collected, cancelled, expired
  reserved_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Empréstimos
CREATE TABLE loan (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES "user"(id),
  copy_id uuid REFERENCES copy(id),
  unit_id uuid REFERENCES unit(id),
  loaned_at timestamptz DEFAULT now(),
  due_at timestamptz,
  returned_at timestamptz,
  renewed_count int DEFAULT 0,
  status varchar(20) DEFAULT 'active' -- active, returned, overdue, lost
);

-- Multas / penalidades
CREATE TABLE fine (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES "user"(id),
  loan_id uuid REFERENCES loan(id),
  amount numeric(10,2),
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Holidays (para regras de contagem de prazos)
CREATE TABLE holiday (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id uuid REFERENCES unit(id),
  date date NOT NULL,
  description text
);

-- Activity log/auditoria
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id uuid REFERENCES "user"(id),
  unit_id uuid REFERENCES unit(id),
  action varchar(100),
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Settings / Super Admin global
CREATE TABLE global_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb
);

-- Email templates
CREATE TABLE email_template (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  subject text,
  body text, -- allow handlebars-like variables {{name}}
  created_at timestamptz DEFAULT now()
);