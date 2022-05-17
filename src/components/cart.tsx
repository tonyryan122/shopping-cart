import React, { useEffect, useState } from 'react';
import '../styles/cart.css';
import {ICartItem} from '../external/cart';
import {IProduct} from '../external/product';
import {formatCurrency} from '../util';

interface ICartProps {
    cartItems: ICartItem[],
    products: IProduct[],
    removeProductFromCart: (product: IProduct) => void,
    addProductToCart: (product: IProduct) => void
}

interface ISummerizedCartItem {
    totalCost: number,
    discount: number,
    cartItem: ICartItem,
    product: IProduct
}


const findProductById = (id: number, products: IProduct[]) => {
    return products.find(item => item.id === id);
}

/**
 * Calculate discounted product cost
 */
const getDiscountedCostOfItem = (product: IProduct, quantity: number) => {
    switch(product.name) {
        case 'Face Masks':
            return (quantity - quantity % 2) / 2 * 4 + (quantity % 2) * product.price;
        case 'Toilet Paper':
            return product.price * quantity - ((quantity - quantity % 6) / 6 * product.price);
        default:
            return product.price * quantity;
    }
}

export default function Cart(props: ICartProps) {
    const [summerizedCartItems, setSummerizedCartItems] = useState<ISummerizedCartItem[]>([]);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const costs = [];
        let totalCost = 0;

        for (let item of props.cartItems) {
            // calculate costs for each cart items
            const product = findProductById(item.productId, props.products);
            if (product == null)
                return;

            const originalPrice = product.price * item.quantity;
            const discountedCostOfItem = getDiscountedCostOfItem(product, item.quantity);
            costs.push({
                totalCost: originalPrice,
                discount: originalPrice - discountedCostOfItem,
                cartItem: item,
                product: product
            });

            // calculate total price of items 
            totalCost += discountedCostOfItem;
        };

        setSummerizedCartItems(costs);
        setTotalCost(totalCost);
    }, [props.cartItems, props.products]);

    return (
        <div className="cart">
            <div className="header">Shopping Cart</div>
            <table className="basket">
                <thead>
                    <tr>
                        <th className="col">Item</th>
                        <th className="col">Unit Cost</th>
                        <th className="col">Total Cost</th>
                        <th className="col last" colSpan={2}>Discount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.cartItems.length < 1 ?
                        <tr>
                            <td colSpan={4} className="noItem">There is no item in shopping cart.</td>
                        </tr>
                        :
                        summerizedCartItems.map((item) => {
                            return (
                                <tr key={item.product.id} id={'' +item.product.id}>
                                    <td className="col">{item.cartItem.quantity} {item.product.name}</td>
                                    <td className="col">{formatCurrency(item.product.price)}</td>
                                    <td className="col">{formatCurrency(item.totalCost)}</td>
                                    <td className="col">{formatCurrency(item.discount)}</td>
                                    <td className="col last">
                                        <span className="action removeButton" onClick={() => {props.removeProductFromCart(item.product)}}>-</span>
                                        <span className="action quantity">{item.cartItem.quantity}</span>
                                        <span className="action addButton" onClick={() => {props.addProductToCart(item.product)}}>+</span>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    <tr className="summary">
                        <td id="totalLabel" colSpan={3} align="right">Total to pay:</td>
                        <td id="total"><b>{formatCurrency(totalCost)}</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}