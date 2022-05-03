import React, { useEffect } from "react";
import "./App.css";
import Header from "./Component/Header/Header";
import Home from "./Component/Home/Home";
import { Routes, Route } from 'react-router-dom';
import Checkout from "./Component/Checkouts/Checkout";
import Login from "./Component/Auth/Login/Login";
import Payment from "./Component/Payment/Payment";
import YourOrders from "./Component/Orders/YourOrders";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51Kv2r0KqcPHtPsOFIRHS2oZrKpMXP5jCE96H7PwOWVDh0XQ2ySDFgujhqlz4H1wCEdte41TZIU24419xxxCl6Mrl00T8uqgKYd"
);

function App() {
  const [{ }, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    // <Router>
    //   <div className="app">
    //     <Switch>
    //       <Route path="/orders">
    //         <Header />
    //         <YourOrders />
    //       </Route>
    //       <Route path="/login">
    //         <Login />
    //       </Route>
    //       <Route path="/checkout">
    //         <Header />
    //         <Checkout />
    //       </Route>
    //       <Route path="/payment">
    //         <Header />
    //         <Elements stripe={promise}>
    //           <Payment />
    //         </Elements>
    //       </Route>
    //       <Route path="/">
    //         <Header />
    //         <Home />
    //       </Route>
    //     </Switch>
    //   </div>
    // </Router>

    <div className="app">
      <Routes>
        <Route exact path="/" element={[<Header />, <Home />]} />
        <Route exact path="/payment" element={[<Header />, <Elements stripe={promise}><Payment /> </Elements>]} />
        <Route exact path="/checkout" element={[<Header />, <Checkout />]} />
        <Route exact path="/login" element={[<Login />]} />
        <Route exact path="/orders" element={[<Header />, <YourOrders />]} />
      </Routes>
    </div>

  );
}

export default App;
