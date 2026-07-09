import { useEffect, useState } from 'react'
import './App.css'
import Logincard from './components/Logincard'
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import Homecard from './components/Homecard'
import Categorycard from './components/Categorycard'
import Productcard from './components/Productcard'
import Profilecard from './components/Profilecard'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './components/Auth'
import { ToastContainer } from 'react-toastify'
import NotFound from './components/NotFound'
import TitleManager from './components/TitleManager'
import Dashboard from './components/DashBoard'
import BannerCard from './components/BannerCard'
import UserMasterCard from './components/UserMasterCard'
import NotCreated from './components/NotCreated'


function App() {

    return (
        <>

            <ToastContainer
                position='top-right'
                autoClose={3000}
                pauseOnHover
                closeOnClick
                hideProgressBar={false}
                theme='colored'>


            </ToastContainer>

            <Router>
                <Header />
                <TitleManager />
                <Routes>

                    <Route path='/'
                        element={
                            <ProtectedRoute allowedRoles={["USER",""]}>
                                <Homecard />
                            </ProtectedRoute>
                        } />
                    <Route path="/auth/:mode" element={<Auth />} />
                    <Route path='/category' element={<Categorycard />} />
                    <Route path='/wishlist' element={<NotCreated />} />
                    <Route path='/orders' element={<NotCreated />} />
                    <Route path='/address' element={<NotCreated />} />
                    <Route path='/cart' element={<NotCreated />} />
                    <Route path='/admin/category' element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Categorycard />
                        </ProtectedRoute>
                    } />
                    <Route path='/product' element={<Productcard />} />
                    <Route path='/admin/product' element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Productcard />
                        </ProtectedRoute>
                    } />
                    <Route path='/admin/dashboard' element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='/admin/users' element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <UserMasterCard />
                        </ProtectedRoute>
                    } />
                    <Route
                        path="/admin/banner"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <BannerCard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <NotCreated />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/profile' element={<Profilecard />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>

        </>
    )
}

export default App
