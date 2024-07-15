import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import {Outlet } from 'react-router-dom'
import authService from './appwrite/Auth'
import { login, logout } from './store/uthSlice'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer'

function App() {
  const [loading,setLoading] = useState(true)
  const disPatch = useDispatch()

  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData){
        disPatch(login({userData}))

      }else{
        disPatch(logout())
      } 
    })
    .finally(()=>{
      setLoading(false)
    })
  },[])
  return !loading ? 
  (<div className=' min-h-screen flex flex-wrap  justify-center  bg-gray-400'>
    <div className='   block'>
      <Header/>
      <main>
      <Outlet/>
      </main>
      <Footer/>
    </div>
  </div>)  :
   "loading please wait" ;
}

export default App
