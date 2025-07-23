export interface HandyPartySheetData {
  region: string;
  tripType: string;
  targetTime: string;
  passengerPhoneNumber: string;
  address: string;
  partyId: string;
  vehicleNumber: string;
  driverPhoneNumber: string;
  count: number;
}

export interface VehicleAssignment {
  shuttleRouteId: string;
  shuttleName: string;
  partyId: string;
  vehicleName: string;
  vehicleNumber: string;
  driverPhoneNumber: string;
  region: string;
  tripType: string;
  shuttleBusId?: string;
}

export interface ReservationBusMap {
  reservationId: string;
  shuttleBusId: string | null;
}

export interface CreatedShuttleBusInfo {
  shuttleRouteId: string;
  shuttleBuses: {
    shuttleBusId: string;
    shuttleRouteId: string;
    busName: string;
  }[];
}
