---
name: JSDoc Instructions
description: JSDoc usage for the project
applyTo: "*.ts, *.tsx"
---

Act as a professional library maintainer. When generating or refactoring JSDoc, strictly adhere to the following rules to ensure high-quality, non-redundant documentation.

## Core Principles

### English Only

Always write JSDoc comments in English to ensure global accessibility for library users, regardless of the user's native language or context.

### User-Centric

Focus on what the user needs to know to use the API, not how it is implemented.

### Dry & Lean

Never repeat information that is already clear from the code or TypeScript types.

## When to Write JSDoc (Mandatory)

### Public APIs

All exported functions, classes, methods, and types must have JSDoc.

### Complex Logic

Internal functions where the intent or algorithm is not immediately obvious require documentation.

### Generics

Provide explanations when @template parameters require clarification regarding their role or constraints.

## Prohibited JSDoc (Strictly Forbidden)

### Trivial Accessors

Standard getters and setters like getName() must not have JSDoc (e.g., Avoid /\*_ Gets the name _/).

### Redundant Type Info

Do not include types in JSDoc (e.g., {string}) if they are already defined in TypeScript.

### Overridden Methods

Methods that implement an interface or override a parent class should not have redundant documentation if it is already defined in the source.

### Obvious Utilities

Simple internal helpers like isString(v) or toArray(v) must not have JSDoc.

## Content & Style Guidelines

### Brevity and Tone

#### One-Sentence Summary

The first line must be a concise summary with a maximum of 80 characters.

#### Direct Language

Use imperative mood (e.g., "Calculate" instead of "This function calculates").

#### No Fluff

Avoid introductory phrases like "This function helps you to..." or "A method that...".

### What to Include (Focus on Why and How)

#### Constraints

Specify pre-conditions such as "Must be a positive integer" or "Must be a valid UUID".

#### Side Effects

Mention state mutations, I/O operations, or cache updates (e.g., "Updates the global store").

#### Return Behavior

Explain conditions for returning null/undefined or specific error cases.

#### References

Use {@link Name} for related symbols and @see for external documentation URLs.

#### Examples

Provide a minimal @example block for non-obvious API usage.

### What to Exclude

#### Implementation Steps

Do not describe the internal logic line-by-line.

#### Author and History Tags

Do not include @author or date-based changelogs as this information belongs in Git history.

## Examples

### Standard (Do)

```ts
/**
 * Validates the session token and returns the decrypted payload.
 *
 * @example
 * const payload = verifySession(token, secret);
 *
 * @param token - The JWT string to verify.
 * @param secret - The key used for decryption.
 * @returns The decoded payload, or null if the signature is invalid.
 * @throws {TokenExpiredError} If the token's exp claim has passed.
 */
export const verifySession = (token: string, secret: string): Payload | null => { ... }
```

### Redundant (Don't)

```ts
/**
 * verifySession function.
 * This function takes a token and a secret.
 *
 * @param {string} token - A string of token
 * @param {string} secret - A string of secret
 * @returns {Payload | null} Returns payload or null
 */
export const verifySession = (token: string, secret: string): Payload | null => { ... }
```

## Instructions for Copilot

### Analyze First

Before adding JSDoc, check if the function is exported and if its name/type signature is already self-explanatory.

### Refactor Existing

If existing JSDoc contains redundant types or "Don't" patterns, rewrite it to be lean.

### Property Comments

For interface properties, use single-line JSDoc /\*_ description _/ only if the property name is ambiguous.
