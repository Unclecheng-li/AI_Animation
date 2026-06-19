# Contributing to AI Animation Skills

欢迎贡献新的动效 Skill！

## 添加新 Skill

每个 Skill 是 `skills/` 下的一个独立文件夹，标准结构：

```
skills/<skill-name>/
├── SKILL.md        ← 必须：Agent 执行指令（YAML frontmatter + Markdown）
├── README.md       ← 推荐：人类可读文档
├── references/     ← 可选：扩展参考（Prompt 模板、说明文档等）
└── assets/         ← 可选：模板 HTML 文件、图片等
```

### SKILL.md 最小格式

```markdown
---
name: "skill-name"
description: "一句话描述，AI Agent 根据此字段决定是否激活"
version: "0.1.0"
---

# Skill 执行指令

（这里是给 Agent 的详细工作流和约束）
```

## 命名规范

- Skill 文件夹名：`kebab-case`，例如 `ppt-animation`
- 描述字段必须加引号
- 版本号遵循 semver

## 提交步骤

1. Fork 仓库
2. 在 `skills/` 下新建文件夹
3. 至少提供 `SKILL.md` 和 `README.md`
4. 提交 PR，描述 Skill 的用途和使用方式

---

Welcome to contribute new animation skills!

Each skill is a self-contained folder under `skills/` with at minimum a `SKILL.md` file containing a YAML frontmatter header and Markdown instructions for the AI agent.
