import { create, StateCreator } from "zustand";
import { CartSlice } from "@/types/cart";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { createCartItemsSlice } from "./slices/cartItemsSlice";
import { createCartActionsSlice } from "./slices/cartActionsSlice";

// define persist options type explicitly
type PersistType = (
  config: StateCreator<CartSlice>,
  option: PersistOptions<CartSlice>
) => StateCreator<CartSlice>;

const persistFn = persist as PersistType;

export const useCartStore = create<CartSlice>()(
  persistFn(
    (...set) => ({
      ...createCartItemsSlice(...set),
      ...createCartActionsSlice(...set),
    }),
    {
      name: "merdeka-service-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
