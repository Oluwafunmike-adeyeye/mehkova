import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, variant?: Pick<CartItem, 'color' | 'size'>) => void;
  updateQuantity: (id: number, quantity: number, variant?: Pick<CartItem, 'color' | 'size'>) => void;
  clearCart: (options?: { silent?: boolean }) => void;
  total: () => number;
  itemCount: () => number;
  getItem: (id: number, variant?: Pick<CartItem, 'color' | 'size'>) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const variant = { color: item.color, size: item.size };
        const existingItem = items.find((i) => 
          i.id === item.id && 
          i.color === variant.color && 
          i.size === variant.size
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id && 
              i.color === variant.color && 
              i.size === variant.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
          toast.success(`${item.title} quantity updated`);
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
          toast.success(`${item.title} added to cart`);
        }
      },
      removeItem: (id, variant = {}) => {
        const items = get().items;
        const itemToRemove = items.find((i) => 
          i.id === id && 
          i.color === variant.color && 
          i.size === variant.size
        );

        if (!itemToRemove) return;

        set({
          items: items.filter((item) => 
            !(item.id === id && 
              item.color === variant.color && 
              item.size === variant.size)
          ),
        });

        toast.success(`${itemToRemove.title} removed from cart`);
      },
      updateQuantity: (id, quantity, variant = {}) => {
        if (quantity < 1) {
          get().removeItem(id, variant);
          return;
        }

        const items = get().items;
        const itemToUpdate = items.find((i) => 
          i.id === id && 
          i.color === variant.color && 
          i.size === variant.size
        );

        if (!itemToUpdate) return;

        set({
          items: items.map((item) =>
            item.id === id && 
            item.color === variant.color && 
            item.size === variant.size
              ? { ...item, quantity }
              : item
          ),
        });

        if (itemToUpdate.quantity !== quantity) {
          toast.success(`${itemToUpdate.title} quantity updated to ${quantity}`);
        }
      },
      clearCart: ({ silent } = { silent: false }) => {
        const hadItems = get().items.length > 0;
        set({ items: [] });
        if (hadItems && !silent) {
          toast.success('Order completed');
        }
      },
      total: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      getItem: (id, variant = {}) => 
        get().items.find((item) => 
          item.id === id && 
          item.color === variant.color && 
          item.size === variant.size
        ),
    }),
    {
      name: 'cart-storage',
      version: 1,
    }
  )
);

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    getItem,
  } = useCartStore();

  return {
    cartItems: items,
    addToCart: addItem,
    removeFromCart: removeItem,
    updateCartItemQuantity: updateQuantity,
    clearCart,
    cartTotal: total,
    cartItemCount: itemCount,
    getCartItem: getItem,
    isInCart: (id: number, variant?: Pick<CartItem, 'color' | 'size'>) => 
      items.some((item) => 
        item.id === id && 
        item.color === variant?.color && 
        item.size === variant?.size
      ),
  };
};