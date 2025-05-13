import { BloodBankReport } from '../types';

// Mock data for BloodBankReport (Blood Bank Report)
export const mockBloodBankReport: BloodBankReport = {
  bloodTypeStats: [
    {
      MaNhomMau: "A_POS",
      MoTaNhomMau: "A+",
      SoLuong: 120,
      PhanTram: 30.0
    },
    {
      MaNhomMau: "A_NEG",
      MoTaNhomMau: "A-",
      SoLuong: 25,
      PhanTram: 6.25
    },
    {
      MaNhomMau: "B_POS",
      MoTaNhomMau: "B+",
      SoLuong: 80,
      PhanTram: 20.0
    },
    {
      MaNhomMau: "B_NEG",
      MoTaNhomMau: "B-",
      SoLuong: 10,
      PhanTram: 2.5
    },
    {
      MaNhomMau: "O_POS",
      MoTaNhomMau: "O+",
      SoLuong: 150,
      PhanTram: 37.5
    },
    {
      MaNhomMau: "O_NEG",
      MoTaNhomMau: "O-",
      SoLuong: 30,
      PhanTram: 7.5
    },
    {
      MaNhomMau: "AB_POS",
      MoTaNhomMau: "AB+",
      SoLuong: 15,
      PhanTram: 3.75
    },
    {
      MaNhomMau: "AB_NEG",
      MoTaNhomMau: "AB-",
      SoLuong: 5,
      PhanTram: 1.25
    }
  ],
  donationStats: {
    tongSoDangKy: 500,
    soLuongThanhCong: 435,
    thongKeTheoThang: [
      {
        thang: "01/2024",
        soLuong: 40
      },
      {
        thang: "02/2024",
        soLuong: 35
      },
      {
        thang: "03/2024",
        soLuong: 50
      },
      {
        thang: "04/2024",
        soLuong: 60
      },
      {
        thang: "05/2024",
        soLuong: 45
      },
      {
        thang: "06/2024",
        soLuong: 70
      },
      {
        thang: "07/2024",
        soLuong: 55
      },
      {
        thang: "08/2024",
        soLuong: 30
      },
      {
        thang: "09/2024",
        soLuong: 25
      },
      {
        thang: "10/2024",
        soLuong: 15
      },
      {
        thang: "11/2024",
        soLuong: 5
      },
      {
        thang: "12/2024",
        soLuong: 5
      }
    ]
  },
  eventStats: {
    totalEvents: 25,
    upcomingEvents: 10,
    ongoingEvents: 5,
    completedEvents: 10
  }
}; 