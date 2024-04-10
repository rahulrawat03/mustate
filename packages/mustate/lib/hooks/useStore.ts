import { useEffect, useState } from "react";
import { Observable } from "../types";
import { Registerer } from "../core";

export function useStore(observables: Observable[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrigger] = useState(false);

  const render = () => {
    setTrigger((trigger) => !trigger);
  };

  useEffect(() => {
    Registerer.registerObservables(observables, render);
    return () => Registerer.unregisterObservables(observables, render);
  }, [observables]);
}
