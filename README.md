# create-fp-ts-lib

Starter template for libraries in the [fp-ts](https://github.com/gcanti/fp-ts) ecosystem.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

- [Docs](#docs)
- [Features](#features)
  - [Testing](#testing)
  - [Documentation](#documentation)
  - [Distribution](#distribution)
  - [CI](#ci)
  - [Dev tasks](#dev-tasks)
- [Planned](#planned)
- [Recepies](#recepies)
  - [Getting started](#getting-started)
  - [Build distribution files](#build-distribution-files)
  - [Run test suite](#run-test-suite)
  - [Generate Docs](#generate-docs)
  - [Preview Docs](#preview-docs)
  - [Enhance README with auto generations](#enhance-readme-with-auto-generations)
  - [Make docs available online via GitHub pages](#make-docs-available-online-via-github-pages)
  - [Publish to NPM](#publish-to-npm)
  <!-- AUTO-GENERATED-CONTENT:END -->

## Docs

[API Docs](https://no-day.github.io/create-fp-ts-lib)

## Features

### Testing

- Jest tests via [ts-jest](https://github.com/kulshekhar/ts-jest)
- Property based testing via [Fast check](https://github.com/dubzzz/fast-check)

### Documentation

- API generation via [docs-ts](https://github.com/gcanti/docs-ts)
- JS Doc formatting via [prettier-plugin-jsdoc](https://github.com/hosseinmd/prettier-plugin-jsdoc)
- Table of Content generation via [Markdown magic](https://github.com/DavidWells/markdown-magic)

### Distribution

- `.d.ts` files
- JavaScript files

### CI

- CI via GitHub Actions
- Build & test
- Generate docs and deploy to GitHub pages.
- Publish to NPM on release

### Dev tasks

- All task scripts postfixed with `:watch` run as [vscode tasks](https://code.visualstudio.com/docs/editor/tasks)
- Note: You need to `Ctrl+shift+P` and `Tasks: Manage Automatic Tasks in Folder` and choose "Allow Automatic Tasks in folder"

## Planned

- Expose multiple modules
- Use markdown-magic to insert code from the examples folder to the README
- Add vscode snippets for imports
- A spell checker

## Recepies

### Getting started

```shell
git clone https://github.com/no-day/create-fp-ts-lib
mv create-fp-ts-lib your-lib-name
cd your-lib-name
yarn install
```

Replace `create-fp-ts-lib` with `your-lib-name` in those files:

- `src/index.ts`
- `package.json`

### Build distribution files

```shell
yarn build
```

### Run test suite

```shell
yarn test
```

### Generate Docs

```shell
yarn docs
```

### Preview Docs

You need to install [Jekyll](https://jekyllrb.com/) on your system.
Then run

```shell
yarn docs-preview
```

They'll be served at port `4000`

### Enhance README with auto generations

```shell
yarn md
```

### Make docs available online via GitHub pages

- Push to your remote repo at GitHub (triggers CI)
- In the GitHub UI of your repo, go to "Settings" > "GitHub Pages"
- Select `gh-pages` branch as source, keep the "root" directory and "Save"

### Publish to NPM

Only once:

- In the GitHub UI add `NPM_TOKEN` from you NPM account as a secret ("Settings" / "Secrets")

On every release:

- Increase the version in the `package.json` e.g. to "1.0.1"
- Commit as `v1.0.1`
- In the GitHub UI, go to the "releases" section of your repo.
- Select "Create a new release"
- Use `v1.0.1` as "Tag version" and "Release title"
- Click "Publish release"
- Check the "Actions" tab to see if CI runs properly
