
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
