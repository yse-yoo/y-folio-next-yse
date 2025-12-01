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