import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'

import { Route , Routes } from 'react-router-dom'

import { ThemeProvider , createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';

import { useAuth  } from './providers/AuthProvider'


const theme = createTheme({
  palette : {
    mode : 'dark',
    primary:{
      main:  '#C84B31',
      light:'#9e5b4c',
      dark: '#000814'
    },
    secondary : {
      main :'#55dde0',
    },
    topbar :{
      main:'#1b263b'
    } ,
 

  },
})

function App() {
  const {isPending} = useAuth()
  
  if(isPending) return

  
  return (
    <ThemeProvider theme={theme}> 

      <CssBaseline enableColorScheme/>
      
          <Routes>
            <Route path='/login' element={<Login/>}></Route>  
            <Route path='/signup' element={<Signup/>}></Route>  
            <Route path='/' element={<Dashboard />}></Route>  
          </Routes>
       

    </ThemeProvider> 
  )



}

export default App
