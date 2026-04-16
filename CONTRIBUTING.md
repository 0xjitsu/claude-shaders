# Contributing to claude-shaders

Contributions welcome! Please read this guide before submitting.

## How to contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes
4. Run validation (see below)
5. Commit with conventional commit messages
6. Open a pull request

## Validation

Ensure the skill files are valid:
- `SKILL.md` has YAML frontmatter with `name`, `description`, `version`
- All `config.json` files parse as valid JSON
- All `Component.tsx` files reference existing config files

## Contributor License Agreement (CLA)

By submitting a pull request, you agree that:

1. You have the right to submit the contribution
2. You grant the maintainer (0xjitsu) a perpetual, worldwide, non-exclusive, royalty-free license to use, modify, and relicense your contribution
3. This grant enables the dual-license model (AGPL open source + commercial)
4. Your contribution will be licensed under the same terms as the project (AGPL v3)

This CLA is required to maintain the dual-licensing model. If you have questions, open an issue.
