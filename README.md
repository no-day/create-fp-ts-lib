# create-fp-ts-lib

[![Test](https://github.com/no-day/create-fp-ts-lib/actions/workflows/build.yml/badge.svg)](https://github.com/no-day/create-fp-ts-lib/actions/workflows/build.yml)

# Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Getting started](#getting-started)
- [Features](#features)
  * [Code Quality](#code-quality)
  * [Testing](#testing)
  * [Documentation](#documentation)
  * [Building](#building)
  * [Continuos Integration](#continuos-integration)
  * [Dev tasks](#dev-tasks)
- [Recipes](#recipes)
  * [Commands](#commands)
  * [Serve docs on GitHub pages](#serve-docs-on-github-pages)
  * [Publish to NPM](#publish-to-npm)
- [Limitations](#limitations)
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

No installation needed, just run:

```bash
yarn create fp-ts-lib
```

_or_

```bash
npm init fp-ts-lib
```

and then follow the questions asked by the CLI.

## Features

### Code Quality

- Code formatting by [prettier](https://prettier.io/)
- Linting with [ESLint](https://eslint.org/)

### Testing

- Test framework: [ts-jest](https://github.com/kulshekhar/ts-jest)
- Property based testing using [fast-check](https://github.com/dubzzz/fast-check)

### Documentation

- API generation by [docs-ts](https://github.com/gcanti/docs-ts)
- JSDoc formatting using [prettier-plugin-jsdoc](https://github.com/hosseinmd/prettier-plugin-jsdoc)
- README post-processing with [markdown-magic](https://github.com/DavidWells/markdown-magic) (e.g. table of content generation)

### Building

- `tsconfig.json` settings that emits distributable `.d.ts` and `.js` files

### Continuos Integration

- CI via [GitHub Actions](https://github.com/features/actions)
- Generate docs and deploy to GitHub pages using [github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)
- Easy publishing to NPM by drafting a release on GitHub

### Dev tasks

- All task scripts postfixed with `:watch` run as [vscode tasks](https://code.visualstudio.com/docs/editor/tasks)
- Note: You need to `Ctrl+shift+P` and `Tasks: Manage Automatic Tasks in Folder` and choose "Allow Automatic Tasks in folder"

## Recipes

### Commands

| Command      | Action                               |
| ------------ | ------------------------------------ |
| `yarn build` | Build distribution files             |
| `yarn test`  | Run test suite                       |
| `yarn docs`  | Generate Documentation               |
| `yarn lint`  | Run linter                           |
| `yarn md`    | Enhance README with auto generations |

You can use `npm` as well. Check the generated `package.json` for available watch tasks.

### Serve docs on GitHub pages

- Push to your remote repo at GitHub (triggers CI)
- In the GitHub UI of your repo, go to "Settings" > "GitHub Pages"
- Select `gh-pages` branch as source, keep the "root" directory and "Save"

### Publish to NPM

Only once:

- In the GitHub UI add `NPM_TOKEN` from you NPM account as a secret ("Settings" / "Secrets")

On every release:

1. Increase the version in the `package.json` e.g. to "1.0.1"
2. Commit as `v1.0.1`
3. In the GitHub UI, go to the "releases" section of your repo.
4. Select "Create a new release"
5. Use `v1.0.1` as "Tag version" and "Release title"
6. Click "Publish release"
7. Check the "Actions" tab to see if CI runs properly

## Limitations

- Currently only one module (index.ts) is supported. We'll fix that soon.
