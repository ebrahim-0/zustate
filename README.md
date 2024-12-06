# **zustate-add (\***Global State Manager**\*\)**

A lightweight, flexible global state management library for React applications, built on top of Zustand. This library provides an intuitive API for managing global state, dispatching actions, and keeping your application state organized.

---

## **Features**

- 🌀 Simple global state management with Zustand.
- ⚡ Dynamic action dispatching.
- 💾 Temporary state support for transient updates.
- 🔄 Reset and dirty state management.
- 🚫 **Add state without re-rendering**: Modify or add new state slices without triggering the updated value until you render it.

---

## **Installation**

Install the package via NPM or Yarn:

```bash
npm install zustate-add
# or
yarn add zustate-add
```

---

## **Usage**

### **Setup**

create the provider if you want to add a initial state or make a actions

### if you don’t need the initial state and make a actions don’t add the StateProvider

```tsx
"use client"; // don’t forget to add use clint if you are in a next.js

import { ReactNode } from "react";
import { StateProvider, CreateDispatchType, setConfig } from "zustate-add";

// debug = true log all the state when change
setConfig({ debug: false });

const globalState = {
  name: "Ibrahim",
  info: {
    age: 22,
  },
};

const createDispatch: CreateDispatchType = (data, tools, actions) => {
  const { type, payload } = data;
  const { update /*, addState , reset, dirty */ } = tools;

  const setAge = () => {
    const age = payload.value;
    update({ age }, "info");
  };

  const lang = () => {
    const { lang } = payload;
    update({ lang }, "info2");
  };

  switch (!!type) {
    /*
      actions => return all actions that you logged
      when you call dispatch("setAge", { value: 23 })
      (setAge) is the action
    */
    case !!actions.setAge:
      return setAge();
    case !!actions.lang:
      return lang();
    default:
      console.log("no actions");
      break;
  }
};

const Root = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <StateProvider globalState={globalState} createDispatch={createDispatch}>
      {children}
    </StateProvider>
  );
};

export default Root;
```

Then import the hooks and start managing your global state:

```tsx
import React from "react";
import { useDispatch, useSelector } from "zustate-add";

const App = () => {
  const { dispatch, dispatcher } = useDispatch();

  // Accessing state
  const name = useSelector("info.name", "Default Name");
  const age = useSelector("info.age", 0);

  // or can get multiple
  const [name, age] = useSelector(
    ["info.name", "info.age"],
    ["Default Name", 0]
  );

  const updateAge = () => {
    dispatcher("setAge", { value: 22 }); // Dispatch an action to update age
    dispatch({ name: "Ibrahim" }, "info");
  };

  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
};

export default App;
```

---

### **Available Hooks**

#### **`useDispatch`**

Provides access to dispatch and state-management methods.

```typescript
import { useDispatch } from "zustate-add";

const { dispatch, dispatcher, reset, dirty, addState } = useDispatch();
```

##### Methods:

- **`dispatch`**: Directly update or replace state.
- **`dispatcher(action, payload)`**: Dispatch an action using the predefined `createDispatch` logic.
- **`reset(keys)`**: Reset specific state slices to their initial values.
- **`dirty(keys)`**: Remove specific keys from the state.
- **`addState(newState, key?)`**: Add or update state slices dynamically.

#### **`useSelector`**

Access specific parts of the global state.

```typescript
import { useSelector } from "zustate-add";

const value = useSelector("key", "defaultValue");
```

- **`key`**: The state key to retrieve.
- **`defaultValue`**: Fallback value if the key does not exist.

---

### **Global State Example**

Customize your initial global state in `global-state.ts`:

```typescript
export const globalState = {
  info: {
    name: "John Doe",
    age: 25,
  },
  settings: {
    theme: "light",
    language: "en",
  },
};
```

---

### **Custom Actions**

Define actions in `createDispatch`:

```typescript
import { CreateDispatchType } from "zustate-add";

const createDispatch: CreateDispatchType = (data, tools, actions) => {
  const { type, payload } = data;
  const { update } = tools;

  const setAge = () => {
    const age = payload.value;
    update({ age }, "info");
  };

  switch (!!type) {
    /*
      actions => return all actions that you logged
      when you call dispatch("setAge", { value: 28 })
      (setAge) is the action
    */
    case !!actions.setAge:
      return setAge();
    case !!actions.lang:
      return lang();
    default:
      console.log("not found");
      break;
  }
};
```

Define provider in root app `StateProvider`:

```tsx
import { StateProvider } from "zustate-add";

<StateProvider globalState={globalState} createDispatch={createDispatch}>
  {children}
</StateProvider>;
```

Dispatch actions using `dispatcher`:

```typescript
import { useDispatch } from "zustate-add";
const { dispatcher } = useDispatch();
dispatcher("setAge", { value: 28 });
```

Reset the value to the initial value in global state `reset`:

```typescript
import { useDispatch } from "zustate-add";
const { reset } = useDispatch();
reset("key");
// or
reset(["key1", "key2"]);
```

Dirty the value in the state remove the a value in the state `dirty`:

```typescript
import { useDispatch } from "zustate-add";
const { dirty } = useDispatch();
dirty("key");
// or
dirty(["key1", "key2"]);
```

<!--

##


## **Contributing**

Contributions are welcome! Feel free to open issues or submit pull requests.

---

 -->

## **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---
