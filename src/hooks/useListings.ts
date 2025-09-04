import { useState, useEffect, useCallback } from 'react';
import type { ServiceListing } from '../types';
import { api } from '../lib/api';

interface UseListingsOptions {
  category?: string;
  autoFetch?: boolean;
}

export function useListings(options: UseListingsOptions = {}) {
  const { category, autoFetch = true } = options;
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async (selectedCategory?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getListings(selectedCategory || category);
      if (response.error) {
        setError(response.error);
      } else {
        setListings(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refreshListings = useCallback(() => {
    fetchListings();
  }, [fetchListings]);

  const createListing = useCallback(async (listingData: any, accessToken: string) => {
    const response = await api.createListing(listingData, accessToken);
    if (response.data) {
      setListings(prev => [response.data!, ...prev]);
    }
    return response;
  }, []);

  const updateListing = useCallback(async (id: string, listingData: any, accessToken: string) => {
    const response = await api.updateListing(id, listingData, accessToken);
    if (response.data) {
      setListings(prev => prev.map(listing => 
        listing.id === id ? response.data! : listing
      ));
    }
    return response;
  }, []);

  const deleteListing = useCallback(async (id: string, accessToken: string) => {
    const response = await api.deleteListing(id, accessToken);
    if (!response.error) {
      setListings(prev => prev.filter(listing => listing.id !== id));
    }
    return response;
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchListings();
    }
  }, [fetchListings, autoFetch]);

  return {
    listings,
    loading,
    error,
    fetchListings,
    refreshListings,
    createListing,
    updateListing,
    deleteListing,
  };
}