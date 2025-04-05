import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  Navigate,
  Outlet,
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CustomerDashboard from '../pages/CustomerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import PizzaList from '../components/customer/PizzaList';
import PizzaDetail from '../components/customer/PizzaDetail';
import Cart from '../components/customer/Cart';
import OrderHistory from '../components/customer/OrderHistory';
import OrderDetails from '../components/customer/OrderDetails';
import OrderManagement from '../components/admin/OrderManagement';
import PizzaManagement from '../components/admin/PizzaManagement';
import IngredientManagement from '../components/admin/IngredientManagement';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import VerifyEmail from '../components/auth/VerifyEmail';
import Profile from '../components/profile/Profile';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPizzaForm from '../components/admin/AddPizzaForm';
import AddIngredientForm from '../components/admin/AddIngredientForm';
import NotFoundPage from '../pages/NotFoundPage';

// Wrapper to extract token from search params for ResetPassword page
const ResetPasswordWrapper = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  return <ResetPassword token={token} />;
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <AppContainer>
              <Header />
              <ContentWrapper>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPasswordWrapper />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />

                  {/* Protected Customer Routes */}
                  <Route path="/customer/*" element={<PrivateRoute />}>
                    {/* Using index route as default when at "/customer" */}
                    <Route index element={<PageContent><CustomerDashboard /></PageContent>} />
                    <Route path="pizzas" element={<PageContent><PizzaList /></PageContent>} />
                    <Route path="pizza/:id" element={<PageContent><PizzaDetail /></PageContent>} />
                    <Route path="cart" element={<PageContent><Cart /></PageContent>} />
                    <Route path="orders" element={<PageContent><OrderHistory /></PageContent>} />
                    <Route path="orders/:id" element={<PageContent><OrderDetails /></PageContent>} />
                    <Route path="profile" element={<PageContent><Profile /></PageContent>} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route path="/admin/*" element={<AdminRoute />}>
                    <Route index element={<PageWithSidebar><AdminDashboard /></PageWithSidebar>} />
                    <Route path="pizzas" element={<PageWithSidebar><PizzaManagement /></PageWithSidebar>} />
                    <Route path="pizzas/new" element={<PageWithSidebar><AddPizzaForm /></PageWithSidebar>} />
                    <Route path="order" element={<PageContent><OrderHistory /></PageContent>} />
                    <Route path="orders" element={<PageWithSidebar><OrderManagement /></PageWithSidebar>} />
                    <Route path="ingredients" element={<PageWithSidebar><IngredientManagement /></PageWithSidebar>} />
                    <Route path="ingredients/new" element={<PageWithSidebar><AddIngredientForm /></PageWithSidebar>} />

                  </Route>

                  {/* 404 Handling */}
                  <Route path="/not-found" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </ContentWrapper>
              <Footer />
            </AppContainer>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

// Styled Components
const AppContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const ContentWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  maxWidth: '100%',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '80%',
    margin: '0 auto',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '70%',
  },
}));

const PageWithSidebar = styled(Box)({
  display: 'flex',
  flex: 1,
  width: '100%',
});

const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingLeft: 0,
  [theme.breakpoints.up('md')]: {
    paddingLeft: '256px',
  },
}));

export default AppRoutes;
