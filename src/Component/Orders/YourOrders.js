import React, { useState, useEffect } from 'react';
import { db } from "../../firebase";
import './YourOrders.css'
import { useStateValue } from "../../StateProvider";
import OrderTotal from './OrderTotal'


import { collection, query, orderBy, onSnapshot } from "firebase/firestore"


function YourOrders() {
    const [{ basket, user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);

    // useEffect(() => {
    //     if (user) {
    //         db
    //             .collection('users')
    //             .doc(user?.uid)
    //             .collection('orders')
    //             .orderBy('created', 'desc')
    //             .onSnapshot(snapshot => (
    //                 setOrders(snapshot.docs.map(doc => ({
    //                     id: doc.id,
    //                     data: doc.data()
    //                 })))
    //             ))
    //     } else {
    //         setOrders([])
    //     }

    // }, [user])


    /* function to get all tasks from firestore in realtime */


    useEffect(() => {
        const q = query(
            collection(db, `users/${user?.uid}/orders`),
            orderBy("created", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const orders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));

            setOrders(orders);
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    return (
        <div className='orders'>
            <h1>Your Orders</h1>

            <div className='orders__order'>
                {orders?.map(order => (
                    <OrderTotal order={order} />
                ))}
            </div>
        </div>
    )
}

export default YourOrders
