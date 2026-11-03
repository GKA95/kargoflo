import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { RiderLayout } from './components/layout/RiderLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { TrackDeliveryPage } from './pages/public/TrackDeliveryPage';
import { ContactPage } from './pages/public/ContactPage';
import { ChoosePortalPage } from './pages/public/ChoosePortalPage';

// Legal Pages
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { PaymentPolicyPage } from './pages/legal/PaymentPolicyPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { CookiePolicyPage } from './pages/legal/CookiePolicyPage';

// Customer Portal Pages
import { CustomerLoginPage } from './pages/customer/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/customer/CustomerRegisterPage';
import { CustomerForgotPasswordPage } from './pages/customer/CustomerForgotPasswordPage';
import { CustomerResetPasswordPage } from './pages/customer/CustomerResetPasswordPage';
import { CustomerEmailVerifyPage } from './pages/customer/CustomerEmailVerifyPage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerBookDeliveryPage } from './pages/customer/CustomerBookDeliveryPage';
import { CustomerDeliveriesPage } from './pages/customer/CustomerDeliveriesPage';
import { CustomerDeliveryDetailPage } from './pages/customer/CustomerDeliveryDetailPage';
import { CustomerPaymentsPage } from './pages/customer/CustomerPaymentsPage';
import { CustomerRefundsPage } from './pages/customer/CustomerRefundsPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerSupportPage } from './pages/customer/CustomerSupportPage';

// Rider Portal Pages
import { RiderLoginPage } from './pages/rider/RiderLoginPage';
import { RiderRegisterPage } from './pages/rider/RiderRegisterPage';
import { RiderPendingApprovalPage } from './pages/rider/RiderPendingApprovalPage';
import { RiderDashboardPage } from './pages/rider/RiderDashboardPage';
import { RiderRequestsPage } from './pages/rider/RiderRequestsPage';
import { RiderDeliveriesPage } from './pages/rider/RiderDeliveriesPage';
import { RiderHistoryPage } from './pages/rider/RiderHistoryPage';
import { RiderEarningsPage } from './pages/rider/RiderEarningsPage';
import { RiderProfilePage } from './pages/rider/RiderProfilePage';
import { RiderSupportPage } from './pages/rider/RiderSupportPage';

// Administrator Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminRidersPage } from './pages/admin/AdminRidersPage';
import { AdminRiderApprovalsPage } from './pages/admin/AdminRiderApprovalsPage';
import { AdminDeliveriesPage } from './pages/admin/AdminDeliveriesPage';
import { AdminPricingPage } from './pages/admin/AdminPricingPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminRefundsPage } from './pages/admin/AdminRefundsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminPoliciesPage } from './pages/admin/AdminPoliciesPage';
import { AdminSecurityLogsPage } from './pages/admin/AdminSecurityLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Error Pages
import { NotFoundPage } from './pages/error/NotFoundPage';
import { UnauthorizedPage } from './pages/error/UnauthorizedPage';
import { ServerErrorPage } from './pages/error/ServerErrorPage';
import { SessionExpiredPage } from './pages/error/SessionExpiredPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/track" element={<TrackDeliveryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/choose-portal" element={<ChoosePortalPage />} />

            {/* Statutory & Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/payment-policy" element={<PaymentPolicyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />

            {/* Standalone Authentication Views */}
            <Route path="/customer/login" element={<CustomerLoginPage />} />
            <Route path="/customer/register" element={<CustomerRegisterPage />} />
            <Route path="/customer/forgot-password" element={<CustomerForgotPasswordPage />} />
            <Route path="/customer/reset-password" element={<CustomerResetPasswordPage />} />
            <Route path="/customer/verify-email" element={<CustomerEmailVerifyPage />} />

            <Route path="/rider/login" element={<RiderLoginPage />} />
            <Route path="/rider/register" element={<RiderRegisterPage />} />
            <Route path="/rider/pending-approval" element={<RiderPendingApprovalPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          {/* Customer Portal (Protected) */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboardPage />} />
            <Route path="book-delivery" element={<CustomerBookDeliveryPage />} />
            <Route path="deliveries" element={<CustomerDeliveriesPage />} />
            <Route path="deliveries/:id" element={<CustomerDeliveryDetailPage />} />
            <Route path="track" element={<TrackDeliveryPage />} />
            <Route path="payments" element={<CustomerPaymentsPage />} />
            <Route path="refunds" element={<CustomerRefundsPage />} />
            <Route path="notifications" element={<CustomerNotificationsPage />} />
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route path="support" element={<CustomerSupportPage />} />
          </Route>

          {/* Rider Portal (Protected) */}
          <Route
            path="/rider"
            element={
              <ProtectedRoute allowedRoles={['rider']}>
                <RiderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/rider/dashboard" replace />} />
            <Route path="dashboard" element={<RiderDashboardPage />} />
            <Route path="requests" element={<RiderRequestsPage />} />
            <Route path="deliveries" element={<RiderDeliveriesPage />} />
            <Route path="history" element={<RiderHistoryPage />} />
            <Route path="earnings" element={<RiderEarningsPage />} />
            <Route path="notifications" element={<CustomerNotificationsPage />} />
            <Route path="profile" element={<RiderProfilePage />} />
            <Route path="support" element={<RiderSupportPage />} />
          </Route>

          {/* Administrator Portal (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="riders" element={<AdminRidersPage />} />
            <Route path="rider-approvals" element={<AdminRiderApprovalsPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="refunds" element={<AdminRefundsPage />} />
            <Route path="complaints" element={<AdminComplaintsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="policies" element={<AdminPoliciesPage />} />
            <Route path="security-logs" element={<AdminSecurityLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Error and Session Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
