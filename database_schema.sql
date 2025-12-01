-- Y-folio データベーススキーマ
-- ポートフォリオ編集画面用テーブル設計

-- データベース作成
CREATE DATABASE IF NOT EXISTS y_folio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE y_folio_db;

-- ユーザーテーブル（一般ユーザー）
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    university VARCHAR(200),
    grade VARCHAR(50),
    birth_date DATE,
    self_introduction TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 採用担当者テーブル
CREATE TABLE recruiters (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- セッションテーブル（ログイン管理）
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    recruiter_id VARCHAR(36),
    user_type ENUM('user', 'recruiter') NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- ポートフォリオ基本テーブル
CREATE TABLE portfolios (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    auto_delete_after_one_year BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 基本情報テーブル
CREATE TABLE portfolio_basic_info (
    portfolio_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    university VARCHAR(200) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    self_introduction TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- スキル・技術テーブル
CREATE TABLE portfolio_skills (
    portfolio_id VARCHAR(36) PRIMARY KEY,
    skill_tags JSON, -- ["JavaScript", "React", "Python"]
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- プロジェクト・実績テーブル
CREATE TABLE portfolio_projects (
    id VARCHAR(36) PRIMARY KEY,
    portfolio_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- 経験・活動テーブル
CREATE TABLE portfolio_experience (
    portfolio_id VARCHAR(36) PRIMARY KEY,
    internship TEXT,
    extracurricular TEXT,
    awards TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_recruiters_email ON recruiters(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_recruiter_id ON sessions(recruiter_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolio_projects_portfolio_id ON portfolio_projects(portfolio_id);
CREATE INDEX idx_portfolio_projects_sort_order ON portfolio_projects(sort_order);

-- サンプルデータ挿入（テスト用）
INSERT INTO users (id, email, password_hash, name, university, grade, birth_date, self_introduction) VALUES 
('user_001', 'tanaka@example.com', '$2y$10$example_hash', '田中 太郎', '東京大学 情報科学科', '4年生', '2000-01-01', 'Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。');

INSERT INTO recruiters (id, company_name, name, email, password_hash, position, department) VALUES 
('recruiter_001', '株式会社サンプル', '山田 花子', 'yamada@sample.co.jp', '$2y$10$example_hash', '採用担当', '人事部');

INSERT INTO portfolios (id, user_id, is_public, auto_delete_after_one_year) VALUES 
('portfolio_001', 'user_001', TRUE, FALSE);

INSERT INTO portfolio_basic_info (portfolio_id, name, university, grade, birth_date, email, self_introduction) VALUES 
('portfolio_001', '田中 太郎', '東京大学 情報科学科', '4年生', '2000-01-01', 'tanaka@example.com', 'Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。');

INSERT INTO portfolio_skills (portfolio_id, skill_tags, certifications) VALUES 
('portfolio_001', '["JavaScript", "React", "Python"]', 'TOEIC 900点');

INSERT INTO portfolio_projects (id, portfolio_id, name, description, url, sort_order) VALUES 
('proj_001', 'portfolio_001', 'AIチャットボット開発', '社内向けAIチャットボットを開発。PythonとReactを使用し、業務効率化に貢献。', 'https://github.com/tanaka/ai-chatbot', 1),
('proj_002', 'portfolio_001', 'Webポートフォリオサイト', '自身の実績をまとめたWebポートフォリオサイトを作成。Next.jsとTailwind CSSを活用。', 'https://tanaka-portfolio.com', 2);

INSERT INTO portfolio_experience (portfolio_id, internship, extracurricular, awards) VALUES 
('portfolio_001', '株式会社サンプルでAI開発インターンを経験。実務での開発フローを学びました。', 'プログラミングサークル所属。ハッカソン参加経験あり。', '2024年 学生ハッカソン最優秀賞'); 