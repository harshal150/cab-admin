import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { DriversList } from './components/Drivers'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'drivers',
        path: '/drivers',
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

const DriversPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='drivers'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <DriversList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default DriversPage
