import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { OutstandingList } from './components/OutStandingList'

const outstandingBreadCrumbs: Array<PageLink> = [
    {
        title: 'Outstanding',
        path: '/outstanding',
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

const OutstandingPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>
                <Route
                    path='list'
                    element={
                        <>
                            {/* <PageTitle breadcrumbs={outstandingBreadCrumbs}>Outstanding</PageTitle> */}
                            <OutstandingList />
                        </>
                    }
                />
            </Route>
        </Routes>
    )
}

export default OutstandingPage
