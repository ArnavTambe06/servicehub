import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, onSnapshot } from '@firebase/firestore';
import { db } from '../firebaseInit';
import { AuthContext } from '../contexts/AuthContext';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const UserBookings = () => {
    const { currentUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, 'bookings'),
                where('userId', '==', currentUser.uid)
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

    return (
        <Paper sx={{ p: 3, m: 3, maxWidth: '1000px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                My Bookings
            </Typography>
            {bookings.length === 0 ? (
                <Typography>No bookings yet.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Service Title</TableCell>
                            <TableCell>Booked Date</TableCell>
                            <TableCell>Timeslot</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.serviceTitle}</TableCell>
                                <TableCell>{booking.bookedDate}</TableCell>
                                <TableCell>{booking.timeslot}</TableCell>
                                <TableCell>{booking.status}</TableCell>
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

export default UserBookings;
