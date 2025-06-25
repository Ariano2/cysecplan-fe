import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './components/AdminDashboard';
import ParticipantDashboard from './components/ParticipantDashboard';
import JoinWorkshop from './components/JoinWorkshop.jsx';
import CreateWorkshop from './components/CreateWorkshop.jsx';
import ManageTravel from './components/ManageTravel.jsx';
import ManageProducts from './components/ManageProducts.jsx';
import ManageArticles from './components/ManageArticles.jsx';
import UpdateWorkshop from './components/UpdateWorkshop.jsx';
import About from './components/About.jsx';
import PendingRequest from './components/PendingRequest.jsx';
import ViewArticle from './components/ViewArticle.jsx';
import Cart from './components/Cart.jsx';
import Contact from './components/Contact.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/participant"
          element={
            <ProtectedRoute
              element={<ParticipantDashboard />}
              allowedRoles={['participant']}
            />
          }
        />
        <Route
          path="/article/:id"
          element={
            <ProtectedRoute
              element={<ViewArticle />}
              allowedRoles={['participant']}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute element={<Cart />} allowedRoles={['participant']} />
          }
        />
        <Route
          path="/join/workshop/:id"
          element={
            <ProtectedRoute
              element={<JoinWorkshop />}
              allowedRoles={['participant', 'admin']}
            />
          }
        />
        <Route
          path="/create/workshop"
          element={
            <ProtectedRoute
              element={<CreateWorkshop />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/manage/workshops"
          element={
            <ProtectedRoute
              element={<ManageTravel />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/manage/products"
          element={
            <ProtectedRoute
              element={<ManageProducts />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/manage/articles"
          element={
            <ProtectedRoute
              element={<ManageArticles />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/workshop/edit/:workshopId"
          element={
            <ProtectedRoute
              element={<UpdateWorkshop />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/workshop/pending/:workshopId"
          element={
            <ProtectedRoute
              element={<PendingRequest />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
