import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Classification Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all classifications', async () => {
    const mockClassifications = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-classification',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockClassifications,
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getClassifications()

    expect(result).toEqual(mockResponse)
  })

  it('should get classifications with name query', async () => {
    const mockResponse = {
      items: [],
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getClassifications({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/classification?name=test',
      expect.any(Object)
    )
  })

  it('should get a single classification', async () => {
    const mockClassification = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-classification'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockClassification
    })

    const result = await api.getClassification('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockClassification)
  })
})