export interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    otp: number;
    expiresAt: string
  }
  
export interface Device {
    id: number;
    userId: number;
    deviceId: string;
    deviceType: string;
  }
  