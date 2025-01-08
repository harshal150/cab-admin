export interface Industry {
    id: number;
    name: string;
    description: string;
    isActive: string;
  }
  

  export interface Invoice {
    srNo: number;
    invoiceNo: string;
    email: string
    payerName: string;
    mobileNo: string;
    balance: string;
    registrationNo: string;
    dateCreated: string;
    dueDate: string;
    invoiceAmount: string;
    amountPaid: string;
    status: string;
    paymentType: string;
  }
  