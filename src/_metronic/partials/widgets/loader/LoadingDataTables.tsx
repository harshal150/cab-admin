import React, { FC } from 'react'

const LoadingDataTables: FC = () => {
    return (<>
        <div className="table-responsive">
            <table className="loading-table table align-middle table-row-dashed gy-3 gs-7 " id="kt_ecommerce_report_returns_table">
                <thead>
                    <tr className="fw-bold text-gray-400 bg-light-warning text-uppercase">
                        {/* <th className="min-w-100px ps-4  rounded-start">Date</th>
                    <th className="min-w-100px">Shipping Type</th>
                    <th className="min-w-100px">Shipping ID</th>
                    <th className="min-w-100px">Status</th>
                    <th className="text-end min-w-75px">No. Orders</th>
                    <th className="text-center rounded-end">Total</th> */}


                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                    <tr>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                        <td className="td"><div className="loader"></div></td>
                    </tr>
                </tbody>
            </table >
        </div>
    </>)
}

export default LoadingDataTables;