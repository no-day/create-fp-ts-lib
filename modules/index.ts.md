---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Greetings](#greetings)
  - [greet](#greet)

---

# Greetings

## greet

It's a greeting

**Signature**

```ts
export declare const greet: (name: string) => string
```

**Example**

```ts
import { greet } from 'create-fp-ts-lib'
assert.deepStrictEqual(greet('World'), 'Hello, World!')
```

Added in v1.0.0
