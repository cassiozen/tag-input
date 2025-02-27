# Coming soon

A lightweight, accessible design system providing reusable UI components. Currently featuring a TagInput component with more components to be added.

## Installation

```bash
npm install tagcomponent
# or
yarn add tagcomponent
# or
pnpm add tagcomponent
```


## Components

### TagInput

An accessible input field that allows users to enter multiple tags or labels.

#### Features

- Add tags using comma or Enter key
- Remove tags by clicking the delete button or using Backspace when the input is empty
- Keyboard navigation with arrow keys between tags
- Accessible for screen readers
- Full form integration (works with form submission & validation)


**Basic Usage:**

```jsx
<TagInput
  placeholder="Add tags..."
  onTagsChange={(tags) => console.log('Tags:', tags)}
/>
```

## Development

This project uses:

- [Vite](https://vitejs.dev/) for bundling
- [Ladle](https://ladle.dev/) for component development and stories
- [Vitest](https://vitest.dev/) for testing
- [TypeScript](https://www.typescriptlang.org/) for type safety

### Commands

```bash
# Start Ladle development server
pnpm dev

# Build the library
pnpm build

# Run tests
pnpm test

# Lint the code
pnpm lint
```

### Adding New Components

1. Create a new folder under `src/` with your component name
2. Add the following files:
   - `index.tsx` - Component implementation
   - `spec.tsx` - Tests using Vitest
   - `stories.tsx` - Ladle stories
   - `styles.module.css` - CSS modules for styling
3. Export the component in `src/lib.ts`

## License

MIT