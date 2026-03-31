import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import SignUpForm from './components/SignUpForm/SignUpForm.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import AdminLoginForm from './components/AdminLoginForm/AdminLoginForm.jsx';
import AdminApp from './AdminApp.jsx';
import AdminHome from './pages/AdminHome/AdminHome.jsx';
import { Provider } from 'react-redux';
import { store } from './store.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import AdminProtectedRoute from './components/ProtectedRoute/AdminProtectedRoute.jsx';
import EditUser from './components/EditUser/EditUser.jsx';
import Profile from './components/Profile/Profile.jsx';


const router = createBrowserRouter(createRoutesFromElements(
  <>
  <Route path='/' element={<App/>}>
    <Route index={true} path='/' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
    <Route path='/login' element={<LoginForm/>}/>
    <Route path='/register' element={<SignUpForm/>}/>
    <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
  </Route>
  <Route path='/admin' element={<AdminApp/>}>
    <Route path='/admin/login' element={<AdminLoginForm/>}/>
    <Route index={true} path='/admin' element={<AdminProtectedRoute><AdminHome/></AdminProtectedRoute>}/>
    <Route path='/admin/editUser' element={<EditUser/>}/>
  </Route>
  </>
))


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  </Provider>
)
