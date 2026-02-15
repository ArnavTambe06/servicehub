import React, { useState, useEffect, useContext } from 'react';
import { doc, onSnapshot, addDoc, collection, updateDoc } from '@firebase/firestore';
import { db } from '../firebaseInit';
import { AuthContext } from '../contexts/AuthContext';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper } from '@mui/material';
import './Checkout.css';

const Checkout = () => {
    const { currentUser } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [timeslot, setTimeslot] = useState('');

    // Real-time listener for the user's cart
    useEffect(() => {
        if (currentUser) {
            const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
                if (docSnap.exists()) {
                    const userCart = docSnap.data().userCart || [];
                    setCart(userCart);
                    const cartTotal = userCart.reduce((sum, service) => sum + parseFloat(service.servicePrice), 0);
                    setTotal(cartTotal);
                }
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleCheckout = async () => {
        if (!selectedDate || !timeslot) {
            alert("Please select a date and timeslot for booking.");
            return;
        }
        try {
            for (const service of cart) {
                await addDoc(collection(db, 'bookings'), {
                    userId: currentUser.uid,  // ownership field
                    userName: service.fullname || currentUser.displayName || currentUser.email,  // fallback to displayName then email
                    customerEmail: currentUser.email,  // for providers to see
                    serviceTitle: service.serviceTitle,
                    bookedDate: selectedDate,
                    timeslot: timeslot,
                    status: 'pending',
                    providerId: service.providerId
                });
            }
            await updateDoc(doc(db, 'users', currentUser.uid), {
                userCart: []
            });
            alert(`Booking successful for ${cart.length} service(s).
Provider bookings have been updated.`);
        } catch (err) {
            alert("Error during booking: " + err.message);
        }
    };

    return (
        <Paper className="checkout-container" elevation={3}>
            <h2>Checkout</h2>
            <div className="cart-summary">
                <h3>Your Cart ({cart.length} items)</h3>
                {cart.map((service, index) => (
                    <div key={index} className="cart-item">
                        <p>{service.serviceTitle} - Rs. {service.servicePrice}</p>
                    </div>
                ))}
                <h3>Total: Rs. {total.toFixed(2)}</h3>
            </div>
            <div className="booking-form">
                <TextField
                    type="date"
                    label="Select Date"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                />
                <FormControl component="fieldset" fullWidth sx={{ marginBottom: '1rem' }}>
                    <FormLabel component="legend">Select Timeslot</FormLabel>
                    <RadioGroup
                        row
                        value={timeslot}
                        onChange={(e) => setTimeslot(e.target.value)}
                    >
                        <FormControlLabel value="Morning (8AM - 12PM)" control={<Radio />} label="Morning" />
                        <FormControlLabel value="Afternoon (12PM - 4PM)" control={<Radio />} label="Afternoon" />
                        <FormControlLabel value="Evening (4PM - 8PM)" control={<Radio />} label="Evening" />
                    </RadioGroup>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleCheckout} fullWidth>
                    Book Services
                </Button>
            </div>
        </Paper>
    );
};

export default Checkout;
