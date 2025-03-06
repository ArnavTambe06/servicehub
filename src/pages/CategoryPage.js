import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebaseInit';
import ServiceCard2 from '../components/ServiceCard2';

const CategoryPage = () => {
    const { category } = useParams();
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const providersQuery = query(collection(db, 'providers'));
                const providerSnapshots = await getDocs(providersQuery);
                let allServices = [];
                providerSnapshots.forEach(providerDoc => {
                    const servicesArray = providerDoc.data().services || [];
                    const filteredServices = servicesArray.filter(service => service.serviceCategory === category);
                    // Optionally add an ID composed using providerDoc.id and service id
                    filteredServices.forEach(service => {
                        allServices.push({ id: providerDoc.id + '_' + service.serviceId, ...service });
                    });
                });
                setServices(allServices);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, [category]);

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
