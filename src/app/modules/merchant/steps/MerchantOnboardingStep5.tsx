/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import { Field, ErrorMessage } from 'formik'

const MerchantOnboardingStep5: FC = () => {
    return (
        <div className='w-100'>
            <div className='pb-10 pb-lg-15'>
                <h2 className='fw-bolder d-flex align-items-center text-dark'>
                    Payment Gateway
                    <i
                        className='fas fa-exclamation-circle ms-2 fs-7'
                        data-bs-toggle='tooltip'
                        title='Billing is issued based on your selected account type'
                    ></i>
                </h2>

                <div className='text-gray-400 fw-bold fs-6'>
                    If you need more info, please check out
                    <a href='/dashboard' className='link-primary fw-bolder'>
                        {' '}
                        Help Page
                    </a>
                    .
                </div>
            </div>


            <div className='fv-row mb-4' style={{marginTop:"-20px"}}>
                <label className='form-label required'>Payment-Gateway Type</label>

                <Field
                    as='select'
                    name='businessType'
                    className='form-select form-select-lg form-select-solid'
                >
                    <option></option>
                    <option value='1'>Eazypay</option>
                    <option value='1'>Cashfee</option>
                    <option value='2'>EaseBuzz</option>
                    <option value='1'>PayU</option>
                    <option value='1'>CCavanue</option>
                    <option value='2'>RazorPay</option>
                </Field>
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessType' />
                </div>
            </div>

            
            <div className='fv-row mb-4'>
                <label className='form-label required'>Key/TID/ICID</label>

                <Field name='merchantContact' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantContact' />
                </div>
            </div>

            
            <div className='fv-row mb-4'>
                <label className='form-label required'>Secrete Key</label>

                <Field name='merchantContact' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantContact' />
                </div>
            </div>

            
            <div className='fv-row mb-4'>
                <label className='form-label required'>Secret Code</label>

                <Field name='merchantContact' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantContact' />
                </div>
            </div>
        </div>
    )
}

export { MerchantOnboardingStep5 }
