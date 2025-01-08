import React, { FC, useEffect, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import { getIndustryList, getSegmentListByIndustry } from '../core/_requests';
import { IndustriesResponse, ReactSelectOption, SelectOption } from '../core/_models';
import { Dropdown1 } from '../../../../_metronic/partials';
import Select, { SingleValue } from 'react-select'
import { number } from 'yup';

const MerchantOnboardingStep2: FC = () => {
    // const [industryList, setIndustryList] = useState<IndustriesResponse | []>([]);
    const [industryOptions, setIndustryOptions] = useState<ReactSelectOption>();
    const [segmentOptions, setSegmentOptions] = useState<ReactSelectOption>();
    const [currentStepData, setCurrentStepData] = useState({
        industry: null,
        segment: null,
    });

    useEffect(() => {
        const fetchIndustryList = async () => {
            try {
                console.log('Fetching partners list...');

                const industryData = await getIndustryList();
                if (industryData.success == true) {
                    // const industryList = Array<SelectOption>

                    const industryList = industryData.data.map((industry) => ({
                        value: industry.id,
                        label: industry.name,
                    }));
                    setIndustryOptions(industryList);
                }
            } catch (error) {
                console.error('Error fetching partners list:', error);
            }
        };

        fetchIndustryList();

        return () => {
            // Perform any cleanup (if needed) when the component is unmounted
        };
    }, []); // Empty dependency array means this effect runs only once on mount


    const handleChange = (option: SingleValue<SelectOption | null>, actionMeta: { name: any; }) => {
        const { name } = actionMeta;
        if (name == 'industry' && option?.value != undefined) {
            getSegmentByIndustry(option?.value);
        }
        setCurrentStepData((prevState) => ({
            ...prevState,
            [name]: option,
        }));
        console.log(`Selected ${name} value:`, option ? option.value : null);
    };

    const getSegmentByIndustry = async (id: string | number) => {
        const segmentData = await getSegmentListByIndustry(id);

        if (segmentData.success == true) {
            const segmentList = segmentData.data.map((industry) => ({
                value: industry.id,
                label: industry.name,
            }));
            console.log(segmentList)
            setSegmentOptions(segmentList);
        }
    }
    return (
        <div className='w-100'>
            <div className='pb-10 pb-lg-12'>
                <h2 className='fw-bolder text-dark'>Industry & Segment</h2>

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
                <label className='form-label required'>Industry Type</label>

                <Select
                    className='form-select-solid react-select-styled react-select-solid react-select-sm'
                    classNamePrefix='react-select'
                    options={industryOptions}
                    placeholder='Select an Segment Type'
                    onChange={(option, actionMeta) => handleChange(option, { name: 'industry' })}
                    value={currentStepData.industry}
                    name='industry'
                />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessType' />
                </div>
            </div>
            <div className='fv-row mb-4'>
                <label className='form-label required'>Segment Type</label>

                <Select
                    className='form-select-solid react-select-styled react-select-solid react-select-sm'
                    classNamePrefix='react-select'
                    options={segmentOptions}
                    placeholder='Select an Segment Type'
                />
                <div className='text-danger mt-2'>
                    <ErrorMessage name='businessType' />
                </div>
            </div>
        </div>
    )
}

export { MerchantOnboardingStep2 }
