```markdown
# quartz Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `quartz` TypeScript codebase. You'll learn about file naming, import/export styles, commit message habits, and how to write and run tests. This guide is ideal for contributors aiming for consistency and maintainability in the project.

## Coding Conventions

### File Naming
- Use **camelCase** for filenames.
  - Example: `userProfile.ts`, `dataFetcher.ts`

### Imports
- Use **relative imports** for referencing modules.
  - Example:
    ```typescript
    import { fetchData } from './dataFetcher';
    ```

### Exports
- Use **named exports** instead of default exports.
  - Example:
    ```typescript
    // In dataFetcher.ts
    export function fetchData() { ... }
    ```

### Commit Messages
- Commit messages are **freeform** (no enforced structure).
- Prefixes are used occasionally, but not consistently.
- Average message length: ~36 characters.
  - Example: `fix bug in data fetch logic`

## Workflows

### Adding a New Module
**Trigger:** When you need to add a new feature or utility.
**Command:** `/add-module`

1. Create a new file using camelCase naming (e.g., `myNewFeature.ts`).
2. Write your TypeScript code, using named exports.
3. Use relative imports to include other modules.
4. Add corresponding test file as `myNewFeature.test.ts`.
5. Commit changes with a clear, concise message.

### Writing and Running Tests
**Trigger:** When you add or update code and need to ensure correctness.
**Command:** `/run-tests`

1. Create a test file alongside your module, following the pattern `*.test.ts`.
2. Write tests (framework is currently unknown; check existing tests for style).
3. Run the test suite using the project's preferred test runner (consult project docs or package.json).
4. Review and fix any failing tests.

## Testing Patterns

- Test files follow the `*.test.ts` naming pattern.
- The testing framework is **unknown**; check existing test files for clues.
- Place tests close to the modules they cover.
- Example test file: `dataFetcher.test.ts`

## Commands
| Command         | Purpose                                   |
|-----------------|-------------------------------------------|
| /add-module     | Scaffold a new module with tests          |
| /run-tests      | Run all tests in the codebase             |
```
