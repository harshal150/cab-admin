/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { StepperComponent } from '../../../../_metronic/assets/ts/components'
import { ICreateAppData, defaultCreateAppData } from '../../../../_metronic/partials/modals/create-app-stepper/IAppModels'
import { KTSVG } from '../../../../_metronic/helpers'
import { Step1 } from '../../wizards/components/steps/Step1'
import { Step2 } from '../../wizards/components/steps/Step2'
import { Step3 } from '../../wizards/components/steps/Step3'
import { Step4 } from '../../wizards/components/steps/Step4'
import { Step5 } from '../../wizards/components/steps/Step5'
import { ErrorMessage, Field } from 'formik'
import Select, { SingleValue } from 'react-select'
import { getIndustryList } from '../../merchant/core/_requests'
import { ReactSelectOption, SelectOption } from '../../merchant/core/_models'
type Props = {
    show: boolean
    handleClose: () => void
}


const modalsRoot = document.getElementById('root-modals') || document.body

const CreateAppModal = ({ show, handleClose }: Props) => {
    const stepperRef = useRef<HTMLDivElement | null>(null)
    const stepper = useRef<StepperComponent | null>(null)
    const [data, setData] = useState<ICreateAppData>(defaultCreateAppData)
    const [hasError, setHasError] = useState(false)

    const loadStepper = () => {
        stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    }

    const updateData = (fieldsToUpdate: Partial<ICreateAppData>) => {
        const updatedData = { ...data, ...fieldsToUpdate }
        setData(updatedData)
    }

    const checkAppBasic = (): boolean => {
        if (!data.appBasic.appName || !data.appBasic.appType) {
            return false
        }
        return true
    }

    const checkAppDataBase = (): boolean => {
        if (!data.appDatabase.databaseName || !data.appDatabase.databaseSolution) {
            return false
        }

        return true
    }

    const prevStep = () => {
        if (!stepper.current) {
            return
        }

        stepper.current.goPrev()
    }

    const nextStep = () => {
        setHasError(false)
        if (!stepper.current) {
            return
        }

        if (stepper.current.getCurrentStepIndex() === 1) {
            if (!checkAppBasic()) {
                setHasError(true)
                return
            }
        }

        if (stepper.current.getCurrentStepIndex() === 3) {
            if (!checkAppDataBase()) {
                setHasError(true)
                return
            }
        }

        stepper.current.goNext()
    }

    const submit = () => {
        window.location.reload()
    }

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
        // if (name == 'industry' && option?.value != undefined) {
        //     getSegmentByIndustry(option?.value);
        // }
        setCurrentStepData((prevState) => ({
            ...prevState,
            [name]: option,
        }));
        console.log(`Selected ${name} value:`, option ? option.value : null);
    };

    return createPortal(
        <Modal
            id='kt_modal_create_app'
            tabIndex={-1}
            aria-hidden='true'
            dialogClassName='modal-dialog modal-dialog-centered mw-900px'
            show={show}
            onHide={handleClose}
            onEntered={loadStepper}
            backdrop={true}
        >
            <div className='modal-header'>
                <h2>Create Plan</h2>
                {/* begin::Close */}
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={handleClose}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
                {/* end::Close */}
            </div>

            <div className='modal-body py-lg-10 px-lg-10'>
                {/*begin::Stepper */}
                <div
                    ref={stepperRef}
                    className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
                    id='kt_modal_create_app_stepper'
                >
                    {/* begin::Aside*/}
                    {/* w-100 w-xl-300px */}
                    <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-xl-400px'>
                        {/* begin::Nav*/}
                        <div className='stepper-nav ps-lg-10 w-100 '>
                            <div className='fv-row mb-4 w-100 '>
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
                                {/* <div className='text-danger mt-2'>
                                    <ErrorMessage name='businessType' />
                                </div> */}
                            </div>
                            <div className='fv-row mb-4  w-100'>
                                <label className='form-label required'>Segment  Name</label>

                                <input type='text' name='merchantName' className='form-control form-control-lg form-control-solid' />
                                {/* <div className='text-danger mt-2'>
                                    <ErrorMessage name='merchantName' />
                                </div> */}
                            </div>
                            <div className='fv-row mb-4  w-100 '>
                                <label className='form-label required'>Segment  Description</label>

                                <input type='text' name='merchantName' className='form-control form-control-lg form-control-solid' />
                                {/* <div className='text-danger mt-2'>
                                    <ErrorMessage name='merchantName' />
                                </div> */}
                            </div>
                            <div className='text-center'>
                                <button type="button" className='btn btn-primary'>Create</button>
                            </div>
                        </div>
                        {/* end::Nav*/}
                    </div>
                    {/* begin::Aside*/}

                </div>
                {/* end::Stepper */}
            </div>
        </Modal>,
        modalsRoot
    )
}

export { CreateAppModal }
