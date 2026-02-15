import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from '@firebase/firestore';
import { db } from '../firebaseInit';
import { AuthContext } from '../contexts/AuthContext';
import { Button, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useHistory } from 'react-router-dom';
import './ProviderBookings.css';

const ProviderBookings = () => {
    const { currentUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, 'bookings'),
                where('providerId', '==', currentUser.uid)
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedBookings = [];
                snapshot.forEach((docSnap) => {
                    fetchedBookings.push({ id: docSnap.id, ...docSnap.data() });
                });
                setBookings(fetchedBookings);
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    const acceptBooking = async (bookingId) => {
        try {
            // First update the booking status
            await updateDoc(doc(db, 'bookings', bookingId), { status: 'accepted' });

            // Get the booking details
            const booking = bookings.find(b => b.id === bookingId);

            // Send confirmation email
            const response = await fetch('http://localhost:5000/api/send-booking-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerEmail: booking.customerEmail,
                    userName: booking.userName,
                    serviceTitle: booking.serviceTitle,
                    bookedDate: booking.bookedDate,
                    timeslot: booking.timeslot
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send confirmation email');
            }

            alert("Booking accepted and confirmation email sent!");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <Paper className="provider-bookings-container" elevation={3} sx={{ p: 3, m: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Your Bookings
            </Typography>
            {bookings.length === 0 ? (
                <Typography>No bookings yet.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Customer Email</TableCell>
                            <TableCell>Service Title</TableCell>
                            <TableCell>Booked Date</TableCell>
                            <TableCell>Timeslot</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.userName}</TableCell>
                                <TableCell>{booking.customerEmail}</TableCell>
                                <TableCell>{booking.serviceTitle}</TableCell>
                                <TableCell>{booking.bookedDate}</TableCell>
                                <TableCell>{booking.timeslot}</TableCell>
                                <TableCell>{booking.status}</TableCell>
                                <TableCell>
                                    {booking.status === 'pending' ? (
                                        <Button variant="outlined" onClick={() => acceptBooking(booking.id)}>
                                            Accept Booking
                                        </Button>
                                    ) : (
                                        <Typography variant="body2">{booking.status}</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => history.goBack()}>
                Back
            </Button>
        </Paper>
    );
};

export default ProviderBookings;