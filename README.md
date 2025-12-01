

# 開発環境
## インストール
### Gemini API ライブラリ

```bash
npm install @google/genai
```

.env に追加
```env
GEMINI_API_KEY="Google AI Studioのキー"
```

### Prisam インストール
```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Prisma 初期化
```bash
npx prisma init
```

### .env
.env にデータベース接続情報を記述

```env
DATABASE_URL="mysql://root@localhost:3306/y-folio"
```

## DB初期化
1. prisma/migrations を削除

2. マイグレーションリセット
```bash
npx prisma migrate reset
```

3. マイグレーション実行
```bash
npx prisma migrate dev --name init
```

4. Prisma Client の再生成
```bash
npx prisma generate
```

## インストール
### Gemini API ライブラリ

```bash
npm install @google/genai
```

.env に追加
```env
GEMINI_API_KEY="Google AI Studioのキー"
```


### Prisam インストール
```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Prisma 初期化
```bash
npx prisma init
```

### .env
.env にデータベース接続情報を記述

```env
DATABASE_URL="mysql://root@localhost:3306/y-folio"
```

## DB初期化
1. prisma/migrations を削除

2. マイグレーションリセット
```bash
npx prisma migrate reset
```

3. マイグレーション実行
```bash
npx prisma migrate dev --name init
```

4. Prisma Client の再生成
```bash
npx prisma generate
```

### マイグレーション
```bash
npx prisma migrate dev --name マイグレーション名
```

## DB再構築
```bash
npx prisma migrate reset
```

## Firebase 認証のPrismaへの反映（同期）
このプロジェクトでは、Firebaseでログイン成功後にIDトークンをサーバーへ送信し、PrismaのUserテーブルへユーザー情報（firebaseUid, email, name, photoURL, email_verifiedなど）を同期します。

### 追加インストール
```bash
npm install firebase-admin
```

### 追加の環境変数
以下のどちらかの方法で Firebase Admin の認証情報を設定してください。

1) サービスアカウントJSONを1つの環境変数で設定
```env
# 文字列化したサービスアカウントJSON（改行は \n にエスケープ）
FIREBASE_SERVICE_ACCOUNT='{"project_id":"...","client_email":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"}'
```

2) 個別の環境変数で設定
```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-admin-sdk@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Prisma スキーマの変更
User モデルに以下のフィールドが追加されています。
- firebaseUid: String? @unique @map("firebase_uid")
- photoURL: String? @map("photo_url")

スキーマを反映するにはマイグレーションを実行してください。
```bash
npx prisma migrate dev --name add_firebase_uid
npx prisma generate
```

### 挙動
- クライアント側（/login）で Firebase へのサインインが成功すると、IDトークンを `/api/auth/sync` に POST します。
- サーバー側でトークンを検証し、User を email で upsert して firebaseUid や email_verified を更新（なければ作成）します。

これにより、Firebaseのログイン情報がPrismaのUserテーブルに反映されます。


# Vercel デプロイ手順
## 1: Gitリポジトリへのプッシュ
デプロイしたいNext.jsプロジェクトをGitリポジトリにプッシュして

## 2: Vercelアカウントの作成と連携
1.  Vercelアカウントにログイン
    https://vercel.com/


2. GitHub連携
Import Git Repository で、GitHub を選択し、手順に従って [Install]

3.  プロジェクトのインポート
表示されたプロジェクトを [Import]

## 3: プロジェクトの設定（ゼロコンフィグレーション）
| 設定項目 | Vercelの自動設定 (Next.jsの場合) |
| :--- | :--- |
| **Framework Preset** | Next.js |
| **Root Directory** | プロジェクトのルートディレクトリ |
| **Build Command** | `next build` |
| **Output Directory** | `public` |
| **Development Command** | `next dev` |

#### 環境変数の設定 
`.env` を使用している場合に設定

1.  **"Environment Variables"** セクションを展開します。
2.  `NEXT_PUBLIC_...` 以外の環境変数（APIキーなど）を **Key** と **Value** のペアで入力
3.  デプロイ環境（Preview, Development, Production）を選択し、「**Add**」

### 4: デプロイの実行
「**Deploy**」ボタンをクリック

## デプロイ後の自動更新
### CI/CD
一度デプロイを設定すると、その後の更新は完全に自動化
