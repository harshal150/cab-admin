import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { IndustryList } from './components/IndustryList'

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

const IndustryPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='list'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Invoice</PageTitle> */}
                            <IndustryList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default IndustryPage