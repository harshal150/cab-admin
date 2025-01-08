export type PartnersResponse = Response<Array<Partner>>;
export type IndustriesResponse = Response<Array<Industry>>;
export type SegmentListByIndustryResponse = Response<Array<SegmentListByIndustry>>;
export type ReactSelectOption = Array<SelectOption>;

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Partner {
  id: number;
  isActive: string;
  name: string;
  code: string;
  emailId: string | null;
  contactNumber: string | null;
  websiteLink: string;
  logoLink: string;
  createdDate: Array<number>;
  updatedDate: Array<number>;
}

export interface Industry {
  id: number;
  isActive: string;
  name: string;
  descrition: string;
}
export interface SegmentListByIndustry {
  id: number,
  isActive: string,
  name: string,
  descrition: string,
  industryId: number

}
export interface SelectOption {
  value: string | number;
  label: string | number;
}
