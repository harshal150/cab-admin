import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { ServiceList } from './components/ServiceList'

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

const ServicePage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='list'
                    element={
                        <>
                            <ServiceList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default ServicePage