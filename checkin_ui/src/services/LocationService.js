import http from '../http-common.js';
import { toast } from 'react-hot-toast';

const LocationService = {
  getAllLocations() {
    return http.get(`/location`);
  },

  createLocation(data) {
    return http.post(`/location/create`, data);
  },

  updateLocation(id, data) {
    return http.put(`/location/${id}`, data);
  },

  deleteLocation(id) {
    return http.delete(`/location/${id}`);
  },

  async getQr(locationId) {
    try {
      const response = await http.get(`/location/create-qr?locationId=${locationId}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          qrCode: response.data.qrCode,
          url: response.data.url,
        };
      } else {
        toast.error('Failed to generate QR code');
        return {
          success: false,
          error: response.data.message || 'Failed to generate QR code',
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to generate QR code. Please try again.';
      toast.error(errorMessage);
      return {
        success: false,
      };
    }
  },

  async verifyQr(uuid, token, userId, childId) {
    try {
      console.log('Sending QR verification request:', {
        uuid,
        token,
        userId,
        childId,
      });

      const response = await http.post(`/location/${uuid}/verify?token=${token}`, {
        userId,
        childId,
      });

      console.log('QR verification response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Check-in successful');
        return {
          success: true,
          data: response.data,
        };
      } else {
        toast.error('Check-in failed');
        return {
          success: false,
          error: response.data.message || 'Check-in failed',
        };
      }
    } catch (error) {
      console.error('QR verification error:', error.response || error);
      const errorMessage = error.response?.data?.message || '체크인 처리 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      return {
        success: false,
      };
    }
  },

  sendManagerInviteEmail(data) {
    return http.post('/location/manager-invite', data);
  },

  retrieveManagerEmail(token) {
    return http.get(`/location/retrieve-manager-email?token=${token}`);
  },
};

export default LocationService;
