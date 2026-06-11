# 产品知识中心设计规格

更新日期：2026-06-11

## 1. 目标

在现有 Pharma CI Radar 中新增一个任务优先的产品知识中心，使战略、产品经理、应用工程和销售能够：

1. 检索 Bürkert、GEMÜ、Fujikin 和 ESG 精锐的产品目录与系列映射。
2. 从制药客户任务进入候选产品、必问工况和排除条件。
3. 在页面内执行30天训练、提交每日产出并完成教练审核。
4. 在页面内推进16项内部验证任务、登记证据索引并控制结论升级。

产品和研究事实继续以版本控制中的CSV为权威主档；团队执行状态保存到PostgreSQL。首版不修改历史竞争评分，不在数据库中复制全部产品目录，也不上传敏感附件。

## 2. 用户与权限

首版沿用现有单团队登录，不新增复杂角色和权限系统。

- 已登录用户可以读取全部知识资料。
- 已登录用户可以创建学员、提交训练产出、记录成绩、更新验证任务和登记证据。
- 教练审核与任务复核通过显式表单字段记录审核人，不建立独立教练角色。
- 受控文档库权限仍由外部系统管理，本应用只保存文件位置和非敏感摘要。

这是一项明确的首版限制。后续如进入多团队或外部协作，再增加基于用户角色的写入权限。

## 3. 信息架构

### 3.1 导航

在现有侧栏新增：

```text
知识中心  /knowledge
```

不删除或重命名现有导航。竞品详情和来源审核继续承担原有职责。

### 3.2 页面结构

`/knowledge` 使用查询参数切换四个视图：

```text
/knowledge
/knowledge?view=products
/knowledge?view=training
/knowledge?view=validation
```

页面顶部提供统一搜索和四个页签。

#### 工作台

首屏采用任务优先布局：

- 为客户选型
- 比较竞品
- 准备客户拜访
- 继续训练
- 验证一个判断

同时展示：

- Bürkert Type数量
- 三家竞品目录记录数
- 制药应用场景数
- 内部验证任务数与P0状态
- 当前学员训练进度
- 重点产品战场

#### 产品与场景

提供一个统一搜索框和筛选器：

- 公司
- 产品类别
- 制药相关性
- 记录类型：Bürkert Type、竞品系列、场景、映射

搜索结果必须显示：

- 公司和产品/系列标识
- 产品角色或应用
- 制药相关性
- 证据或官方链接
- 中国公开可见性或证据成熟度
- 不能据此推断的边界

场景结果展开后显示四家公司候选、必问工况、Bürkert排除项、竞品观察点和内部验证问题。

#### 训练

提供：

- 学员与批次选择
- 30天课程清单
- 每日状态：`NOT_STARTED`、`IN_PROGRESS`、`SUBMITTED`、`COMPLETE`
- 产出位置、自我复盘、教练、审核结果与反馈
- BASELINE、DAY-10、DAY-20、DAY-30和RETEST成绩
- 致命错误、补强日期和结业状态

课程内容和通过标准来自CSV，不能在页面内修改。页面只更新执行记录。

#### 验证

提供：

- 16项验证任务及P0/P1筛选
- 公司、负责人、状态和目标窗口
- 最小样本数、当前已验证证据数
- 验收规则和不合格规则
- 证据索引登记
- 状态升级或降级

证据登记只保存摘要和文件位置，不上传报价、PO、客户文件或受限证书。

## 4. 数据架构

### 4.1 CSV只读主档

新增 `src/lib/knowledge/` 模块，在服务端解析以下数据：

- `burkert-type-catalog.csv`
- `gemu-series-catalog.csv`
- `fujikin-series-catalog.csv`
- `esg-series-catalog.csv`
- 各公司Bürkert系列映射
- `2026-06-pharma-application-selection-matrix.csv`
- `2026-06-product-knowledge-30-day-curriculum.csv`
- `2026-06-internal-validation-backlog.csv`
- `2026-06-internal-validation-execution.csv`

解析器使用明确字段映射，不把CSV行直接暴露给页面。模块输出稳定的TypeScript视图模型，并对缺少文件、表头变化和无效枚举抛出可识别错误。

