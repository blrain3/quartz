```markdown
# quartz Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides guidance on the development patterns used in the `quartz` TypeScript codebase. It covers file naming conventions, import/export styles, commit message patterns, and testing approaches. By following these conventions, contributors can ensure code consistency and maintainability throughout the project.

## Coding Conventions

### File Naming
- **Style:** camelCase
- **Example:**  
  ```plaintext
  userProfile.ts
  dataFetcher.ts
  ```

### Import Style
- **Type:** Relative imports
- **Example:**
  ```typescript
  import { fetchData } from './dataFetcher';
  ```

### Export Style
- **Type:** Named exports
- **Example:**
  ```typescript
  // dataFetcher.ts
  export function fetchData() { ... }
  ```

### Commit Message Patterns
- **Type:** Freeform (no strict structure)
- **Prefixes:** None enforced
- **Average Length:** ~36 characters
- **Example:**
  ```
  Fix issue with user profile loading
  Add support for new data source
  ```

## Workflows

### Adding a New Module
**Trigger:** When creating a new feature or utility module  
**Command:** `/add-module`

1. Create a new file using camelCase naming (e.g., `newFeature.ts`).
2. Use relative imports for dependencies.
3. Export functions or constants using named exports.
4. Write corresponding tests in a file named `newFeature.test.ts`.

### Updating an Existing Module
**Trigger:** When modifying or extending an existing module  
**Command:** `/update-module`

1. Locate the target module (e.g., `existingModule.ts`).
2. Make changes using TypeScript best practices.
3. Ensure all exports remain named.
4. Update or add tests in the corresponding `*.test.ts` file.

### Writing Tests
**Trigger:** When adding or updating functionality  
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.ts`.
2. Write tests using the project's chosen (unknown) framework.
3. Use relative imports to bring in the module under test.
4. Run tests to ensure correctness.

## Testing Patterns

- **Test File Pattern:** `*.test.ts`
- **Framework:** Not explicitly detected; follow existing test file structure.
- **Example:**
  ```typescript
  import { fetchData } from './dataFetcher';

  test('fetchData returns expected result', () => {
    // test implementation
  });
  ```

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /add-module    | Scaffold and implement a new module          |
| /update-module | Update or extend an existing module          |
| /write-test    | Add or update tests for a module or feature  |
```
