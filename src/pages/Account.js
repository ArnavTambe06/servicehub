import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { signOut, deleteUser } from 'firebase/auth'
import { auth, db } from '../firebaseInit'
import { doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import Loading from '../components/Loading'
import UserAccount from '../pages/UserAccount'
import ProviderAccount from '../pages/ProviderAccount'



const Account = () => {

    const history = useHistory()
    const { currentUser, setCurrentUser, isProvider, setIsProvider } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        userDataFirstName: '',
        userDataLastName: '',
        userDataEmail: '',
        userDataAddress: '',
        userDataNumber: '',
        userDataCart: []
    })

    const [providerData, setProviderData] = useState({
        providerDataFirstName: '',
        providerDataLastName: '',
        providerDataCompanyName: '',
        providerDataEmail: '',
        providerDataNumber: '',
        providerDataDescription: '',
        providerDataServices: []
    })

    // Real-time nested listener for account info using onSnapshot:
    useEffect(() => {
        if (currentUser) {
            const unsubscribeUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
                if (docSnap.exists()) {
                    setUserData({
                        userDataFirstName: docSnap.data().name,
                        userDataLastName: docSnap.data().lastname,
                        userDataEmail: docSnap.data().email,
                        userDataAddress: docSnap.data().address,
                        userDataNumber: docSnap.data().number,
                        userDataCart: docSnap.data().userCart || []
                    });
                    setIsProvider(false);
                } else {
                    onSnapshot(doc(db, 'providers', currentUser.uid), (docSnap) => {
                        if (docSnap.exists()) {
                            setProviderData({
                                providerDataFirstName: docSnap.data().providerFirstName,
                                providerDataLastName: docSnap.data().providerLastName,
                                providerDataCompanyName: docSnap.data().providerCompanyName,
                                providerDataEmail: docSnap.data().providerEmail,
                                providerDataNumber: docSnap.data().providerNumber,
                                providerDataDescription: docSnap.data().providerDescription,
                                providerDataServices: docSnap.data().providerServices
                            });
                            setIsProvider(true);
                        } else {
                            console.log(`No such users/providers found.`);
                        }
                    });
                }
            });
            return () => unsubscribeUser();
        }
    }, [currentUser, setIsProvider]);

    const onSignOutSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        signOut(auth).then(() => {
            setCurrentUser(null)
            setIsProvider(false)
        }).catch((error) => {
            console.log(error)
        });
        setLoading(false)
    }

    const onDeleteUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        var getWhich = 'users'
        if (isProvider) {
            getWhich = 'providers'
        }
        const user = auth.currentUser
        await deleteDoc(doc(db, getWhich, currentUser.uid))
        deleteUser(user).then(() => {
            alert('Successfully Deleted!')
            history.push('/login')
        }).catch((error) => {
            console.log(error)
        })
        setLoading(false)
    }

    const { path } = useRouteMatch();

    if (currentUser !== null) {
        return (
            <div className='ninetyfiveperc-container'>
                {loading ? <Loading /> :
                    <Switch>
                        <Route exact path={path}>
                            {isProvider ? (
                                <ProviderAccount
                                    providerData={providerData}
                                    setProviderData={setProviderData}
                                    onSignOutSubmit={onSignOutSubmit}
                                    onDeleteUser={onDeleteUser}
                                />
                            ) : (
                                <UserAccount
                                    userData={userData}
                                    setUserData={setUserData}
                                    onSignOutSubmit={onSignOutSubmit}
                                    onDeleteUser={onDeleteUser}
                                />
                            )}
                        </Route>
                        {/*
                      Optionally, additional nested routes (e.g., for editing details)
                      can be added here under /account/*.
                    */}
                    </Switch>
                }
            </div>
        )
    } else {
        return <Redirect to='/' />
    }
}

export default Account;