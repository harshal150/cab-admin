import axios, { AxiosResponse } from 'axios'
import { IndustriesResponse, PartnersResponse, SegmentListByIndustry, SegmentListByIndustryResponse } from './_models'

const API_URL = 'http://api.merchant.payplatter.in'
// process.env.DEXPERT_MERCHANT_APP_API_URL

const GET_PARTNER_LIST = `${API_URL}/partner/list`
const GET_INDUSTRY_LIST = `${API_URL}/industry/list`
const GET_SEGMENT_LIST_BY_INDUSTRY = `${API_URL}/segment/listByIndustry/`

// const CONFIG =  {
//     headers: {
//       "Authorization": "Basic bWVyY2hhbnQ6bWVyY2hhbnQ=",
//     }
//   }
// const GET_USERS_URL = `${API_URL}/users/query`

const getPartnersList = (): Promise<PartnersResponse> => {
    // console.log(GET_PARTNER_LIST)
    return axios
        .get(`${GET_PARTNER_LIST}`,)
        .then((d: AxiosResponse<PartnersResponse>) => d.data)
}

const getIndustryList = (): Promise<IndustriesResponse> => {
    return axios
        .get(`${GET_INDUSTRY_LIST}`,)
        .then((d: AxiosResponse<IndustriesResponse>) => d.data)
}
const getSegmentListByIndustry = (ID: number | string): Promise<SegmentListByIndustryResponse> => {
    return axios
        .get(`${GET_SEGMENT_LIST_BY_INDUSTRY + ID}`,)
        .then((d: AxiosResponse<SegmentListByIndustryResponse>) => d.data)

}
export { getPartnersList, getIndustryList,getSegmentListByIndustry };