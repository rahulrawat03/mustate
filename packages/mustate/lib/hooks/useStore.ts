import { useEffect, useRef, useState } from "react";
import { Observable } from "../types";
import { Registerer } from "../core";

export function useStore(observables: Observable[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrigger] = useState(0);
  const MOD = useRef(1e9 + 7);

  useEffect(() => {
    const render = () => {
      setTrigger((value) => (value + 1) % MOD.current);
    };

    Registerer.registerObservables(observables, render);
    return () => Registerer.unregisterObservables(observables, render);
  }, [observables]);
}
