import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from "../../StateProvider";
import CheckoutProduct from "../Checkouts/CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../../reducer";
import axios from '../../axios';
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {

            try {
                const response = await axios({
                    method: 'post',
                    // Stripe expects the total in a currencies subunits
                    url: `/payments/create?total=${getBasketTotal(basket) * 100}`
                })
                setClientSecret(response.data.clientSecret)
            } catch (error) {
                console.log("Stripe API", error)
            }

        }
        getClientSecret();

    }, [])

    console.log('THE SECRET IS >>>', clientSecret)
    console.log('👱', user)




    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;


        const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            }
        );

        console.log(error);
        if (error) {
            error.type === "card_error" || error.type === "validation_error"
                ? setError(error.message)
                : setError("An unexpected error occurred.");
        }

        if (paymentIntent) {
            try {
                await setDoc(doc(db, `users/${user.uid}/orders`, paymentIntent.id), {
                    basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created,
                });

                console.log("Document written with ID: ", paymentIntent.id);

                setSucceeded(true);
                setError(null)
                setProcessing(false)

                dispatch({
                    type: 'EMPTY_BASKET'
                })
                history('/orders')

                return;
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }


    };


    const handleChange = event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout (
                    <Link to="/checkout">{basket?.length} items</Link>
                    )
                </h1>


                {/* Payment section - delivery address */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>

                {/* Payment section - Review Items */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map((item, i) => (

                            <CheckoutProduct
                                key={i}
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}

                    </div>
                </div>


                {/* Payment section - Payment method */}
                <div className='payment__section'>
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        {/* Stripe magic will go */}

                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />

                            <div className='payment__priceContainer'>
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>

                            {/* Errors */}
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
