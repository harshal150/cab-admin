import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { ExpectedSettlementsList } from './components/ExpectedList'

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

const ExpectedPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='settlements'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <ExpectedSettlementsList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default ExpectedPage
