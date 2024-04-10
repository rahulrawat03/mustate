import { createStore } from "@rahulrawat03/mustate";

export enum Shape {
  triangle = "traingle",
  square = "square",
  circle = "circle",
}

const counter = {
  count: 0,
  shape: Shape.triangle,
};

export const counterStore = createStore(counter);
