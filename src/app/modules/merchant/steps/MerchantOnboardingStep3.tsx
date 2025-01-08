import React, { FC, useState } from 'react'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'; 

const MerchantOnboardingStep3: FC = () => {

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const { setFieldValue } = useFormikContext();

    const placeholderImage = toAbsoluteUrl('/media/avatars/blank.png');

    // Handler for logo upload preview
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setFieldValue('merchantLogo', file);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };
    
    return (

        <div className='w-100' >
            {/* style={{height:"300px",overflow:"auto"}} */}
            <div className='pb-10 pb-lg-12'>
                <h2 className='fw-bolder text-dark'>Merchant Details</h2>

                <div className='text-gray-400 fw-bold fs-6'>
                    If you need more info, please check out
                    <a href='/dashboard' className='link-primary fw-bolder'>
                        {' '}
                        Help Page
                    </a>
                    .
                </div>
            </div>

            <div className='fv-row mb-4'>
                <label className='form-label required'>Merchant  Name</label>

                <Field name='merchantName' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantName' />
                </div>
            </div>

             {/* New field for Merchant Logo */}
             <div className='fv-row mb-4 d-flex align-items-center'>
                <div className='flex-grow-1 me-4'>
                    <label className='form-label required'>Merchant Logo</label>
                    <input
                        name='merchantLogo'
                        className='form-control form-control-lg form-control-solid'
                        type='file'
                        accept='image/*'
                        onChange={handleLogoUpload}
                    />
                    <div className='form-text'>
                        Please upload the merchant logo (PNG, JPG, JPEG).
                    </div>
                    <div className='text-danger mt-2'>
                        <ErrorMessage name='merchantLogo' />
                    </div>
                </div>
                
                {/* Preview of the uploaded logo */}
                <div className='border p-3' style={{ width: '100px', height: '100px' }}>
                    <img
                        src={logoPreview || placeholderImage}
                        alt='Logo Preview'
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
            </div>


            <div className='fv-row mb-4'>
                <label className='fs-6 fw-bold form-label required'>Contact Email</label>

                <Field name='businessEmail' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessEmail' />
                </div>
            </div>

            <div className='fv-row mb-4'>
                <label className='form-label required'>Merchant  Contact</label>

                <Field name='merchantContact' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantContact' />
                </div>
            </div>

            {/* <div className='fv-row mb-4'>
                <label className='form-label required'>Alias</label>

                <Field name='merchantAlias' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantAlias' />
                </div>
            </div> */}

            {/* <div className='fv-row mb-4'>
                <label className='d-flex align-items-center form-label'>
                    <span className='required'>Shortened Descriptor</span>
                </label>

                <Field
                    name='businessDescriptor'
                    className='form-control form-control-lg form-control-solid'
                />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                </div>

                <div className='form-text'>
                    Customers will see this shortened version of your statement descriptor
                </div>
            </div> */}

            <div className='fv-row mb-4'>
                <label className='form-label required'>Merchant Type</label>

                <Field
                    as='select'
                    name='businessType'
                    className='form-select form-select-lg form-select-solid'
                >
                    <option></option>
                    <option value='1'>SOLO</option>
                    <option value='1'>PARENT</option>
                    <option value='2'>CHILD</option>
                </Field>
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessType' />
                </div>
            </div>

            {/* <div className='fv-row mb-4'>
                <label className='form-label'>Address</label>

                <Field
                    as='textarea'
                    name='businessDescription'
                    className='form-control form-control-lg form-control-solid'
                    rows={3}
                ></Field>
            </div>


            <div className='fv-row mb-4'>
                <label className='form-label required'>Pincode</label>

                <Field name='merchantPincode' className='form-control form-control-lg form-control-solid' />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='merchantPincode' />
                </div>
            </div> */}

            

        </div>
    )
}

export { MerchantOnboardingStep3 }
