import { ReactNode, createContext,useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";


type ShoppingCartProviderProps = {
    children:ReactNode
}

type CartItem = {
    id:number,
    quantity:number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    cartQuantity: number
    getItemQuantity : (id: number ) => number
    increaseCartQuantity : (id: number) => void
    decreaseCartQuantity : (id: number) => void
    removeFromCart : (id: number) => void
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({children} : ShoppingCartProviderProps){
    const [isOpen,setIsOpen] = useState(false)
    const [cartItems,setCartItems] = useLocalStorage<CartItem[]>('shopping-cart',[])

    const cartQuantity = cartItems.reduce((sum,item) => sum + item.quantity,0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)
    function getItemQuantity(selectedId: number){
        return cartItems.find(item => item.id === selectedId)?.quantity || 0
    }

    function increaseCartQuantity(selectedId:number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === selectedId) == null){
                return [...cartItems , {id:selectedId,quantity:1}]
            }else{
                return currItems.map(item => {
                    if(item.id === selectedId){
                        return {...item , quantity:item.quantity + 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(selectedId:number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === selectedId)?.quantity === 1){
                return currItems.filter(item => item.id !== selectedId)
            }else{
                return currItems.map(item => {
                    if(item.id === selectedId){
                        return {...item , quantity:item.quantity - 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(selectedId:number){
        setCartItems(currItems => currItems.filter(item => item.id !== selectedId) )
    }

    return(
        <ShoppingCartContext.Provider 
        value={{ getItemQuantity,
                 increaseCartQuantity,
                 decreaseCartQuantity,
                 removeFromCart,
                 openCart,
                 closeCart,
                 cartItems,
                 cartQuantity }} >
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}