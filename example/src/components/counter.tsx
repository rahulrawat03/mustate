import { useStore } from "@rahulrawat03/mustate";
import { Shape, counterStore } from "../stores";
import css from "./counter.module.css";

export function Counter() {
  useStore([
    {
      store: counterStore,
      exclude: ["shape"],
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
      <h3 className={css.count}>{counterStore.count}</h3>
      <div className={css.buttons}>
        <button className={css.button} onClick={handleIncrement}>
          Increment
        </button>
        <button className={css.button} onClick={handleDecrement}>
          Decrement
        </button>
      </div>
    </>
  );
}
