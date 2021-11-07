import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartModel } from '../models/cart.model';
import { ItemModel } from '../models/item.model';
import { ItemAddedAction, ItemDeletedAction, ItemsDownloadedAction, ItemUpdatedAction } from '../redux/cart-items-state';
import { cartAddedAction, cartDownloadedAction, cartPaidAction } from '../redux/cart-state';
import store from '../redux/store';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor(private http: HttpClient) { }

    public async getOpenCartByUserIdAsync(userId: string): Promise<CartModel> {
        if(store.getState().cartState.cart === null){
            let openCart = await this.http.get<CartModel>(environment.cartsUrl + userId).toPromise();
            store.dispatch(cartDownloadedAction(openCart));
        }
        return store.getState().cartState.cart;
    }

    public async addCartAsync(cart: CartModel): Promise<CartModel> {
        const addedCart = await this.http.post<CartModel>(environment.cartsUrl, cart).toPromise();
        store.dispatch(cartAddedAction(addedCart));
        return addedCart;
    }

    public async cartIsPaid(cart: CartModel): Promise<CartModel> {
        const updatedCart = await this.http.patch<CartModel>(environment.cartsUrl + cart._id,cart).toPromise();
        store.dispatch(cartPaidAction());
        return updatedCart;
    }

    public async addItemToCartAsync(item: ItemModel): Promise<ItemModel> {
        const addedItem = await this.http.post<ItemModel>(environment.itemsUrl, item).toPromise();
        store.dispatch(ItemAddedAction(addedItem));
        return addedItem;
    }

    public async getItemsByCartIdAsync(cartId: string): Promise<ItemModel[]> {
        if (store.getState().itemsState.items.length === 0) {
            const items = await this.http.get<ItemModel[]>(environment.itemsUrl + "cart/" + cartId).toPromise();
            store.dispatch(ItemsDownloadedAction(items));
        }
        return store.getState().itemsState.items;
    }

    public async updateItemAsync(item: ItemModel): Promise<ItemModel> {
        const updatedItem = await this.http.patch<ItemModel>(environment.itemsUrl + item._id, item).toPromise();
        store.dispatch(ItemUpdatedAction(updatedItem));
        return updatedItem;
    }

    public async deleteItemAsync(id: string): Promise<void> {
        const deletedItemId = await this.http.delete<string>(environment.itemsUrl + id).toPromise();
        store.dispatch(ItemDeletedAction(deletedItemId));
    }

}