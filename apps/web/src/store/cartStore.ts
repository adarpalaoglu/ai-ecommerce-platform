import { create } from 'zustand';
import { CartItem } from 'shared';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  setCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),
  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })),
  setCart: (items) => set({ items }),
}));
