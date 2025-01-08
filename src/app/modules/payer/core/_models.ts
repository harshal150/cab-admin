export interface Industry {
    id: number;
    name: string;
    description: string;
    isActive: string;
  }


  export interface Payer {
    srNo: number;          // Serial Number
    payerName: string;     // Name of the payer
    email: string;         // Email ID of the payer
    mobileNo: string;      // Contact number of the payer
    flatNo: string; // Flat No
    wing: string;   // Wing (A, B, etc.)
    dateCreated: string;

  }
  
  