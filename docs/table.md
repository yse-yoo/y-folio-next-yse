# 📘 テーブル定義書

---

## 1. `users`：ユーザー情報

| カラム名               | 型              | 制約                    | 説明                     |
|------------------------|------------------|-------------------------|--------------------------|
| id                     | VARCHAR(36)      | PRIMARY KEY             | ユーザーID（UUID）       |
| email                  | VARCHAR(255)     | UNIQUE, NOT NULL        | メールアドレス           |
| password_hash          | VARCHAR(255)     | NOT NULL                | ハッシュ化されたパスワード |
| name                   | VARCHAR(100)     | NOT NULL                | 氏名                     |
| university             | VARCHAR(200)     |                         | 大学名                   |
| grade                  | VARCHAR(50)      |                         | 学年                     |
| birth_date             | DATE             |                         | 生年月日                 |
| self_introduction      | TEXT             |                         | 自己紹介                 |
| is_active              | BOOLEAN           | DEFAULT TRUE            | アカウント有効フラグ     |
| email_verified         | BOOLEAN           | DEFAULT FALSE           | メール認証済みフラグ     |
| verification_token     | VARCHAR(255)     |                         | メール認証トークン       |
| reset_token            | VARCHAR(255)     |                         | パスワードリセットトークン |
| reset_token_expires    | DATETIME        |                         | リセットトークン有効期限 |
| created_at             | DATETIME        | DEFAULT CURRENT_TIMESTAMP | 作成日時               |
| updated_at             | DATETIME        | ON UPDATE CURRENT_TIMESTAMP | 更新日時           |

---

## 2. `recruiters`：採用担当者情報

| カラム名            | 型              | 制約             | 説明               |
|---------------------|------------------|------------------|--------------------|
| id                  | VARCHAR(36)      | PRIMARY KEY      | 採用担当者ID       |
| company_name        | VARCHAR(200)     | NOT NULL         | 会社名             |
| name                | VARCHAR(100)     | NOT NULL         | 氏名               |
| email               | VARCHAR(255)     | UNIQUE, NOT NULL | メールアドレス     |
| password_hash       | VARCHAR(255)     | NOT NULL         | パスワードハッシュ |
| position            | VARCHAR(100)     |                  | 役職               |
| department          | VARCHAR(100)     |                  | 部署               |
| phone               | VARCHAR(20)      |                  | 電話番号           |
| is_active           | BOOLEAN           | DEFAULT TRUE     | アカウント有効     |
| email_verified      | BOOLEAN           | DEFAULT FALSE    | メール認証済み     |
| verification_token  | VARCHAR(255)     |                  | 認証トークン       |
| reset_token         | VARCHAR(255)     |                  | リセットトークン   |
| reset_token_expires | DATETIME        |                  | トークン有効期限   |
| created_at          | DATETIME        | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at          | DATETIME        | ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 3. `sessions`：ログインセッション管理

| カラム名      | 型            | 制約                     | 説明                         |
|---------------|---------------|--------------------------|------------------------------|
| id            | VARCHAR(36)   | PRIMARY KEY              | セッションID（UUID）         |
| user_id       | VARCHAR(36)   | 外部キー(users.id)       | 一般ユーザーID（nullable）    |
| recruiter_id  | VARCHAR(36)   | 外部キー(recruiters.id)  | 採用担当者ID（nullable）      |
| user_type     | ENUM          | NOT NULL                 | 種別（'user', 'recruiter'）  |
| token         | VARCHAR(255)  | UNIQUE, NOT NULL         | セッショントークン            |
| expires_at    | DATETIME     | NOT NULL                 | 有効期限                      |
| ip_address    | VARCHAR(45)   |                          | IPアドレス                    |
| user_agent    | TEXT          |                          | ユーザーエージェント文字列    |
| created_at    | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時                      |

---

## 4. `portfolios`：ポートフォリオ本体

