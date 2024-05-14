# Id Refs Svelte

Make `id` attributes reusable in components, for Svelte.

```svelte
<script>
  const idRefs = createIdRefsContext()
</script>

<WithId idKey="name" {idRefs} let:id>
  <label for={id}>Name:</label>
  <input {id} type="text" bind:value={name} />
</WithId>
```

## Why?

Id attributes should be unique in a DOM tree. That's why we have `getElementById()` method, opposed to `getElementsByClass()`.

However, as component-based methodologies prevail, components started to focus on _reusability_, which conflicts with the idea of "allowing an attribute to be used only once throughout the entire page". This can be a problem when we are building components, because we do not know in advance whether it will be used only once or multiple times, perhaps even in the future.

We cannot ditch using `id` all together, because that's not how the web works. Rather, the number of attributes that depend on the attribute keeps on growing, starting from the `for` attribute in `<label>` tags and others like `aria-labelledby`. Deciding not to use `id` is like deciding not to use some aspects of what the web as a platform is providing.

This package resolves this problem by appending random suffices to the id key, while maintaining the key suffix you want to highlight. It aims to provide an user-friendly interface as a declarative syntax.

## Install

```bash
npm install @jangxyz/id-refs-svelte
```

## Usage

### Usage 1 - Using `createIdRefsContext`

`idRefs` maintains unique id values.

```svelte
<script>
  import { createIdRefsContext } from '$lib/idRefs.js'

  let name = ''

  const idRefs = createIdRefsContext({ suffix: 3 })
  const nameId = idRefs.newId('name')
  const emailId = idRefs.newId('email')
</script>

<label for={nameId}>Name:</label>
<input id={nameId} type="text" bind:value={name} />

<label for={emailId}>E-mail:</label>
<input id={emailId} type="email" bind:value={email} />
```

### Usage 2 - Using the context in child components

`createIdRefsContext` registers a context that can be used by descendant components.

```svelte
<!-- +page.svelte -->
<script>
  import { createIdRefsContext } from '$lib/idRefs.js'
  import Card from './Card.svelte'

  createIdRefsContext({ suffix: 3 })
</script>

<Card name="user1" />
<Card name="user2" />
```

Inside each component, you call the idRef context with `useIdRefs()`, and use the helper methods to ensure unique id names.

There is a helper component `<WithId>` that wraps the `idRefs.newId()` invocation inside a component. This way you can put the id declaration part close to its usage, making the code more readable.

```svelte
<!-- Card.svelte -->
<script>
  import { useIdRefs } from '$lib/idRefs.js'
  import WithId from '$lib/WithId.svelte'

  const idRefs = useIdRefs()

  export let name = ''
</script>

<fieldset>
  <legend>Card</legend>

  <div class="grid">
    <WithId idKey="name" {idRefs} let:id={nameId}>
      <label for={nameId} title="id={nameId}">Name</label>
      <input id={nameId} name="name" value={name} />
    </WithId>

    <WithId idKey="email" let:id={emailId}>
      <label for={emailId} title="id={emailId}">Email</label>
      <input id={emailId} name="email" />
    </WithId>
  </div>
</fieldset>
```

For convenience, `idRefs` prop in `WithId` can be omitted, which will call `useIdRefs()` internally.
