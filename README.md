# Mustate (Simple State Management Library)

It is a minimalist state management library that exposes only two entities.

- createStore()
- useStore()

### createStore(object: object)

This method accepts an object and returns a store with trackable properties.

```js
const counterStore = createStore({
  count: 0,
  shape: "triangle",
});
```

### useStore(observables: Observable[])

```js
  Observable : {
    store: <store>,
    include: string[] // [Optional] Properties to observe
    exclude: string[] // [Optional] Properties to avoid while observing
  }
```

- If none of the `include` and `exclude` is provided, all of the store properties are observed.

```js
// Container of counter
function Container() {
  useStore([
    {
      store: counterStore,
      include: ["shape"], // Track the "shape" property of "counterStore" and only re-render if it changes
    },
  ]);

  return <ShapedContainer shape={counterStore.shape} />;
}
```

```js
// Counter
function Counter() {
  useStore([
    {
      store: counterStore,
      exclude: ["shape"], // Track all the properties of "counterStore" except "shape"
    },
  ]);

  const handleShapeChange = () => {
    if (counterStore.count % 3 === 0 && counterStore.count % 5 === 0) {
      counterStore.shape = Shape.circle;
    } else if (counterStore.count % 3 === 0) {
      counterStore.shape = Shape.triangle;
    } else {
      counterStore.shape = Shape.square;
    }
  };

  const handleIncrement = () => {
    counterStore.count++;
    handleShapeChange();
  };

  const handleDecrement = () => {
    counterStore.count--;
    handleShapeChange();
  };

  return (
    <>
      <Count count={counterStore.count} />
      <Button onClick={handleIncrement} />
      <Button onClick={handleDecrement} />
    </>
  );
}
```

Change in `count` only triggers the rebuild of `Counter` while the `Container` component remains unaffected till `shape` changes since it only observes `shape` property of the store.  
<br />
This behaviour makes it different from `React Context` where all the consumers update when the context updates regardless of whether they are listening to the changes or not.