CSV在进程内按文件修改时间缓存。开发环境文件变化后重新解析；生产部署中每个构建版本视为固定知识快照。

### 4.2 PostgreSQL执行状态

在 `db/schema.sql` 新增以下表。

#### `training_learners`

```text
id text primary key
name text not null
cohort text not null
active boolean not null default true
created_at timestamptz not null
```

#### `training_progress`

```text
learner_id text references training_learners(id)
day integer not null check day between 1 and 30
scheduled_date date
completion_status text not null
output_location text
self_reflection text
coach text
coach_result text not null
coach_feedback text
completed_date date
updated_at timestamptz not null
primary key (learner_id, day)
```

#### `training_scores`

```text
id text primary key
learner_id text references training_learners(id)
checkpoint text not null
record_date date not null
product_skeleton integer not null
parameter_evidence integer not null
application_judgment integer not null
competitive_strategy integer not null
total_score integer not null
fatal_error boolean not null
result text not null
assessor text not null
evidence_location text not null
remediation_due date
notes text
created_at timestamptz not null
```

`learner_id + checkpoint + record_date` 建立唯一索引，保留首次成绩和复测，不覆盖历史记录。

#### `validation_task_states`

```text
validation_id text primary key
owner text
status text not null
target_date date
conclusion text
updated_by text not null
updated_at timestamptz not null
```

任务定义、优先级和验收规则仍来自CSV；数据库只覆盖负责人、状态、日期和结论。

#### `internal_evidence_records`

```text
id text primary key
validation_id text not null
received_date date not null
collector text not null
company text not null
evidence_type text not null
subject_product text
model_or_configuration text
market_scope text
source_owner text
source_date date not null
file_location text not null
confidentiality text not null
fact_summary text not null
supports_or_contradicts text not null
verification_status text not null
verifier text
verified_date date
rejection_reason text
notes text
created_at timestamptz not null
updated_at timestamptz not null
```

`validation_id` 在应用层校验必须存在于CSV主档。数据库无法对CSV建立外键，因此每次写入和读取时都执行一致性检查。

## 5. 服务端边界

新增独立的知识执行仓库，不扩充现有进程内 `AppRepository`：

```text
src/lib/knowledge/catalog.ts
src/lib/knowledge/search.ts
src/lib/knowledge/training.ts
src/lib/knowledge/validation.ts
src/lib/knowledge/types.ts
```

- `catalog.ts`：解析并缓存CSV。
- `search.ts`：统一搜索、筛选和结果排序。
- `training.ts`：课程视图、PostgreSQL进度与成绩读写、门槛校验。
- `validation.ts`：任务合并、证据读写、样本计数和状态门槛。
- `types.ts`：稳定视图模型和写入输入类型。

页面写入采用Next.js Server Actions，并用Zod校验输入。写入成功后只重新验证 `/knowledge`。

## 6. 状态规则

### 6.1 训练进度

允许转换：

```text
NOT_STARTED → IN_PROGRESS → SUBMITTED → COMPLETE
SUBMITTED → IN_PROGRESS
COMPLETE → IN_PROGRESS
```

`COMPLETE` 必须满足：

- 有产出位置。
- 有教练名称。
- `coach_result=PASS`。
- 有完成日期。

教练要求返工时，状态回到 `IN_PROGRESS`，`coach_result=REWORK`。

### 6.2 阶段成绩

- DAY-10通过：总分至少60且无致命错误。
- DAY-20通过：总分至少70、应用判断至少21且无致命错误。
- DAY-30或RETEST通过：总分至少75，四模块分别达到14、14、21、21，且无致命错误。
- BASELINE只能记录为 `NOT_ASSESSED`。
- 总分必须等于四模块之和。

### 6.3 验证任务

状态：

```text
OPEN
IN_PROGRESS
VERIFIED
REJECTED
INSUFFICIENT
```

改为 `VERIFIED` 前必须：

1. 已验证证据数达到CSV的 `minimum_verified_records`。
2. 所有计入样本的证据状态为 `VERIFIED`。
3. 证据记录包含复核人和日期。
4. 用户确认样本满足CSV验收规则。
5. 填写结论，且结论范围不超过证据范围。

`REJECTED` 和 `INSUFFICIENT` 必须填写原因或结论。

