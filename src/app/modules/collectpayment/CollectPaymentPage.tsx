import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { CollectPaymentList } from './components/CollectPaymentList'

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

const CollectPaymentPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='collection'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <CollectPaymentList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default CollectPaymentPage
