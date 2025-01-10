import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { AllRides } from './components/AllRides'
import { CurrentRides } from './components/CurrentRides'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'allrides',
        path: '/allrides',
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
                    path='allrides'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <AllRides />
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
