import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import InvoicesPage from '../modules/invoices/InvoicesPage'
import MerchantPage from '../modules/merchant/MerchantPage'
import IndustryPage from '../modules/industry/IndustryPage'
import SegmentPage from '../modules/segment/SegmentPage'
import ServicePage from '../modules/service/ServicePage'
import PlanPage from '../modules/plan/PlanPage'
import AllInvoicesPage from '../modules/invoicesall/AllInvoicesPage'
import OutstandingPage from '../modules/outstanding/OutStandingPage'
import CollectPaymentPage from '../modules/collectpayment/CollectPaymentPage'
import ApplicationPage from '../modules/applicationform/ApplicationPage'
import TransactionsPage from '../modules/transactionreports/TransactionsPage'
import ExpectedPage from '../modules/settlementreports/ExpectedPage'
import HistoryPage from '../modules/settlementreports/HistoryPage'
import PayerPage from '../modules/payer/PayerPage'
import CabsPage from '../modules/cabs/CabsPage'
import DriversPage from '../modules/Drivers/DriversPage'
const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        <Route
          path='cabspage/*'
          element={
            <>
              {/* <SuspensedView> */}
              <CabsPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='driverspage/*'
          element={
            <>
              {/* <SuspensedView> */}
              <DriversPage />
              {/* </SuspensedView> */}
            </>
          }
        />



        {/* Pages */}
        <Route
          path='invoice/*'
          element={
            <>
              {/* <SuspensedView> */}
              <InvoicesPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='all-invoice/*'
          element={
            <>
              {/* <SuspensedView> */}
              <AllInvoicesPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='outstanding/*'
          element={
            <>
              {/* <SuspensedView> */}
              <OutstandingPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='payment/*'
          element={
            <>
              {/* <SuspensedView> */}
              <CollectPaymentPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='form/*'
          element={
            <>
              {/* <SuspensedView> */}
              <ApplicationPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='reports/*'
          element={
            <>
              {/* <SuspensedView> */}
              <TransactionsPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='expected/*'
          element={
            <>
              {/* <SuspensedView> */}
              <ExpectedPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='settlement/*'
          element={
            <>
              {/* <SuspensedView> */}
              <HistoryPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='payer/*'
          element={
            <>
              {/* <SuspensedView> */}
              <PayerPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='merchant/*'
          element={
            <>
              {/* <SuspensedView> */}
              <MerchantPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route
          path='industry/*'
          element={
            <>
              {/* <SuspensedView> */}
              <IndustryPage />
              {/* </SuspensedView> */}
            </>
          }
        />
        <Route path='segment/*' element={
          <>
            {/* <SuspensedView> */}
            <SegmentPage />
            {/* </SuspensedView> */}
          </>
        } />
        <Route path='service/*' element={
          <>
            {/* <SuspensedView> */}
            <ServicePage />
            {/* </SuspensedView> */}
          </>
        } />
        <Route path='plan/*' element={
          <>
            {/* <SuspensedView> */}
            <PlanPage />
            {/* </SuspensedView> */}
          </>
        } />
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
