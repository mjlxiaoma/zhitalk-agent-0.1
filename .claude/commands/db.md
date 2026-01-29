# 数据库操作助手

执行数据库相关操作，包括迁移、Schema 修改等。

## 输入参数
- $ARGUMENTS: 操作类型和描述
  - `migrate` - 执行迁移
  - `add-table: 表名` - 添加新表
  - `add-column: 表名.列名` - 添加新列
  - `studio` - 打开 Drizzle Studio

## 项目数据库配置

- ORM: Drizzle ORM
- 数据库: PostgreSQL
- Schema 文件: `lib/db/schema.ts`
- 迁移目录: `lib/db/migrations/`

## 操作流程

### 添加新表
1. 阅读 `lib/db/schema.ts` 了解现有表结构
2. 在 schema.ts 中定义新表
3. 导出新表
4. 运行 `pnpm db:generate` 生成迁移文件
5. 运行 `pnpm db:migrate` 执行迁移

### 添加新列
1. 在 `lib/db/schema.ts` 中修改对应表
2. 生成并执行迁移

### Schema 定义规范
```typescript
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const myTable = pgTable('my_table', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### 常用命令
```bash
pnpm db:generate  # 生成迁移文件
pnpm db:migrate   # 执行迁移
pnpm db:studio    # 打开 Drizzle Studio
pnpm db:push      # 直接推送 schema（开发环境）
```

## 注意事项
- 生产环境修改需谨慎
- 破坏性变更需要数据迁移计划
- 保持表和列命名使用 snake_case
- 添加适当的索引提升查询性能
