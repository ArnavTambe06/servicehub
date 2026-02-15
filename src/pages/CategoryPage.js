import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, getDocs, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseInit';
import ServiceCard2 from '../components/ServiceCard2';
import { AuthContext } from '../contexts/AuthContext';

const CategoryPage = () => {
    const { category } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [userCart, setUserCart] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const providersQuery = query(collection(db, 'providers'));
                const providerSnapshots = await getDocs(providersQuery);
                let allServices = [];
                providerSnapshots.forEach(providerDoc => {
                    const servicesArray = providerDoc.data().services || [];
                    const filteredServices = servicesArray.filter(service => service.serviceCategory === category);
                    filteredServices.forEach(service => {
                        // Added providerId: providerDoc.id
                        allServices.push({ id: providerDoc.id + '_' + service.serviceId, providerId: providerDoc.id, ...service });
                    });
                });
                setServices(allServices);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, [category]);

    // Real-time listener for the logged-in user's cart
    useEffect(() => {
        if (currentUser) {
            const unsubscribeUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
                if (docSnap.exists()) {
                    setUserCart(docSnap.data().userCart || []);
                }
            });
            return () => unsubscribeUser();
        }
    }, [currentUser]);

    // onAddToCart: update user's cart and Firestore in real time
    const onAddToCart = async (service) => {
        if (!currentUser) {
            alert("Please login or signup first.");
            return;
        }
        try {
            const newCart = [...userCart, service];
            await updateDoc(doc(db, 'users', currentUser.uid), { userCart: newCart });
            alert(`Added ${service.serviceTitle} by ${service.serviceProvider} to cart.`);
        } catch (error) {
            console.error(`Error adding to cart: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Services in "{category}" Category</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
            }}>
                {services.length > 0 ? (
                    services.map((service, index) => (
                        <ServiceCard2
                            key={service.id || index}
                            passedService={service}
                            passedIndex={index}
                            showDelete={false}
                            // Only pass the add-to-cart callback if the user is logged in
                            onAddToCart={currentUser ? () => onAddToCart(service) : null}
                        />
                    ))
                ) : (
                    <p>No services found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
