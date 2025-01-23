import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
// import { AllRides } from './components/AllRides'

import {AllBookings} from './components/AllBookings'
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
                
            </Route>
        </Routes>
    )
}

export default RidesPage
