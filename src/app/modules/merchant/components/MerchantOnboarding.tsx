import { useEffect, useRef, useState } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import { StepperComponent } from '../../../../_metronic/assets/ts/components'
import { Formik, Form, FormikValues } from 'formik'
import { ICreateAccount, createAccountSchemas, inits } from '../../wizards/components/CreateAccountWizardHelper'
import { MerchantOnboardingStep1 } from '../steps/MerchantOnboardingStep1'
import { MerchantOnboardingStep2 } from '../steps/MerchantOnboardingStep2'
import { MerchantOnboardingStep3 } from '../steps/MerchantOnboardingStep3'
import { MerchantOnboardingStep5 } from '../steps/MerchantOnboardingStep5'
import { MerchantOnboardingStep4 } from '../steps/MerchantOnboardingStep4'
import { MerchantOnboardingStep6 } from '../steps/MerchantOnboardingStep6'

const MerchantOnboarding = () => {
    const stepperRef = useRef<HTMLDivElement | null>(null)
    const stepper = useRef<StepperComponent | null>(null)
    const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
    const [initValues] = useState<ICreateAccount>(inits)

    const loadStepper = () => {
        stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    }

    const prevStep = () => {
        if (!stepper.current) {
            return
        }

        stepper.current.goPrev()

        setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1])
    }

    const submitStep = (values: ICreateAccount, actions: FormikValues) => {

        if (!stepper.current) {
            return
        }
        setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex])

        if (stepper.current.currentStepIndex !== stepper.current.totatStepsNumber) {
            stepper.current.goNext()
        } else {
            stepper.current.goto(1)
            actions.resetForm()
        }
    }

    useEffect(() => {
        if (!stepperRef.current) {
            return
        }

        loadStepper()
    }, [stepperRef])

    return (
        <div
            ref={stepperRef}
            className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
            id='kt_create_account_stepper'
        >
            {/* begin::Aside*/}
            <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
                {/* begin::Wrapper*/}
                <div className='card-body px-2 px-lg-10 px-xxl-15'>
                    {/* py-10 */}
                    {/* begin::Nav*/}
                    <div className='stepper-nav'>
                        {/* begin::Step 1*/}
                        <div className='stepper-item current' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>1</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Partners</h3>

                                    <div className='stepper-desc fw-semibold'>Select Partner</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}

                            {/* begin::Line*/}
                            <div className='stepper-line h-20px'></div>
                            {/* end::Line*/}
                        </div>
                        {/* end::Step 1*/}

                        {/* begin::Step 2*/}
                        <div className='stepper-item' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>2</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Industry & Segment</h3>
                                    <div className='stepper-desc fw-semibold'>Select Segment with Industry</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}

                            {/* begin::Line*/}
                            <div className='stepper-line h-20px'></div>
                            {/* end::Line*/}
                        </div>
                        {/* end::Step 2*/}

                        {/* begin::Step 3*/}
                        <div className='stepper-item' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>3</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Merchant Details</h3>
                                    <div className='stepper-desc fw-semibold'>Merchant Business Related Info</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}

                            {/* begin::Line*/}
                            <div className='stepper-line h-20px'></div>
                            {/* end::Line*/}
                        </div>
                        {/* end::Step 3*/}

                        {/* begin::Step 4*/}
                        <div className='stepper-item' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>4</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Select Plan</h3>
                                    <div className='stepper-desc fw-semibold'>Get Subscription with Plans</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}

                            {/* begin::Line*/}
                            <div className='stepper-line h-20px'></div>
                            {/* end::Line*/}
                        </div>
                        {/* end::Step 4*/}


                        {/* begin::Step 5*/}
                        <div className='stepper-item' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>5</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Payment Gateway</h3>
                                    <div className='stepper-desc fw-semibold'>Set Rates for Payment Methods</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}

                            {/* begin::Line*/}
                            <div className='stepper-line h-20px'></div>
                            {/* end::Line*/}
                        </div>
                        {/* end::Step 5*/}



                        {/* begin::Step 6*/}
                        <div className='stepper-item' data-kt-stepper-element='nav'>
                            {/* begin::Wrapper*/}
                            <div className='stepper-wrapper'>
                                {/* begin::Icon*/}
                                <div className='stepper-icon w-40px h-40px'>
                                    <i className='stepper-check fas fa-check'></i>
                                    <span className='stepper-number'>6</span>
                                </div>
                                {/* end::Icon*/}

                                {/* begin::Label*/}
                                <div className='stepper-label'>
                                    <h3 className='stepper-title'>Final Review</h3>
                                    <div className='stepper-desc fw-semibold'>Woah, we are here</div>
                                </div>
                                {/* end::Label*/}
                            </div>
                            {/* end::Wrapper*/}
                        </div>
                        {/* end::Step 6*/}

                    </div>
                    {/* end::Nav*/}
                </div>
                {/* end::Wrapper*/}
            </div>
            {/* begin::Aside*/}

            <div className='d-flex flex-row-fluid flex-center bg-body rounded' style={{padding:"10px 0"}}>
                <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={submitStep}>
                    {() => (
                        <Form className='w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
                            <div className='current' data-kt-stepper-element='content'>
                                <MerchantOnboardingStep1 />
                            </div>

                            <div data-kt-stepper-element='content'>
                                <MerchantOnboardingStep2 />
                            </div>

                            <div data-kt-stepper-element='content'>
                                <MerchantOnboardingStep3 />
                            </div>

                            <div data-kt-stepper-element='content'>
                                <MerchantOnboardingStep4 />
                            </div>

                            {/* <div data-kt-stepper-element='content'>
                    <div style={{ height: '400px', overflowY: 'auto' }}>
                        <MerchantOnboardingStep4 />
                    </div>
                </div> */}

                            <div data-kt-stepper-element='content'>
                                <MerchantOnboardingStep5 />
                            </div>
                            
                            <div data-kt-stepper-element='content'>
                                <MerchantOnboardingStep6 />
                            </div>

                            <div className='d-flex flex-stack pt-3'>
                                <div className='mr-2'>
                                    <button
                                        onClick={prevStep}
                                        type='button'
                                        className='btn btn-lg btn-light-primary me-3'
                                        data-kt-stepper-action='previous'
                                    >
                                        <KTSVG
                                            path='/media/icons/duotune/arrows/arr063.svg'
                                            className='svg-icon-4 me-1'
                                        />
                                        Back
                                    </button>
                                </div>

                                <div>
                                    <button type='submit' className='btn btn-lg btn-primary me-3'>
                                        <span className='indicator-label'>
                                            {stepper.current?.currentStepIndex !==
                                                stepper.current?.totatStepsNumber! - 1 && 'Continue'}
                                            {stepper.current?.currentStepIndex ===
                                                stepper.current?.totatStepsNumber! - 1 && 'Submit'}
                                            <KTSVG
                                                path='/media/icons/duotune/arrows/arr064.svg'
                                                className='svg-icon-3 ms-2 me-0'
                                            />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export { MerchantOnboarding }
