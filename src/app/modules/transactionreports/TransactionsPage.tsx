import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { AllTransactions } from './components/TransactionsList'

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

const TransactionsPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='transactions'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <AllTransactions />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default TransactionsPage
