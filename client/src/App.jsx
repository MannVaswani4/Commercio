import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layouts/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import ProductScreen from './pages/ProductScreen';
import Home from './pages/Home';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderScreen from './pages/OrderScreen';
import OrderHistory from './pages/OrderHistory';
import Cart from './pages/Cart';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import UserList from './pages/admin/UserList';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductScreen />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="cart/:id" element={<Cart />} />
            <Route path="auth/callback" element={<AuthCallback />} />

            <Route path="" element={<PrivateRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="payment" element={<Payment />} />
              <Route path="placeorder" element={<PlaceOrder />} />
              <Route path="order/:id" element={<OrderScreen />} />
              <Route path="order-history" element={<OrderHistory />} />
            </Route>

            <Route path="admin" element={<AdminRoute />}>
              <Route path="userlist" element={<UserList />} />
              <Route path="productlist" element={<ProductList />} />
              <Route path="product/:id/edit" element={<ProductEdit />} />
              <Route path="orderlist" element={<OrderList />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
