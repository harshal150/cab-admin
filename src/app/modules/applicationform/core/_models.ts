export interface Industry {
  id: number;
  name: string;
  description: string;
  isActive: string;
}


export interface Invoice {
  srNo: number;
  invoiceNo: string;
  payerName: string;
  registrationNo: string;
  dateCreated: string;
  dueDate: string;
  invoiceAmount: string;
  amountPaid: string;
  status: string;
  paymentType: string;
}
