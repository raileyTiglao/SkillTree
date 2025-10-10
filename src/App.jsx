import React from 'react';
   import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
   import { AuthProvider } from './context/AuthContext';
   import ProtectedRoute from './components/common/ProtectedRoute';
   import Landing from './pages/Landing';
   import Login from './pages/Login';
   import Signup from './pages/Signup';
   import Dashboard from './pages/Dashboard';
   import VerifyEmail from './pages/VerifyEmail';
   import AdminSetup from './pages/AdminSetup';
   
   function App() {
     return (
       <Router>
         <AuthProvider>
           <div className="App">
             <Routes>
               <Route path="/" element={<Landing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route 
                 path="/dashboard" 
                 element={
                   <ProtectedRoute>
                     <Dashboard />
                   </ProtectedRoute>
                 } 
               />
               <Route path="/admin-setup" element={<AdminSetup />} />
               <Route path="/verify-email" element={<VerifyEmail />} />
             </Routes>
           </div>
         </AuthProvider>
       </Router>
     );
   }

   export default App;