| カラム名                    | 型            | 制約                         | 説明               |
|-----------------------------|---------------|------------------------------|--------------------|
| id                          | VARCHAR(36)   | PRIMARY KEY                  | ポートフォリオID   |
| user_id                     | VARCHAR(36)   | NOT NULL, 外部キー(users.id) | 所有ユーザーID     |
| is_public                   | BOOLEAN       | DEFAULT TRUE                 | 公開フラグ         |
| auto_delete_after_one_year | BOOLEAN       | DEFAULT FALSE                | 自動削除フラグ     |
| created_at                  | DATETIME     | DEFAULT CURRENT_TIMESTAMP    | 作成日時           |
| updated_at                  | DATETIME     | ON UPDATE CURRENT_TIMESTAMP  | 更新日時           |

---

## 5. `portfolio_basic_info`：基本情報

| カラム名           | 型            | 制約                         | 説明               |
|--------------------|---------------|------------------------------|--------------------|
| id                 | VARCHAR(36)   | PRIMARY KEY                  | レコードID         |
| portfolio_id       | VARCHAR(36)   | UNIQUE, 外部キー(portfolios.id) | 紐づくポートフォリオID |
| name               | VARCHAR(100)  | NOT NULL                     | 氏名               |
| university         | VARCHAR(200)  | NOT NULL                     | 大学名             |
| grade              | VARCHAR(50)   | NOT NULL                     | 学年               |
| birth_date         | DATE          | NOT NULL                     | 生年月日           |
| email              | VARCHAR(255)  | NOT NULL                     | 連絡用メールアドレス |
| self_introduction  | TEXT          |                              | 自己紹介           |
| created_at         | DATETIME     | DEFAULT CURRENT_TIMESTAMP    | 作成日時           |
| updated_at         | DATETIME     | ON UPDATE CURRENT_TIMESTAMP  | 更新日時           |

---

## 6. `portfolio_skills`：スキル・資格

| カラム名         | 型          | 制約                          | 説明                     |
|------------------|-------------|-------------------------------|--------------------------|
| id               | VARCHAR(36) | PRIMARY KEY                   | スキルID                 |
| portfolio_id     | VARCHAR(36) | UNIQUE, 外部キー(portfolios.id) | ポートフォリオID         |
| skill_tags       | JSON        |                               | スキルタグ配列（JSON）   |
| certifications   | TEXT        |                               | 資格一覧                 |
| created_at       | DATETIME   | DEFAULT CURRENT_TIMESTAMP     | 作成日時                 |
| updated_at       | DATETIME   | ON UPDATE CURRENT_TIMESTAMP   | 更新日時                 |

---

## 7. `portfolio_projects`：プロジェクト実績

| カラム名     | 型            | 制約                         | 説明             |
|--------------|---------------|------------------------------|------------------|
| id           | VARCHAR(36)   | PRIMARY KEY                  | プロジェクトID   |
| portfolio_id | VARCHAR(36)   | 外部キー(portfolios.id)      | 所属ポートフォリオ |
| name         | VARCHAR(200)  | NOT NULL                     | プロジェクト名   |
| description  | TEXT          | NOT NULL                     | 詳細説明         |
| url          | VARCHAR(500)  |                              | リンク（任意）   |
| sort_order   | INT           | DEFAULT 0                    | 表示順序         |
| created_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP    | 作成日時         |
| updated_at   | DATETIME     | ON UPDATE CURRENT_TIMESTAMP  | 更新日時         |

---

## 8. `portfolio_experience`：経験・活動実績

| カラム名        | 型          | 制約                            | 説明               |
|------------------|-------------|----------------------------------|--------------------|
| id               | VARCHAR(36) | PRIMARY KEY                     | 経験情報ID         |
| portfolio_id     | VARCHAR(36) | UNIQUE, 外部キー(portfolios.id)  | 対象ポートフォリオ |
| internship       | TEXT        |                                  | インターン経験     |
| extracurricular  | TEXT        |                                  | 課外活動           |
| awards           | TEXT        |                                  | 表彰・受賞歴       |
| created_at       | DATETIME   | DEFAULT CURRENT_TIMESTAMP        | 作成日時           |
| updated_at       | DATETIME   | ON UPDATE CURRENT_TIMESTAMP      | 更新日時           |
