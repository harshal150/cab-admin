import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import {CompletedRides} from './components/CompletedRides'
import { CurrentRides } from './components/CurrentRides'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'completedrides',
        path: '/completedrides',
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
                    path='completedrides'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <CompletedRides />
                        </>
                    }
                />
                 <Route
                    path='currentrides'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <CurrentRides />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default RidesPage
