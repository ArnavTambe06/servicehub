import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseInit';
import Categories from '../components/Categories';
import ServiceCard from '../components/ServiceCard';
import Loading from '../components/Loading';

const Services = () => {
    const { currentUser, isProvider } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [allServices, setAllServices] = useState([]);
    const [userData, setUserData] = useState({
        userDataFirstName: '',
        userDataLastName: '',
        userDataEmail: '',
        userDataCart: []
    });

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'providers'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newServices = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.providerServices) {
                    newServices.push(...data.providerServices);
                }
            });
            setAllServices(newServices);
            setLoading(false);
        }, (error) => {
            console.error("Error listening for services: ", error);
            setLoading(false);
        });
        readUserData();
        return () => unsubscribe();
        // eslint-disable-next-line
    }, []);

    const readUserData = async () => {
        if (currentUser) {
            const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
            if (docSnap.exists()) {
                setUserData({
                    userDataFirstName: docSnap.data().userFirstName,
                    userDataLastName: docSnap.data().userLastName,
                    userDataEmail: docSnap.data().userEmail,
                    userDataCart: docSnap.data().userCart
                });
            }
        }
    };

    const onAddToCart = async (passedCategory, passedIndex) => {
        setLoading(true);
        if (currentUser) {
            const whichServices = allServices.filter(service => service.serviceCategory === passedCategory);
            const addedService = whichServices[passedIndex];
            const finalCart = [...userData.userDataCart, addedService];
            setUserData(userData => ({ ...userData, userDataCart: finalCart }));
            await updateDoc(doc(db, 'users', currentUser.uid), { userCart: finalCart })
                .catch((error) => {
                    console.log(`Error: ${error.message}`);
                    setLoading(false);
                });
            alert(`Added ${addedService.serviceTitle} by ${addedService.serviceProvider} to cart.`);
        } else {
            alert(`Please Login or Signup first.`);
        }
        setLoading(false);
    };

    const categories = ['Cleaning', 'Electricians', 'Plumbers', 'Carpenters', 'Pest Control', 'Salon for Women', 'Salon for Men'];

    return (
        <>
            <div className='eightyperc-container'>
                <div className='card-type1'>
                    <div className='ninetyfiveperc-container'>
                        <h2 className='heading-type3'>Services</h2>
                        <p>Choose from the best services at the lowest prices:</p>
                    </div>
                    <Categories />
                </div>
            </div>
            {categories.map(category => {
                const validServices = allServices.filter(service => service.serviceCategory === category);
                return (
                    <div className='eightyperc-container' key={category} id={category}>
                        <div className='card-type1'>
                            <div className='ninetyfiveperc-container'>
                                <div className='services flex-column-stretch'>
                                    <h3 className='para-type1'>{category}:</h3>
                                    <div className="flex-column-stretch dark-grey-container">
                                        {loading ? <Loading /> : (
                                            validServices.length !== 0 ? (
                                                validServices.map((eachService, index) => (
                                                    <ServiceCard
                                                        key={`${category}-${eachService.serviceId || index}`}
                                                        passedService={eachService}
                                                        passedIndex={index}
                                                        showButton={!isProvider}
                                                        onAddToCart={onAddToCart}
                                                    />
                                                ))
                                            ) : (
                                                <div className='flex-row'>
                                                    <p className='para-type2'>No {category} Services</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Services;
