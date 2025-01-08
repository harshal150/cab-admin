import axios from 'axios';
import { Industry } from './_models';


const INDUSTRY_API_URL = 'http://uat.api.payplatter.in:8082/superadmin/industry/list';



export const getIndustryList = async (accessToken: string): Promise<Industry[]> => {
  try {
    const response = await axios.get(INDUSTRY_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach the access token
        
      },
    });

    if (response.data && response.data.success) {
      return response.data.data; // Return industry data
    } else {
      throw new Error(response.data?.message || 'Failed to fetch industries');
    }
  } catch (error: any) {
    console.error('Error fetching industry list:', error);
    throw new Error(error.response?.data?.message || 'Error fetching industry list');
  }
};