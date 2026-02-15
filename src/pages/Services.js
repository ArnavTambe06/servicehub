import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { doc, collection, query, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseInit'
import Categories from '../components/Categories'
import ServiceCard from '../components/ServiceCard'
import Loading from '../components/Loading'

const Services = () => {

  const { currentUser, isProvider } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [cleaningServices, setCleaningServices] = useState([])
  const [electricianServices, setElectricianServices] = useState([])
  const [plumberServices, setPlumberServices] = useState([])
  const [carpenterServices, setCarpenterServices] = useState([])
  const [pestControlServices, setPestControlServices] = useState([])
  const [womenSalonServices, setWomenSalonServices] = useState([])
  const [menSalonServices, setMenSalonServices] = useState([])
  const [miscellaniousServices, setMiscellaniousServices] = useState([])
  const [userData, setUserData] = useState({
    userDataFirstName: '',
    userDataLastName: '',
    userDataEmail: '',
    userDataCart: []
  })

  useEffect(() => {
    readServices().then(readUserData())
    // eslint-disable-next-line
  }, [])

  const readServices = async () => {
    setLoading(true)
    const q = query(collection(db, 'providers'))
    const docSnap = await getDocs(q)
    var readData = []
    var allServices = []
    var i = 0
    if (docSnap) {
      docSnap.forEach((doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
        readData[i] = doc.data()
        // Also attach provider id from each document
        readData[i].providerId = doc.id
        i++
      })
      // Replace previous flatten logic with:
      const servicesArray = [].concat(...readData.map(provider =>
        (provider.providerServices || []).map(service => ({
          ...service,
          providerId: provider.providerId || provider.uid || provider.id  // assign provider id
        }))
      ));
      allServices = servicesArray;
      setCleaningServices(allServices.filter(eachService => eachService.serviceCategory === 'Cleaning'))
      setElectricianServices(allServices.filter(eachService => eachService.serviceCategory === 'Electricians'))
      setPlumberServices(allServices.filter(eachService => eachService.serviceCategory === 'Plumbers'))
      setCarpenterServices(allServices.filter(eachService => eachService.serviceCategory === 'Carpenters'))
      setPestControlServices(allServices.filter(eachService => eachService.serviceCategory === 'Pest Control'))
      setWomenSalonServices(allServices.filter(eachService => eachService.serviceCategory === 'Salon for Women'))
      setMenSalonServices(allServices.filter(eachService => eachService.serviceCategory === 'Salon for Men'))
      setMiscellaniousServices(allServices.filter(eachService => eachService.serviceCategory === 'Miscellanious'))
    } else {
      console.log('not found')
    }
    setLoading(false)
  }

  const readUserData = async () => {
    if (currentUser != null) {
      var docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.exists()) {
        console.log(`Fetched user data:`, docSnap.data())
        setUserData({
          ...userData,
          userDataFirstName: docSnap.data().userFirstName,
          userDataLastName: docSnap.data().userLastName,
          userDataEmail: docSnap.data().userEmail,
          userDataCart: docSnap.data().userCart
        })
      } else {
        console.log(`Not signed in by user.`)
      }
    }
  }

  const onAddToCart = async (passedCategory, passedIndex) => {
    setLoading(true)
    if (currentUser != null) {
      var whichServices = null
      console.log(`Adding ${passedCategory} ${passedIndex} to cart.`)
      // <MenuItem value={'Plumbers'}>Plumbers</MenuItem>
      // <MenuItem value={'Carpenters'}>Carpenters</MenuItem>
      // <MenuItem value={'Pest Control'}>Pest Control</MenuItem>
      // <MenuItem value={'Salon for Women'}>Salon for Women</MenuItem>
      // <MenuItem value={'Salon for Men'}>Salon for Men</MenuItem>
      // <MenuItem value={'Massage'}>Massage</MenuItem>
      // <MenuItem value={'Miscellanious'}>Miscellanious</MenuItem>
      if (passedCategory === 'Cleaning') {
        whichServices = cleaningServices
      } else if (passedCategory === 'Electricians') {
        whichServices = electricianServices
      } else if (passedCategory === 'Plumbers') {
        whichServices = plumberServices
      } else if (passedCategory === 'Carpenters') {
        whichServices = carpenterServices
      } else if (passedCategory === 'Pest Control') {
        whichServices = pestControlServices
      } else if (passedCategory === 'Salon for Women') {
        whichServices = womenSalonServices
      } else if (passedCategory === 'Salon for Men') {
        whichServices = menSalonServices
      } else if (passedCategory === 'Miscellanious') {
        whichServices = miscellaniousServices
      } else {
        console.log(`passedCategory: ${passedCategory} doesnt match.`)
      }
      const addedService = whichServices[passedIndex]
      const finalCart = [...userData.userDataCart, addedService]
      setUserData(userData => ({
        ...userData,
        userDataCart: finalCart
      }))
      await updateDoc(doc(db, 'users', currentUser.uid), {
        userCart: finalCart
      }).catch((error) => {
        console.log(`in services/addToCart/fireStore_upDoc: Error Code ${error.code}: ${error.message}`)
        setLoading(false)
        return
      })
      alert(`Added ${addedService.serviceTitle} by ${addedService.serviceProvider} to cart.`)
    } else {
      alert(`Please Login or Signup first.`)
    }
    setLoading(false)
  }

  // New helper to combine all services into one array
  const getAllServices = () => {
    return [
      ...cleaningServices,
      ...electricianServices,
      ...plumberServices,
      ...carpenterServices,
      ...pestControlServices,
      ...womenSalonServices,
      ...menSalonServices,
      ...miscellaniousServices
    ]
  }

  return (
    <>
      <div className='eightyperc-container'>
        <div className='card-type1'>
          <div className='ninetyfiveperc-container'>
            <h2 className='heading-type3'>Services</h2>
            <p>Choose from the best services at the lowest prices:</p>
          </div>
        </div>
        <Categories />
      </div>
      {/* Removed extra category cards - now only rendering image button from ServiceCard */}
      <div className='eightyperc-container'>
        <div className='grid'>
          {loading ? (
            <Loading />
          ) : (
            <>
              {getAllServices().length !== 0 ? (
                getAllServices().map((eachService, serviceIndex) => (
                  <ServiceCard
                    key={serviceIndex}
                    passedService={eachService}
                    passedIndex={serviceIndex}
                    showButton={!isProvider}
                    onAddToCart={onAddToCart}
                  />
                ))
              ) : (
                <div className='flex-row'>
                  <p className='para-type2'>Choose Any Services You Like!!!!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Services
