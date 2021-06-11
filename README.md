# create-fp-ts-lib

[![Test](https://github.com/no-day/create-fp-ts-lib/actions/workflows/build.yml/badge.svg)](https://github.com/no-day/create-fp-ts-lib/actions/workflows/build.yml)
[![David](https://img.shields.io/david/no-day/create-fp-ts-lib)
](https://david-dm.org/no-day/create-fp-ts-lib)
[![npm](https://img.shields.io/npm/v/create-fp-ts-lib)](https://www.npmjs.com/package/create-fp-ts-lib)

Bootstrap libraries that follow common [fp-ts](https://github.com/gcanti/fp-ts) coding, documentation and testing patterns.

<img src="assets/create-fp-ts-lib.gif"/>

# Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Introduction](#introduction)
- [Getting started](#getting-started)
  * [Yarn](#yarn)
  * [NPM](#npm)
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
  * [Update existing repository](#update-existing-repository)
- [CLI Options](#cli-options)
- [Future features](#future-features)
<!-- AUTO-GENERATED-CONTENT:END -->

## Introduction

[fp-ts](https://github.com/gcanti/fp-ts) brings typed functional programming to [TypeScript](https://www.typescriptlang.org/). The advantage over functional languages that compile to JavaScript is that it's much closer to an already existing and typed ecosystem.

This provides a nice out of the box compatibility. However, fp-ts is most powerful and composable if special purpose libraries follow some conventions. The [fp-ts ecosystem](https://gcanti.github.io/fp-ts/ecosystem/) is still relatively small. `create-fp-ts-lib` helps you to bootstrap libraries that follow common fp-ts coding, documentation and testing patterns.

This is the main goal of this project. However it may be useful to create any other TypeScript library as well. Currently nothing inherently fp-ts specific is generated, except from a peer dependency. But this may change in the future.

## Getting started

### Yarn

```bash
yarn global add create-fp-ts-lib
create-fp-ts-lib
```

If you want don't want to go through the questions, you can run `create-fp-ts-lib -q -n my-lib` to just specify a name and use the defaults for any other options.

You can also use this shortcut to always invoke an up to date version:

```bash
yarn create fp-ts-lib
```

### NPM

```bash
npm install -g create-fp-ts-lib
create-fp-ts-lib
```

If you want don't want to go through the questions, you can run `create-fp-ts-lib -q -n my-lib` to just specify a name and use the defaults for any other options.

You can also use this shortcut to always invoke an up to date version:

```bash
npm init fp-ts-lib
```

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
- Code spell checking by [cspell](https://github.com/streetsidesoftware/cspell)

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
| `yarn spell` | Run the code spell checker           |

You can use `npm` as well. Check the generated `package.json` for available watch tasks.

### Serve docs on GitHub pages

- Push to your remote repo at GitHub (triggers CI)
- In the GitHub UI of your repo, go to "Settings" > "GitHub Pages"
- Select `gh-pages` branch as source, keep the "root" directory and "Save"

### Publish to NPM

- Only once:

  - In the GitHub UI add `NPM_TOKEN` from you NPM account as a secret ("Settings" / "Secrets")

- On every release:

  - Increase the version in the `package.json` e.g. to "1.0.1"
  - Commit as `v1.0.1`
  - In the GitHub UI, go to the "releases" section of your repo.
  - Select "Create a new release"
  - Use `v1.0.1` as "Tag version" and "Release title"
  - Click "Publish release"
  - Check the "Actions" tab to see if CI runs properly

### Update existing repository

Currently the tool is optimized for creating new projects from scratch. However, we provide an `--inPlace` option, which is not very smart yet. It will just generate files as usual and possibly override existing files. You'll need to sort out changes manually.
The CLI will make sure your git working directory is clean.

## CLI Options

Run `create-fp-ts-lib --help` to see all options.

Note: Unless you provide the `--noQuest` flag, every CLI option will still appear in the user questionnaire. However equipped with the provided CLI options as default answers.

## Future features

The following features are planned

- Check dependencies with [depcheck](https://github.com/depcheck/depcheck)
- Precommit hooks
- Run CI locally in isolated environment
- Readme badges (npm version, build status, dependencies)
- Watch task for linting using [eslint-watch](https://github.com/rizowski/eslint-watch)
- Maybe you have an idea... File an [issue](https://github.com/no-day/create-fp-ts-lib/issues/new)