## 7. 无数据库降级

`getSql()` 返回 `null` 时：

- 工作台、产品搜索、场景和课程仍可读取。
- 训练和验证页显示“只读模式：未配置PostgreSQL”。
- 所有写入控件禁用。
- 不回退到内存写入，也不伪造成功状态。
- 页面提供环境变量提示，但不显示连接字符串。

数据库查询失败时：

- 页面保留CSV只读内容。
- 执行状态区域显示明确错误。
- Server Action返回字段级或全局错误。
- 不吞掉失败，不把数据库错误内容直接暴露给用户。

## 8. UI设计

延续现有深色、低圆角、密集运营工具风格：

- 不增加营销式Hero或装饰性大卡片。
- 任务入口使用图标、短标题和状态提示。
- 搜索与筛选保持单行可扫描。
- 表格在桌面端密集展示；移动端切换为分组列表。
- 状态使用现有色彩语义，避免只用颜色表达。
- 所有图标使用Lucide。
- 页面区块不嵌套卡片；卡片仅用于重复结果、任务和记录。

侧栏宽度保持不变。移动端沿用当前顶部堆叠方式，知识中心页签允许横向滚动，不压缩文字。

## 9. 搜索规则

搜索索引覆盖：

- Bürkert Type ID、中英文名称、类别、应用
- GEMÜ、Fujikin、ESG系列名称、产品角色和应用
- 场景客户任务、过程阶段和候选产品
- 映射中的竞品系列和比较维度

排序优先级：

1. 标识或系列名称精确匹配
2. 名称前缀匹配
3. 制药相关性为HIGH
4. 应用或类别文本匹配

首版不使用向量检索或LLM生成答案。结果必须能定位到CSV行和官方/证据链接。

## 10. 测试与验收

### 数据解析

- 所有目标CSV可解析。
- 表头变化会产生明确失败。
- 四家公司记录数与当前验证结果一致。
- 30天课程、12类场景和16项任务完整。

### 搜索

- `2103` 返回Bürkert Type。
- `P600` 返回GEMÜ系列或映射。
- `WFI` 返回应用场景及相关产品。
- 公司、类别和制药相关性筛选正确。
- 不返回不存在的推测参数。

### 训练

- 合法状态转换成功，非法转换拒绝。
- `COMPLETE` 缺少教练或产出位置时拒绝。
- 三阶段分数门槛与现有Python校验一致。
- RETEST新增记录，不覆盖首次成绩。

### 验证

- 证据只能关联CSV中存在的 `validation_id`。
- `VERIFIED` 未达到样本门槛时拒绝。
- 被拒绝或不足证据不计入样本。
- 达到门槛且填写结论后可升级。

### 降级与安全

- 未配置数据库时页面只读且写入控件禁用。
- 数据库异常不会影响产品搜索。
- 页面不显示数据库连接信息。
- 敏感附件不进入Git或数据库二进制字段。

### UI

- 桌面和移动视口无文字重叠或水平页面溢出。
- 任务入口、搜索、训练提交和验证更新可通过键盘操作。
- 状态标签包含文本。
- 浏览器控制台无错误。

### 项目回归

- 现有应用测试通过。
- Next.js生产构建通过。
- 研究Python校验全部通过。
- 不修改历史评分和现有研究CSV内容。

## 11. 实施范围

首版包含：

- `/knowledge` 页面及侧栏入口
- CSV解析与统一搜索
- PostgreSQL schema扩展
- 训练与验证Server Actions
- 数据库只读降级
- 单元、集成和浏览器验收测试

首版不包含：

- 上传或预览敏感附件
- CSV在线编辑
- 复杂RBAC
- 全站数据层迁移到PostgreSQL
- AI问答或向量数据库
- 自动修改历史竞争评分

## 12. 交付约束

- 保留 `src/app/competitors/[id]/page.tsx` 和 `src/app/sources/page.tsx` 当前未提交改动，不覆盖、不重构。
- 设计与实现只新增知识中心所需模块，并对 `AppShell` 做最小导航修改。
- 数据库迁移必须可重复执行，不破坏现有表。
- Git提交只包含本功能文件和明确需要的schema、导航及测试修改。
