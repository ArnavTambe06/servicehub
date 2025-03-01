import React, { useState, useContext, useEffect } from 'react'; // Add useEffect
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from '@firebase/firestore'; // Add getDoc
import { db } from '../firebaseInit';
import ServiceCard2 from '../components/ServiceCard2';
import {
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button as MuiButton,
    Grid  // Added Grid import
} from '@mui/material';
import { Person, Logout, Delete } from '@mui/icons-material';
import { globalIconStyle } from '../assets/GlobalStyles';
import './ProviderAccount.css';

const ProviderAccount = ({ providerData, setProviderData, onSignOutSubmit, onDeleteUser }) => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [serviceInput, setServiceInput] = useState({
        serviceId: 0,
        serviceTitle: '',
        serviceDescription: '',
        serviceCategory: '',
        servicePrice: 0.0,
        serviceProvider: '',
    });

    // Add useEffect to fetch provider data when component mounts
    useEffect(() => {
        const fetchProviderData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'providers', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProviderData(data);
                    }
                } catch (error) {
                    console.error("Error fetching provider data:", error);
                }
            }
        };

        fetchProviderData();
    }, [currentUser, setProviderData]);

    // New: Function to set the form for editing an existing service
    const onEditService = (service) => {
        setServiceInput(service);
    };

    // Updated delete function: prompt user to type "yes" to confirm deletion
    const onDeleteService = async (serviceId) => {
        const answer = prompt("Type 'yes' to confirm deletion of this service:");
        if (answer && answer.toLowerCase() === 'yes') {
            try {
                // Filter out the service with matching serviceId
                const updatedServices = (providerData.services || [])
                    .filter(service => String(service.serviceId) !== String(serviceId));

                // Update Firestore first
                await updateDoc(doc(db, 'providers', currentUser.uid), {
                    services: updatedServices
                });

                // Then update local state to reflect the change
                setProviderData(prev => ({
                    ...prev,
                    services: updatedServices
                }));

                alert('Service deleted successfully!');
            } catch (error) {
                console.error("Service deletion failed:", error);
                alert("Service deletion failed: " + error.message);
            }
        }
    };

    const onAddServiceSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newServiceId = Date.now().toString();
            const newService = {
                ...serviceInput,
                serviceId: newServiceId,
                serviceProvider: providerData.companyName,
            };

            // Get current services array or initialize empty array
            const currentServices = providerData.services || [];
            const updatedServices = [...currentServices, newService];

            // Update Firestore
            const providerRef = doc(db, 'providers', currentUser.uid);
            await updateDoc(providerRef, {
                services: updatedServices
            });

            // Update local state
            setProviderData(prev => ({
                ...prev,
                services: updatedServices
            }));

            // Reset form
            setServiceInput({
                serviceId: '',
                serviceTitle: '',
                serviceDescription: '',
                serviceCategory: '',
                servicePrice: 0.0,
                serviceProvider: '',
            });

            alert('Service added successfully!');
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const [openUpdate, setOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({ ...providerData });

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        try {
            // Remove undefined values from updateData
            const filteredUpdateData = Object.fromEntries(
                Object.entries(updateData).map(([key, value]) => [key, value === undefined ? "" : value])
            );
            await updateDoc(doc(db, 'providers', currentUser.uid), filteredUpdateData);
            setProviderData(filteredUpdateData);
            setOpenUpdate(false);
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    return (
        <>
            <div className='flex-row'>
                <div className='card-type1 account-card'>
                    <div className='flex-column-stretch eightyperc-container'>
                        <div className='flex-row'>
                            <div className='circle size100px'>
                                <Person style={globalIconStyle} />
                            </div>
                        </div>
                        <h3 className='heading-type3 center-text'>{providerData.companyName}</h3>
                        <div className='flex-row'><p className='para-type2'>Account Manager:</p><p className='grey-container'>{providerData.firstName} {providerData.lastName}</p></div>
                        <div className='flex-row'><p className='para-type2'>Email:</p><p className='grey-container'>{providerData.email}</p></div>
                        <div className='flex-row'><p className='para-type2'>Phone Number:</p><p className='grey-container'>{providerData.phone}</p></div>
                        <div className='flex-row left-justify'><p className='para-type2'>About Your Company:</p></div>
                        <div className="flex-row"><p className='grey-container'>{providerData.description}</p></div>
                        <button className='button-type1' onClick={onSignOutSubmit}><Logout />Log Out</button>
                        <button className='button-type2' onClick={onDeleteUser}><Delete />Delete Account</button>
                        <button className='button-type1' onClick={() => setOpenUpdate(true)}>Update Details</button>
                    </div>
                </div>
            </div>
            <div className='card-type1 account-card'>
                <div className='flex-column-stretch ninetyfiveperc-container'>
                    <h4 className='heading-type3'>Your Services: {(providerData?.services || []).length}</h4>
                    <div className="flex-column-stretch dark-grey-container">
                        {providerData?.services?.length > 0 ? providerData.services.map((eachService, index) => (
                            <ServiceCard2
                                key={`service-${eachService.serviceId || index}`}
                                passedService={eachService}
                                passedIndex={index}
                                showDelete={true}
                                onDeleteItem={onDeleteService}  // Updated prop to match what ServiceCard2 expects
                                onEditService={onEditService}
                            />
                        )) : <p className='para-type2'>No Services Added</p>}
                    </div>
                </div>
            </div>
            <div className='card-type1 account-card auto-side-margin'>
                <form onSubmit={onAddServiceSubmit} className='eightyperc-container'>
                    <h4 className='heading-type3'>{serviceInput.serviceId ? "Edit Service" : "Add a New Service"}</h4>
                    {/* NEW: Service Category dropdown shown first */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            name='serviceCategory'
                            value={String(serviceInput.serviceCategory)}
                            onChange={(e) => setServiceInput(prev => ({ ...prev, serviceCategory: e.target.value }))}
                        >
                            <MenuItem value=''>Select Service Category</MenuItem>
                            <MenuItem value='Cleaning'>Cleaning</MenuItem>
                            <MenuItem value='Electricians'>Electricians</MenuItem>
                            <MenuItem value='Plumbers'>Plumbers</MenuItem>
                            <MenuItem value='Carpenters'>Carpenters</MenuItem>
                            <MenuItem value='Pest Control'>Pest Control</MenuItem>
                            <MenuItem value='Salon for Women'>Salon for Women</MenuItem>
                            <MenuItem value='Salon for Men'>Salon for Men</MenuItem>
                            <MenuItem value='Massage'>Massage</MenuItem>
                            <MenuItem value='Miscellanious'>Miscellanious</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Then the rest of the service fields */}
                    <TextField
                        label='Service Title'
                        name='serviceTitle'
                        fullWidth
                        value={serviceInput.serviceTitle}
                        onChange={(e) => setServiceInput(prev => ({ ...prev, serviceTitle: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label='Service Description'
                        name='serviceDescription'
                        fullWidth
                        multiline
                        rows={3}
                        value={serviceInput.serviceDescription}
                        onChange={(e) => setServiceInput(prev => ({ ...prev, serviceDescription: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label='Service Price (Rs.)'
                        name='servicePrice'
                        fullWidth
                        type='number'
                        value={serviceInput.servicePrice}
                        onChange={(e) => setServiceInput(prev => ({ ...prev, servicePrice: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <MuiButton type='submit' variant='contained' fullWidth disabled={loading}>
                        {serviceInput.serviceId ? "Update Service" : "Submit"}
                    </MuiButton>
                </form>
            </div>
            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Your Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Company Name"
                                name="companyName"
                                fullWidth
                                value={updateData.companyName || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                fullWidth
                                value={updateData.firstName || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                name="lastName"
                                fullWidth
                                value={updateData.lastName || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                value={updateData.email || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                name="phone"
                                fullWidth
                                value={updateData.phone || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={3}
                                value={updateData.description || ''}
                                onChange={handleUpdateChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenUpdate(false)}>Cancel</MuiButton>
                    <MuiButton onClick={handleUpdateSubmit} variant="contained">
                        Update Profile
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProviderAccount;
