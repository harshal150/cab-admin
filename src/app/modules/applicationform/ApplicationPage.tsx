import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { ApplicationList } from './components/ApplicationList'
import { Demo } from './components/Demo'

const invoicesBreadCrumbs: Array<PageLink> = [
    {
        title: 'Invoices',
        path: '/invoices',
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

const ApplicationPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='application'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <ApplicationList />
                            {/* <Demo/> */}
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default ApplicationPage
