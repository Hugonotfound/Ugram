import React  from 'react';

import { injectStyle } from 'react-toastify/dist/inject-style';
import Register from './pages/Register';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Explore from './pages/Explore';
import OAuth from './pages/OAuth';
import Notifications from './pages/Notifications';

function App() {
    
    if (typeof window !== 'undefined') {
        injectStyle(); // Ajoute le style des toasts
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Feed />} />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/users' element={<Users />} />
                <Route path='/explore' element={<Explore />} />
                <Route path='/register' element={<Register />} />
                <Route path='/notifications/:id_person' element={<Notifications />} />
                <Route path='/auth/:id_person/:lastname_person/:forename_person/:username_person' element={<OAuth />} />
            </Routes>
            <ToastContainer theme='dark' />
        </>
    );
}

export default App;