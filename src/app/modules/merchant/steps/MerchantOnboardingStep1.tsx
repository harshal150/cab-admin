/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import { Field, ErrorMessage } from 'formik'
import { getPartnersList } from '../core/_requests';
import { PartnersResponse } from '../core/_models';

const MerchantOnboardingStep1: FC = () => {

    const [partnersList, setPartnersList] = useState<PartnersResponse | null>(null);


    useEffect(() => {
        const fetchPartnersList = async () => {
            try {
                console.log('Fetching partners list...');

                const partnersData = await getPartnersList();

                console.log(partnersData);
                setPartnersList(partnersData);
            } catch (error) {
                console.error('Error fetching partners list:', error);
            }
        };

        fetchPartnersList();

        return () => {
            // Perform any cleanup (if needed) when the component is unmounted
        };
    }, []); // Empty dependency array means this effect runs only once on mount

    // console.log(partnersList);
    return (
        <div className='w-100'>
            <div className='pb-10 pb-lg-15'>
                <h2 className='fw-bolder d-flex align-items-center text-dark'>
                    Select Partner
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

            <div className='fv-row'>
                <div className='row'>
                    {(partnersList?.success == true) ? <>

                        {partnersList.data.map((partner, partnerIndex) => {
                            return (
                                <div className='col-lg-2 col-md-2 col-sm-2' key={"partner"+ partnerIndex}>
                                    <Field
                                        type='radio'
                                        className='btn-check'
                                        name='accountType'
                                        value={partner.id}
                                        id='kt_create_account_form_account_type_personal'
                                    />
                                    <label
                                        className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10'
                                        htmlFor='kt_create_account_form_account_type_personal'
                                    >
                                        <img
                                            src={partner.logoLink}
                                            // src='/media/merchant-logo/HDFC.png'
                                            className='merchant-logo'
                                        />
                                    </label>
                                </div>)
                        })}
                    </> : <><p>No Partners</p></>}


                    {/* <div className='col-lg-2'>
                        <Field
                            type='radio'
                            className='btn-check'
                            name='accountType'
                            value='personal'
                            id='kt_create_account_form_account_type_personal1'
                        />
                        <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10'
                            htmlFor='kt_create_account_form_account_type_personal1'
                        >
                            <img
                                src='/media/merchant-logo/ICICI.jpeg'
                                className='merchant-logo'
                            // className='svg-icon-3x me-5'
                            />

                            <span className='d-block fw-bold text-start'>
                                <span className='text-dark fw-bolder d-block fs-4 mb-2'>ICICI Bank</span>
                                <span className='text-gray-400 fw-bold fs-6'>
                                    If you need more info, please check it out
                                </span>
                            </span>
                        </label>
                    </div> */}

                    <div className='text-danger mt-2'>
                        <ErrorMessage name='accountType' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { MerchantOnboardingStep1 }
