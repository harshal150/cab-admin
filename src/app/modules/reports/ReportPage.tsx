import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Tables } from '../widgets/components/Tables'
import { MISReports } from './components/MisReports'
const cabsBreadCrumbs: Array<PageLink> = [
    {
        title: 'reports',
        path: '/reports',
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

const ReportPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='reports'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={invoicesBreadCrumbs}>Tables</PageTitle> */}
                            <MISReports />
                        </>
                    }
                />
                
            </Route>
        </Routes>
    )
}

export default ReportPage
