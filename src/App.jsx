import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'

import { Navigate, Route , Routes } from 'react-router-dom'

import { ThemeProvider , createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';

import { useAuth  } from './providers/AuthProvider'
import UserProvider from './providers/UserProvider'

const theme = createTheme({
  palette : {
    mode : 'dark',
    primary:{
      main:  '#C84B31',
      light:'#caf0f8',
      dark: '#010811'
    },
    secondary : {
      main :'#55dde0',
    },
    topbar :{
      main:'#0d233a'
    } ,
 

  },
})

function App() {
  const {user , isPending} = useAuth()
  
  if(isPending) return

  
  return (
        <ThemeProvider theme={theme}> 
  
          <CssBaseline enableColorScheme/>
          <Routes>
            <Route path='/login' element={<Login/>}></Route>  
            <Route path='/signup' element={<Signup/>}></Route>  
            <Route path='/' element={
                user ? <UserProvider><Dashboard /></UserProvider> 
                     : <Navigate replace to='/login' />}
            >
            </Route>  
          </Routes>
          
        </ThemeProvider> 

  )



}

export default App
