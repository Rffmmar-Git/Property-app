import axios from "axios";

export interface CreateReservationPayload {
  roomId: number;
  checkInDate: string; // Format: 'YYYY-MM-DD'
  checkOutDate: string; // Format: 'YYYY-MM-DD'
  guestCount: number;
}

export const reservationService = {
  async createReservation(payload: CreateReservationPayload) {
    const response = await axios.post("/reservations", payload);
    return response.data;
  },

  async getMyReservations() {
    const response = await axios.get("/reservations/my-reservations");
    return response.data;
  },

  async getReservationById(id: number) {
    const response = await axios.get(`/reservations/${id}`);
    return response.data;
  },

  async cancelReservation(id: number) {
    const response = await axios.patch(`/reservations/${id}/cancel`);
    return response.data;
  },
};