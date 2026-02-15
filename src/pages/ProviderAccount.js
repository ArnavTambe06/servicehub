import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { doc, onSnapshot, updateDoc } from '@firebase/firestore';
import { db } from '../firebaseInit';
import ServiceCard2 from '../components/ServiceCard2';
import { Person, Logout, Delete } from '@mui/icons-material';
import './ProviderAccount.css';
import { useHistory } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProviderAccount = ({ providerData, setProviderData, onSignOutSubmit, onDeleteUser }) => {
    const { currentUser } = useContext(AuthContext);
    const history = useHistory();
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});

    // New state for service update
    const [openServiceUpdate, setOpenServiceUpdate] = useState(false);
    const [serviceUpdateData, setServiceUpdateData] = useState({});
    const [serviceUpdateIndex, setServiceUpdateIndex] = useState(null);

    // NEW: State for adding a new service
    const [openAddService, setOpenAddService] = useState(false);
    const [newServiceData, setNewServiceData] = useState({
        serviceTitle: "",
        serviceDescription: "",
        servicePrice: "",
        serviceCategory: ""
    });

    // NEW: Define available categories for new services
    const availableCategories = [
        'Cleaning',
        'Electricians',
        'Plumbers',
        'Carpenters',
        'Pest Control',
        'Salon for Women',
        'Salon for Men',
        'Massage',
    ];

    // Real-time listener for provider data and services
    useEffect(() => {
        if (currentUser) {
            const unsubscribe = onSnapshot(doc(db, 'providers', currentUser.uid), (docSnap) => {
                if (docSnap.exists()) {
                    setProviderData(docSnap.data());
                    setUpdateData(docSnap.data());
                }
            });
            return () => unsubscribe();
        }
    }, [currentUser, setProviderData]);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        try {
            await updateDoc(doc(db, 'providers', currentUser.uid), {
                companyName: updateData.companyName || "",
                firstName: updateData.firstName || "",
                lastName: updateData.lastName || "",
                email: updateData.email || "",
                phone: updateData.phone || "",
                description: updateData.description || ""
            });
            alert("Profile updated successfully!");
            setOpenUpdate(false);
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    // Handlers for updating a service 
    const handleServiceUpdateChange = (e) => {
        const { name, value } = e.target;
        setServiceUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceUpdateSubmit = async () => {
        try {
            const updatedServices = [...providerData.services];
            updatedServices[serviceUpdateIndex] = serviceUpdateData;
            await updateDoc(doc(db, 'providers', currentUser.uid), { services: updatedServices });
            alert("Service updated successfully!");
            setOpenServiceUpdate(false);
        } catch (error) {
            alert("Service update failed: " + error.message);
        }
    };

    // NEW: Handler for new service field changes
    const handleNewServiceChange = (e) => {
        const { name, value } = e.target;
        setNewServiceData(prev => ({ ...prev, [name]: value }));
    };

    // NEW: Handler for submitting new service
    const handleAddServiceSubmit = async () => {
        try {
            const updatedServices = providerData.services ? [...providerData.services] : [];
            // Simple id generated from timestamp
            newServiceData.serviceId = Date.now().toString();
            updatedServices.push(newServiceData);
            await updateDoc(doc(db, 'providers', currentUser.uid), { services: updatedServices });
            alert("New service added successfully!");
            setOpenAddService(false);
            setNewServiceData({ serviceTitle: "", serviceDescription: "", servicePrice: "", serviceCategory: "" });
        } catch (error) {
            alert("Failed to add new service: " + error.message);
        }
    };

    return (
        <>
            <div className="account-container">
                <div className="account-card">
                    <div className="account-header">
                        <div className="logo-circle">
                            <Person />
                        </div>
                        <h3>{providerData.companyName}</h3>
                    </div>
                    <div className="account-details">
                        <p>Account Manager: {providerData.firstName} {providerData.lastName}</p>
                        <p>Email: {providerData.email}</p>
                        <p>Phone Number: {providerData.phone}</p>
                        <p>About Your Company: {providerData.description}</p>
                    </div>
                    <div className="account-actions">
                        <button className="button-type1" onClick={onSignOutSubmit}>
                            <Logout /> Log Out
                        </button>
                        <button className="button-type1" onClick={() => setOpenUpdate(true)}>
                            Update Profile
                        </button>
                        <button className="button-type2" onClick={onDeleteUser}>
                            <Delete /> Delete Account
                        </button>
                    </div>
                </div>

                <div className="account-card">
                    <h4>Your Services: {providerData.services ? providerData.services.length : 0}</h4>
                    <div className="service-list">
                        {providerData.services && providerData.services.length > 0 ? (
                            providerData.services.map((service, index) => (
                                <div key={service.serviceId || index} style={{ marginBottom: '1rem' }}>
                                    <ServiceCard2
                                        passedService={service}
                                        passedIndex={index}
                                        showDelete={true}
                                        onDeleteItem={() => {
                                            /* Implement deletion handler if needed */
                                        }}
                                    />
                                    <button
                                        className="button-type1"
                                        onClick={() => {
                                            setServiceUpdateIndex(index);
                                            setServiceUpdateData(service);
                                            setOpenServiceUpdate(true);
                                        }}
                                    >
                                        Update Service
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No Services Added</p>
                        )}
                        {/* NEW: Button to add a new service */}
                        <button className="button-type1" onClick={() => setOpenAddService(true)}>
                            Add New Service
                        </button>
                    </div>
                </div>

                <div className="account-card">
                    <button className="button-type1" onClick={() => history.push('/provider-bookings')}>
                        View Bookings
                    </button>
                </div>
            </div>

            {/* Update Profile Dialog */}
            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Provider Profile</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Company Name" name="companyName" value={updateData.companyName || ''} onChange={handleUpdateChange} fullWidth />
                    <TextField margin="dense" label="First Name" name="firstName" value={updateData.firstName || ''} onChange={handleUpdateChange} fullWidth />
                    <TextField margin="dense" label="Last Name" name="lastName" value={updateData.lastName || ''} onChange={handleUpdateChange} fullWidth />
                    <TextField margin="dense" label="Email" name="email" value={updateData.email || ''} onChange={handleUpdateChange} fullWidth />
                    <TextField margin="dense" label="Phone" name="phone" value={updateData.phone || ''} onChange={handleUpdateChange} fullWidth />
                    <TextField margin="dense" label="Description" name="description" value={updateData.description || ''} onChange={handleUpdateChange} fullWidth multiline />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenUpdate(false)}>Cancel</MuiButton>
                    <MuiButton onClick={handleUpdateSubmit} variant="contained">
                        Update
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Update Service Dialog */}
            <Dialog open={openServiceUpdate} onClose={() => setOpenServiceUpdate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Service</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Service Title" name="serviceTitle" value={serviceUpdateData.serviceTitle || ''} onChange={handleServiceUpdateChange} fullWidth />
                    <TextField margin="dense" label="Description" name="serviceDescription" value={serviceUpdateData.serviceDescription || ''} onChange={handleServiceUpdateChange} fullWidth multiline />
                    <TextField margin="dense" label="Price" name="servicePrice" type="number" value={serviceUpdateData.servicePrice || ''} onChange={handleServiceUpdateChange} fullWidth />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenServiceUpdate(false)}>Cancel</MuiButton>
                    <MuiButton onClick={handleServiceUpdateSubmit} variant="contained">
                        Update Service
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* NEW: Add New Service Dialog */}
            <Dialog open={openAddService} onClose={() => setOpenAddService(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogContent>
                    {/* Moved category dropdown to the top */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="service-category-label">Category</InputLabel>
                        <Select
                            labelId="service-category-label"
                            id="service-category"
                            label="Category"
                            name="serviceCategory"
                            value={newServiceData.serviceCategory || ''}
                            onChange={handleNewServiceChange}
                        >
                            {availableCategories.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Service Title"
                        name="serviceTitle"
                        value={newServiceData.serviceTitle || ''}
                        onChange={handleNewServiceChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="serviceDescription"
                        value={newServiceData.serviceDescription || ''}
                        onChange={handleNewServiceChange}
                        fullWidth
                        multiline
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        name="servicePrice"
                        type="number"
                        value={newServiceData.servicePrice || ''}
                        onChange={handleNewServiceChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenAddService(false)}>Cancel</MuiButton>
                    <MuiButton onClick={handleAddServiceSubmit} variant="contained">
                        Add Service
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProviderAccount;
