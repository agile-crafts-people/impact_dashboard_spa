import type { 
  Dashboard,
  DashboardInput,
  DashboardUpdate,

  Post,
  PostInput,

  Comment,
  CommentInput,

  Classification,

  Profile,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getDashboards(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Dashboard>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Dashboard>>(`/dashboard${query ? `?${query}` : ''}`)
  },

  async getDashboard(dashboardId: string): Promise<Dashboard> {
    return request<Dashboard>(`/dashboard/${dashboardId}`)
  },

  async createDashboard(data: DashboardInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/dashboard', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateDashboard(dashboardId: string, data: DashboardUpdate): Promise<Dashboard> {
    return request<Dashboard>(`/dashboard/${dashboardId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints

  async getPosts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Post>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Post>>(`/post${query ? `?${query}` : ''}`)
  },

  async getPost(postId: string): Promise<Post> {
    return request<Post>(`/post/${postId}`)
  },

  async createPost(data: PostInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/post', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },


  async getComments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Comment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Comment>>(`/comment${query ? `?${query}` : ''}`)
  },

  async getComment(commentId: string): Promise<Comment> {
    return request<Comment>(`/comment/${commentId}`)
  },

  async createComment(data: CommentInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/comment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },



  // Consume endpoints

  async getClassifications(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Classification>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Classification>>(`/classification${query ? `?${query}` : ''}`)
  },

  async getClassification(classificationId: string): Promise<Classification> {
    return request<Classification>(`/classification/${classificationId}`)
  },


  async getProfiles(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Profile>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Profile>>(`/profile${query ? `?${query}` : ''}`)
  },

  async getProfile(profileId: string): Promise<Profile> {
    return request<Profile>(`/profile/${profileId}`)
  },


}

export { ApiError }
