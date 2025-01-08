/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      document.body.style.backgroundImage = `url(${toAbsoluteUrl('/media/auth/bg4.jpg')})`
      document.body.style.backgroundSize = `cover`
      document.body.style.backgroundRepeat = `no-repeat`
      document.body.style.backgroundPosition = `center`
      document.body.style.backgroundAttachment = `fixed`

      root.style.height = '100%'
    }
    
    return () => {
      if (root) {
        root.style.height = 'auto'
        document.body.style.backgroundImage = ''
        document.body.style.backgroundSize = ''
        document.body.style.backgroundRepeat = ''
        document.body.style.backgroundPosition = ''
        document.body.style.backgroundAttachment = ''
      }
    }
  }, [])


  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
      <div className='d-flex flex-column flex-column-fluid flex-lg-row'>
        <div className='d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10'>
          <div className='d-flex flex-center flex-lg-start flex-column'>
            <a href='#' className='mb-7'>
              <img alt='Logo' src={toAbsoluteUrl('/media/logos/pay_platter_dark.png')} height='80px' />
            </a>

            <h2 className='text-white fw-normal m-0'>Powered by Dexpert Systems</h2>
          </div>
        </div>

        <div className='justify-content-center justify-content-lg-end' style={{margin:'auto'}}>
          <div
            className='bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-400px pt-10 pb-10'
            style={{ height: 'min-content' }}
          >
            <div className='p-10'>
              <Outlet />
            </div>

            <div className='d-flex flex-stack px-lg-10'>
              <div className='me-0'>
                <button
                  className='btn btn-flex btn-link btn-color-gray-700 btn-active-color-primary rotate fs-base'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-start'
                  data-kt-menu-offset='0px, 0px'
                >
                  <img
                    data-kt-element='current-lang-flag'
                    className='w-20px h-20px rounded me-3'
                    src={toAbsoluteUrl('media/flags/india.svg')}
                    alt=''
                  />
                  <span data-kt-element='current-lang-name' className='me-1'>
                    English
                  </span>
                </button>
              </div>

              <div className='d-flex fw-semibold text-primary fs-base gap-5'>
                <a href='https://payplatter.in/' target='_blank'>
                  Terms
                </a>
                <a href='https://payplatter.in/' target='_blank'>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
