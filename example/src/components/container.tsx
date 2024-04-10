import { useStore } from "@rahulrawat03/mustate";
import { Shape, counterStore } from "../stores";
import { Counter } from "./counter";
import css from "./container.module.css";

export function Container() {
  useStore([
    {
      store: counterStore,
      include: ["shape"],
    },
  ]);

  const getClassName = () => {
    const className = `${css.container} `;
    switch (counterStore.shape) {
      case Shape.triangle:
        return `${className} ${css.triangle}`;
      case Shape.circle:
        return `${className} ${css.circle}`;
      default:
        return className;
    }
  };

  return (
    <div className={getClassName()}>
      <Counter />
    </div>
  );
}
