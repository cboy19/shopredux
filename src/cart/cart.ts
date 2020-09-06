import { Items, Carts } from "../cards/types";
import * as _ from "lodash";


export class Cart {

    private cart: Carts[] = [];
    private inProcess: Boolean = false;
    private static index = 0;
    private static cartInstance: { id: String, instance: Cart}[] = [];


    static getInstance(id: String): Cart{
        const myInstance= this.cartInstance.find(instanceArray => instanceArray.id === id);
        if(myInstance){
            return myInstance.instance;
        }
        else{ 
            const tempCart = new Cart();
            this.cartInstance.push({id: id, instance: tempCart});
            return tempCart;
            }
    }

    static removeInstance(id:String){
        const myInstance= this.cartInstance.find(instanceArray => instanceArray.id === id);
        if (myInstance != undefined){
            _.remove(this.cartInstance, function(item){
                return item.id === myInstance.id;
            });
                                      }
    }

    addItem(item: Items){
        const cartItem= this.cart.find(cartItems => cartItems.key === item.key);
        if(cartItem) {  
            cartItem.quantity = (+cartItem.quantity + +item.quantity).toString(); 
            cartItem.subtotal = (+cartItem.quantity * +cartItem.price).toString();
                     }
        else { 
            var tempCart = <Carts>{};
            item.subtotal = (+item.quantity * +item.price).toString();
            Object.assign(tempCart,item); 
     //       tempCart.index = tempCart.index ? tempCart.index : this.initial.toString();
            tempCart.index =  Cart.index.toString();  
            tempCart.price =  item.price.toString();
            this.cart.push(tempCart); 
            Cart.index++;
             }
    }

    deleteItem(ind:String){
        const cartItem= this.cart.find(cartItems => cartItems.key === ind);
        if (cartItem != undefined){
        _.remove(this.cart, function(item){
            return item.index === cartItem.index.toString();
        });
                                  }
    }

    getcalculateTotal(){
        return _.sumBy(this.cart, item=> Number(item.subtotal));
    }

    clear(){
        this.cart = [];
    }

    getCart(){
        return this.cart;   
    }

    getCount(){
        return this.cart.length;
    }

    updateCart(value){

        let myIndex = 0;  
        let myCart  =  this.cart.slice(); 
        let currectCart = this.cart; 

        Object.keys(value).map(function (key) { 
            if (key.includes("index")){
                let cartItem = currectCart.find(cartItems => cartItems.key === value[key]);
                let myKey = 'quantity' + key.charAt(10);
                    if(+cartItem.quantity !== +value[myKey]){
                        if (value[myKey] > 0){
                        cartItem.quantity = value[myKey];
                        cartItem.subtotal = (+cartItem.price * value[myKey]).toString();
                                           }
                        else {
                            myIndex = currectCart.indexOf(cartItem);
                            if (myIndex !== -1){
                            currectCart.splice(myIndex, 1); 
                           // currectCart.splice(+cartItem.index, 1); 
                                               }
                             }                   
                    }
            }
        });        

    }

    getStatus(): Boolean{
        return this.inProcess;
    }

    setStatus(myStatus:Boolean){
        this.inProcess == myStatus;
    }



}







