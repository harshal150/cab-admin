import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { CabsList } from './components/Cabs'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'Cabs',
        path: '/cabs',
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

const CabsPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='cabs'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <CabsList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default CabsPage
