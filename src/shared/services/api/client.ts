import axiosInstance from './axios';

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ApiListData<T> {
  data: T[];
  pagination: Pagination;
}

interface ApiResponse<T> {
  code: number;
  result: T;
}

interface ApiListResponse<T> {
  code: number;
  result: ApiListData<T>;
}

class ApiClient {
  // GET request for list
  async getList<T>(url: string, params?: object): Promise<ApiListData<T>> {
    const response = await axiosInstance.get<ApiListResponse<T>>(url, { params });
    return response.data.result;
  }

  // GET request for single item
  async get<T>(url: string, params?: object): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data.result;
  }

  // POST request
  async post<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data);
    return response.data.result;
  }

  // PUT request
  async put<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data.result;
  }

  // PATCH request
  async patch<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data.result;
  }

  // DELETE request
  async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url);
    return response.data.result;
  }

  // Upload file
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.result;
  }

  // Get full response (including code and message)
  async getFullResponse<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  // Post with full response
  async postFullResponse<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data);
    return response.data;
  }
}

export const apiClient = new ApiClient(); 