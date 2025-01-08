import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { MerchantOnboarding } from './components/MerchantOnboarding'

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

const MerchantPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='onboard/new'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <MerchantOnboarding />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default MerchantPage