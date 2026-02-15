import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import { doc, updateDoc } from '@firebase/firestore'
import { db } from '../firebaseInit'
import ServiceCard2 from '../components/ServiceCard2'
import { Person, Logout, Delete } from '@mui/icons-material'
import { globalIconStyle } from '../assets/GlobalStyles'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, Grid } from '@mui/material'
import './UserAccount.css'

const UserAccount = ({ userData, setUserData, onSignOutSubmit, onDeleteUser }) => {
    const history = useHistory()
    const { currentUser } = useContext(AuthContext)
    const [, setLoading] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({ ...userData });

    // Sync updateData with realtime userData updates.
    useEffect(() => {
        setUpdateData({ ...userData });
    }, [userData]);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        try {
            const updatedFields = {
                name: updateData.userDataFirstName || "",
                lastname: updateData.userDataLastName || "",
                email: updateData.userDataEmail || "",
                address: updateData.userDataAddress || "",
                number: updateData.userDataNumber || ""
            };
            await updateDoc(doc(db, 'users', currentUser.uid), updatedFields);
            alert("Details updated successfully!");
            setOpenUpdate(false);
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    const onDeleteItem = async (passedIndex) => {
        setLoading(true)
        const finalCart = [...userData.userDataCart]
        finalCart.splice(passedIndex, 1)
        setUserData(prev => ({
            ...prev,
            userDataCart: finalCart
        }))
        await updateDoc(doc(db, 'users', currentUser.uid), {
            userCart: finalCart
        }).catch((error) => {
            console.log(`Error: ${error.message}`)
            setLoading(false)
            return
        })
        setLoading(false)
    };

    const calculateCartTotal = (cart) => {
        return cart.reduce((total, service) => total + parseFloat(service.servicePrice), 0)
    };

    const onCheckOutClicked = () => {
        history.push('/checkout')
    };

    return (
        <>
            <div className="user-account-container">
                <div className="user-account-header">
                    <div className="profile-circle">
                        <Person style={globalIconStyle} />
                    </div>
                    <h3 className="heading-type3 center-text">
                        {userData.userDataFirstName} {userData.userDataLastName}
                    </h3>
                    <div className="user-info">
                        <p>Email: {userData.userDataEmail}</p>
                        <p>Address: {userData.userDataAddress}</p>
                        <p>Phone: {userData.userDataNumber}</p>
                    </div>
                    <div className="user-account-buttons">
                        <button className="button-type1" onClick={onSignOutSubmit}>
                            <Logout /> Log Out
                        </button>
                        <button className="button-type2" onClick={onDeleteUser}>
                            <Delete /> Delete Account
                        </button>
                        <button className="user-update-btn" onClick={() => setOpenUpdate(true)}>
                            Update Details
                        </button>
                    </div>
                </div>

                <div className="user-cart-container">
                    <h4>Your Cart Items: {userData.userDataCart.length}</h4>
                    <div className="dark-grey-container">
                        {userData.userDataCart.length !== 0 ? userData.userDataCart.map((eachService, serviceIndex) => (
                            <div key={serviceIndex} className="cart-item">
                                <ServiceCard2
                                    passedService={eachService}
                                    passedIndex={serviceIndex}
                                    onDeleteItem={onDeleteItem}
                                    showDelete={true}
                                />
                            </div>
                        )) : <p className="para-type2">Cart is Empty</p>}
                    </div>
                    <div className="cart-total">
                        Cart Total: Rs. {calculateCartTotal(userData.userDataCart)}
                    </div>
                    <div className="checkout-button-container">
                        <button className="button-type1" onClick={onCheckOutClicked}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Your Details</DialogTitle>
                <DialogContent className="dialog-content">
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Full Name"
                                name="userDataFirstName"
                                fullWidth
                                value={updateData.userDataFirstName || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="userDataEmail"
                                fullWidth
                                value={updateData.userDataEmail || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="userDataAddress"
                                fullWidth
                                value={updateData.userDataAddress || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                name="userDataNumber"
                                fullWidth
                                value={updateData.userDataNumber || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenUpdate(false)}>Cancel</MuiButton>
                    <MuiButton onClick={handleUpdateSubmit} variant="contained">
                        Update
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserAccount
