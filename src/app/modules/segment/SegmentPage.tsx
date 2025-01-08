import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { SegmentList } from './components/SegmentList'

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

const SegmentPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='list'
                    element={
                        <>
                            <SegmentList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default SegmentPage