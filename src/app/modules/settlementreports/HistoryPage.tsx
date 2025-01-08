import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import SettlementHistoryList from './components/HistoryList'

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
                    path='history'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <SettlementHistoryList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default ExpectedPage
