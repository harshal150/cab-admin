import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
// import { AllRides } from './components/AllRides'
import { NotStartedRides } from './components/NotStartedRides'
import {AllBookings} from './components/AllBookings'
import { StartedRides } from './components/StartedRides'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'allbookings',
        path: '/allbookings',
        isSeparator: false,
        isActive: false,
    },
    {
        title: '',
        path: '',
        isSeparator: true,
        isActive: false,
    },
]

const RidesPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='allbookings'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <AllBookings />
                        </>
                    }
                />
                <Route
                    path='notstarted'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <NotStartedRides />
                        </>
                    }
                />
                <Route
                    path='started'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <StartedRides />
                        </>
                    }
                />
                
            </Route>
        </Routes>
    )
}

export default RidesPage
