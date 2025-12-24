"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { apiClient } from "../../lib/api";
import MessagingSystem from "../../components/MessagingSystem";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../hooks/useFavorites";
import daycaresLocalData from "../../data/daycares.json";
import SearchSummary from "./components/SearchSummary";
import RecentlyViewed from "./components/RecentlyViewed";
import FilterPanel from "./components/FilterPanel";
import SearchResults from "./components/SearchResults";
import ComparisonModal from "./components/ComparisonModal";
import ContactLogModal from "../../components/ContactLogModal";

interface Daycare {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: string | number;
  priceString?: string;
  rating: number;
  distance: number;
  features: string[];
  ageRange: string;
  availability: string;
  hours: string;
  subsidy: string;
  cwelcc: string;
  phone: string;
  email: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function SearchPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    favorites: apiFavorites,
    addFavorite: addFavoriteAPI,
    removeFavorite: removeFavoriteAPI,
    isAddingFavorite,
    isRemovingFavorite,
  } = useFavorites();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string[]>([]);
  const [selectedProgramAges, setSelectedProgramAges] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedWard, setSelectedWard] = useState("");
  const [cwelccParticipating, setCwelccParticipating] = useState(false);
  const [acceptsSubsidy, setAcceptsSubsidy] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(
    null
  ); // Track which favorite is loading
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPurchasedReport] = useState(false);
  
  // Results per page: 15 for logged-in users, 4 for guests
  const resultsPerPage = useMemo(() => {
    return user && !authLoading ? 15 : 4;
  }, [user, authLoading]);
  const [recentlyViewed, setRecentlyViewed] = useState<Daycare[]>([]);

  // Debounced search query
  const [debouncedSearchQuery] = useState("");

  // Messaging state
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Daycare | null>(
    null
  );

  // Contact Log Modal state
  const [showContactLogModal, setShowContactLogModal] = useState(false);

  // Filter section states - all collapsed by default
  const [expandedSections, setExpandedSections] = useState({
    sort: false,
    price: false,
    type: false,
    ageRange: false,
    availability: false,
  });

  // Read location from URL query parameter and auto-select region
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const locationParam = params.get("location");
      if (locationParam) {
        // Set the region filter to the location from URL
        setSelectedRegion(locationParam.trim());
      }
    }
  }, []); // Run only once on mount

  // Get favorite IDs from API (only for logged-in users)
  const favorites = useMemo(() => {
    if (user) {
      // For logged-in users, get favorite IDs from API
      return apiFavorites.map(
        (fav) => fav.daycareId || fav.daycare?._id || fav.daycare?.id || ""
      );
    } else {
      // For guest users, no favorites (they need to login)
      return [];
    }
  }, [user, apiFavorites]);

  // Re-read URL parameters when user logs in (in case they came from a redirect)
  useEffect(() => {
    if (user && !authLoading) {
    }
  }, [user, authLoading]);

  // Check if user has purchased the full report
  // DISABLED: Purchase check endpoint not available
  // useEffect(() => {
  //   const checkPurchaseStatus = async () => {
  //     if (!user || authLoading) {
  //       setCheckingPurchase(false);
  //       return;
  //     }

  //     try {
  //       // Cookies are sent automatically with axios
  //       const response = await apiClient.get('/api/payments/check-purchase');

  //       if (response.data.success) {
  //         setHasPurchasedReport(response.data.hasPurchased || false);
  //       }
  //     } catch (error) {
  //       console.error("Error checking purchase status:", error);
  //     } finally {
  //       setCheckingPurchase(false);
  //     }
  //   };

  //   checkPurchaseStatus();
  // }, [user, authLoading]);

  // Set checkingPurchase to false immediately since we're not checking
  useEffect(() => {
    // no-op: purchase check disabled
  }, [user, authLoading]);

  // Debounce search query
  // Removed: "Search by name or address" field no longer exists.

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchQuery,
    selectedRegion,
    selectedPriceRange,
    selectedTypes,
    selectedAgeRange,
    selectedProgramAges,
    selectedAvailability,
    selectedWard,
    cwelccParticipating,
    acceptsSubsidy,
    sortBy,
    sortOrder,
  ]);

  // Availability should be selectable only after Age Range is chosen.
  // Default to "No" once Age Range is selected.
  useEffect(() => {
    if (selectedAgeRange.length === 0) {
      // If user clears age range, also clear availability (and UI will disable it)
      if (selectedAvailability.length > 0) setSelectedAvailability([]);
      return;
    }

    // Age Range chosen: default availability to "No" if not set yet
    if (selectedAvailability.length === 0) {
      setSelectedAvailability(["no"]);
    }
  }, [selectedAgeRange, selectedAvailability, selectedProgramAges]);

  const escapeRegex = useCallback((value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, []);

  // Build query parameters for API (with pagination)
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: currentPage.toString(),
      limit: resultsPerPage.toString(),
    };

    if (debouncedSearchQuery) {
      params.q = debouncedSearchQuery;
    }

    if (selectedRegion) {
      params.region = selectedRegion;
    }

    // Price range
    if (selectedPriceRange) {
      if (selectedPriceRange === "low") {
        params.priceMax = "1200";
      } else if (selectedPriceRange === "medium") {
        params.priceMin = "1201";
        params.priceMax = "1800";
      } else if (selectedPriceRange === "high") {
        params.priceMin = "1801";
      }
    }

    // Type (multi-select) -> backend supports `daycareType` regex filtering.
    // We build a safe alternation regex so selecting multiple types works.
    if (selectedTypes.length > 0) {
      params.daycareType = selectedTypes.map(escapeRegex).join("|");
    }

    // Age range (array to comma-separated string)
    if (selectedAgeRange.length > 0) {
      params.ageRange = selectedAgeRange.join(",");
    }

    // Program age (sub-filter under Age Range)
    if (selectedProgramAges.length > 0) {
      params.programAge = selectedProgramAges.join(",");
    }

    // Availability (vacancy) cascade: only meaningful when ageRange is selected
    // and availability is "yes" or "no".
    if (selectedAgeRange.length > 0 && selectedAvailability.length > 0) {
      params.vacancy = selectedAvailability[0];
    }

    // Ward
    if (selectedWard) {
      params.ward = selectedWard;
    }

    // CWELCC
    if (cwelccParticipating) {
      params.cwelcc = "true";
    }

    // Subsidy
    if (acceptsSubsidy) {
      params.subsidy = "true";
    }

    return params;
  }, [
    currentPage,
    resultsPerPage,
    debouncedSearchQuery,
    selectedRegion,
    selectedPriceRange,
    selectedTypes,
    selectedAgeRange,
    selectedProgramAges,
    selectedAvailability,
    selectedWard,
    cwelccParticipating,
    acceptsSubsidy,
    escapeRegex,
  ]);

  // Build query parameters for map view (all results, no pagination)
  const mapQueryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: "1",
      limit: "1000", // Large limit to get all results
    };

    if (debouncedSearchQuery) {
      params.q = debouncedSearchQuery;
    }

    if (selectedRegion) {
      params.region = selectedRegion;
    }

    // Price range
    if (selectedPriceRange) {
      if (selectedPriceRange === "low") {
        params.priceMax = "1200";
      } else if (selectedPriceRange === "medium") {
        params.priceMin = "1201";
        params.priceMax = "1800";
      } else if (selectedPriceRange === "high") {
        params.priceMin = "1801";
      }
    }

    // Type (multi-select)
    if (selectedTypes.length > 0) {
      params.daycareType = selectedTypes.map(escapeRegex).join("|");
    }

    // Age range
    if (selectedAgeRange.length > 0) {
      params.ageRange = selectedAgeRange.join(",");
    }

    // Program age
    if (selectedProgramAges.length > 0) {
      params.programAge = selectedProgramAges.join(",");
    }

    // Availability
    if (selectedAgeRange.length > 0 && selectedAvailability.length > 0) {
      params.vacancy = selectedAvailability[0];
    }

    // Ward
    if (selectedWard) {
      params.ward = selectedWard;
    }

    // CWELCC
    if (cwelccParticipating) {
      params.cwelcc = "true";
    }

    // Subsidy
    if (acceptsSubsidy) {
      params.subsidy = "true";
    }

    return params;
  }, [
    debouncedSearchQuery,
    selectedRegion,
    selectedPriceRange,
    selectedTypes,
    selectedAgeRange,
    selectedProgramAges,
    selectedAvailability,
    selectedWard,
    cwelccParticipating,
    acceptsSubsidy,
    escapeRegex,
  ]);

  // Regions (distinct)
  const { data: regionsResponse } = useQuery({
    queryKey: ["daycares", "regions"],
    queryFn: async () => {
      const response = await apiClient.get("/api/daycares/regions/all");
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - regions rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes - keep cached longer
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false,
  });

  const regions: string[] = Array.isArray(regionsResponse?.data)
    ? regionsResponse.data
    : Array.isArray(regionsResponse)
    ? regionsResponse
    : [];

  // Cities by region (distinct)
  const { data: citiesResponse } = useQuery({
    queryKey: ["daycares", "citiesByRegion", selectedRegion],
    enabled: !!selectedRegion,
    queryFn: async () => {
      const response = await apiClient.get(
        `/api/daycares/cities/all?region=${encodeURIComponent(selectedRegion)}`
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - cities by region rarely change
    gcTime: 20 * 60 * 1000, // 20 minutes - keep cached longer
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false,
  });

  const cityWardOptions: string[] = Array.isArray(citiesResponse?.data)
    ? citiesResponse.data
    : Array.isArray(citiesResponse)
    ? citiesResponse
    : [];

  // Program ages (distinct)
  const { data: programAgesResponse, isLoading: programAgesLoading } = useQuery(
    {
      queryKey: ["daycares", "programAges"],
      queryFn: async () => {
        const response = await apiClient.get("/api/daycares/program-ages/all");
        return response.data;
      },
      staleTime: 15 * 60 * 1000, // 15 minutes - program ages rarely change
      gcTime: 30 * 60 * 1000, // 30 minutes - keep cached longer
      refetchOnMount: false, // Don't refetch if we have cached data
      refetchOnWindowFocus: false,
    }
  );

  const programAgeOptions: string[] = Array.isArray(programAgesResponse?.data)
    ? programAgesResponse.data
    : Array.isArray(programAgesResponse)
    ? programAgesResponse
    : [];

  // Daycare types by region and city (dynamic)
  const { data: typesResponse, isLoading: typesLoading } = useQuery({
    queryKey: ["daycares", "types", selectedRegion, selectedWard],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRegion) {
        params.append("region", selectedRegion);
      }
      if (selectedWard) {
        params.append("city", selectedWard);
      }
      const response = await apiClient.get(
        `/api/daycares/types/all?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!selectedRegion || !!selectedWard, // Only fetch when region or city is selected
    staleTime: 10 * 60 * 1000, // 10 minutes - types may change but not frequently
    gcTime: 20 * 60 * 1000, // 20 minutes - keep cached longer
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false,
  });

  const availableTypes: string[] = Array.isArray(typesResponse?.data)
    ? typesResponse.data
    : Array.isArray(typesResponse)
    ? typesResponse
    : [];

  // Format types for FilterPanel (convert string array to {value, label} format)
  const typeOptions = useMemo(() => {
    // Helper function to format type label
    const formatTypeLabel = (typeValue: string): string => {
      // Common abbreviations and formatting
      const typeMap: Record<string, string> = {
        Nursery: "Nursery",
        "Regional (Durham) Early Learning and Child Care Centres":
          "Regional (Durham) ELC Centres",
        "Full Day, After-School, PA Day, Summer Camp":
          "Full Day / After-School / Camps",
        "Infant and Toddler Programs, Summer Camp, Preschool Room, Nursery School, School Age Program, Junior & Senior Kindergarten":
          "Infant–School Age Programs",
        "YMCA Childcare": "YMCA Childcare",
        "Umbrella Academy, Before and After School":
          "Umbrella Academy (B&A School)",
        "Afterschool program": "Afterschool Program",
        "BGC Durham, After-School program": "BGC Durham (After-School)",
        "YMCA Before & After School": "YMCA (B&A School)",
        "YMCA School Age": "YMCA (School Age)",
        Montessori: "Montessori",
        Camps: "Camps",
        "Home Childcare": "Home Childcare",
        "Compass ELC": "Compass ELC",
        "Child Care": "Child Care",
        "Before and After School Program": "Before & After School",
        Christian: "Christian",
      };

      return (
        typeMap[typeValue] ||
        (typeValue.length > 40 ? typeValue.substring(0, 37) + "..." : typeValue)
      );
    };

    return availableTypes.map((type) => ({
      value: type,
      label: formatTypeLabel(type),
    }));
  }, [availableTypes]);

  // Reset City/Ward when region changes
  useEffect(() => {
    setSelectedWard("");
  }, [selectedRegion]);

  // Fetch daycares with React Query
  const {
    data: daycaresResponse,
    isLoading,
    error: queryError,
    isFetching,
  } = useQuery({
    queryKey: ["daycares", "search", queryParams],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(queryParams);
        console.log(
          "🌐 API CALL - Fetching from:",
          `/api/daycares/search?${searchParams.toString()}`
        );
        const response = await apiClient.get(
          `/api/daycares/search?${searchParams.toString()}`
        );

        console.log("✅ API SUCCESS - Response received:", {
          success: response.data.success,
          dataLength: response.data.data?.length,
          hasData: !!response.data.data,
        });

        if (response.data.success) {
          // Debug: Log first daycare to see what data we're getting
          if (response.data.data && response.data.data.length > 0) {
            const firstDaycare = response.data.data[0];
            console.log("🔍 DEBUG - First daycare from API:", {
              name: firstDaycare.name,
              price: firstDaycare.price,
              priceType: typeof firstDaycare.price,
              priceString: firstDaycare.priceString,
              priceStringType: typeof firstDaycare.priceString,
              hasPriceString: !!firstDaycare.priceString,
              fullData: firstDaycare,
            });
          }
          return response.data;
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        // Fallback to local data if API fails
        console.error("❌ API FAILED - Using local fallback:", err);
        console.warn("API fetch failed, using local data:", err);
        // For fallback, we'll return a mock response structure
        const filtered = (daycaresLocalData as Daycare[]).slice(
          (currentPage - 1) * resultsPerPage,
          currentPage * resultsPerPage
        );
        return {
          success: true,
          data: filtered,
          metadata: {
            pagination: {
              currentPage,
              totalPages: Math.ceil(
                (daycaresLocalData as Daycare[]).length / resultsPerPage
              ),
              totalCount: (daycaresLocalData as Daycare[]).length,
              limit: resultsPerPage,
              hasNextPage:
                currentPage <
                Math.ceil(
                  (daycaresLocalData as Daycare[]).length / resultsPerPage
                ),
              hasPreviousPage: currentPage > 1,
            },
          },
        };
      }
    },
    // Keep showing the previous page of results while new filters load.
    // This prevents the whole page from flashing/going blank on every filter change.
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - keep cached data longer (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have cached data
  });

  // Fetch all daycares for map view (only if user is logged in)
  const { data: allDaycaresResponse } = useQuery({
    queryKey: ["daycares", "search", "all", mapQueryParams],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(mapQueryParams);
        const response = await apiClient.get(
          `/api/daycares/search?${searchParams.toString()}`
        );

        if (response.data.success) {
          return response.data;
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.warn("API fetch failed for map view:", err);
        return {
          success: true,
          data: [],
          metadata: {
            pagination: {
              totalCount: 0,
            },
          },
        };
      }
    },
    enabled: !!user && !authLoading, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep cached longer
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false,
  });

  // Extract data from query response
  const daycaresData = useMemo(() => {
    const data = daycaresResponse?.data || [];
    // Transform API response: map _id to id (MongoDB returns _id, but frontend expects id)
    const transformedData = data.map((daycare: any) => ({
      ...daycare,
      id: daycare._id || daycare.id || "",
    }));
    // Debug: Log all daycares to see priceString
    if (transformedData.length > 0) {
      console.log(
        "📊 ALL DAYCARES DATA:",
        transformedData.map((d: Daycare) => ({
          name: d.name,
          price: d.price,
          priceString: d.priceString,
          hasPriceString: !!d.priceString,
          priceStringValue: d.priceString,
          id: d.id,
        }))
      );
    }
    return transformedData;
  }, [daycaresResponse?.data]);
  const paginationMeta = daycaresResponse?.metadata?.pagination;
  const totalPages = paginationMeta?.totalPages || 1;
  const totalCount = paginationMeta?.totalCount || 0;

  // Helper function for price parsing
  const getPriceValue = useCallback((price: string | undefined | null) => {
    if (!price || typeof price !== "string") return 0;
    const numericPrice = price.replace(/[^0-9]/g, "");
    return numericPrice ? parseInt(numericPrice) : 0;
  }, []);

  // Sort daycares (backend handles filtering, we only sort client-side)
  const sortedDaycares = useMemo(() => {
    if (!daycaresData || !Array.isArray(daycaresData)) {
      return [];
    }

    // Create a copy to avoid mutating the original array
    const sorted = [...daycaresData];

    sorted.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue =
            a.name && typeof a.name === "string" ? a.name.toLowerCase() : "";
          bValue =
            b.name && typeof b.name === "string" ? b.name.toLowerCase() : "";
          break;
        case "rating":
          aValue = parseFloat(a.rating?.toString() || "0");
          bValue = parseFloat(b.rating?.toString() || "0");
          break;
        case "price":
          aValue = getPriceValue(a.price);
          bValue = getPriceValue(b.price);
          break;
        case "distance":
          aValue = parseFloat(a.distance?.toString() || "0");
          bValue = parseFloat(b.distance?.toString() || "0");
          break;
        default:
          aValue =
            a.name && typeof a.name === "string" ? a.name.toLowerCase() : "";
          bValue =
            b.name && typeof b.name === "string" ? b.name.toLowerCase() : "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [daycaresData, sortBy, sortOrder, getPriceValue]);

  // Guest users see only 4 results
  // Logged-in users see 15 results per page (backend pagination)
  const isGuest = !user && !authLoading;
  const guestLimit = 4;
  const maxResults = isGuest ? guestLimit : resultsPerPage;

  // Use sorted daycares as displayed daycares (backend already paginated)
  // Limit results for guests client-side only
  const displayedDaycares = useMemo(() => {
    if (isGuest) {
      return sortedDaycares.slice(0, guestLimit);
    }
    // For logged-in users, backend pagination handles the limit (15 per page)
    return sortedDaycares;
  }, [sortedDaycares, isGuest, guestLimit]);

  // All daycares for map view (logged in users only)
  const allDaycaresForMap = useMemo(() => {
    if (!user || authLoading) {
      return displayedDaycares; // For guests, use displayed daycares
    }
    const mapData = allDaycaresResponse?.data || [];
    // Transform API response: map _id to id (MongoDB returns _id, but frontend expects id)
    const transformedMapData = mapData.map((daycare: any) => ({
      ...daycare,
      id: daycare._id || daycare.id || "",
    }));
    return transformedMapData.length > 0 ? transformedMapData : displayedDaycares;
  }, [user, authLoading, allDaycaresResponse?.data, displayedDaycares]);

  // Note: Backend pagination is handled via queryParams, but we still need to limit
  // results for guest/free users client-side if needed
  const hasMoreResults = totalCount > maxResults;

  // Pagination functions
  const goToPage = (page: number) => {
    // If guest user, redirect to login instead of changing page
    if (isGuest) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentUrl
      )}`;
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const toggleFavorite = useCallback(
    (id: string) => {
      if (user) {
        // For logged-in users, use API
        setFavoriteLoadingId(id);
        if (favorites.includes(id)) {
          removeFavoriteAPI(id);
        } else {
          addFavoriteAPI(id);
        }
      } else {
        // For guest users, redirect to login
        const currentUrl = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      }
    },
    [user, favorites, addFavoriteAPI, removeFavoriteAPI]
  );

  // Clear loading state when mutations complete
  useEffect(() => {
    if (!isAddingFavorite && !isRemovingFavorite && favoriteLoadingId) {
      // Small delay to ensure UI updates smoothly
      const timer = setTimeout(() => {
        setFavoriteLoadingId(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAddingFavorite, isRemovingFavorite, favoriteLoadingId]);

  const toggleCompare = (id: string) => {
    const newCompareList = compareList.includes(id)
      ? compareList.filter((comp) => comp !== id)
      : [...compareList, id];

    setCompareList(newCompareList);
  };

  const clearComparison = () => {
    setCompareList([]);
    setShowComparison(false);
  };

  const getDaycaresToCompare = () => {
    return compareList
      .map((id) => daycaresData.find((daycare: Daycare) => daycare.id === id))
      .filter(Boolean) as Daycare[];
  };

  const handleContactProvider = (daycare: Daycare) => {
    // Implement contact functionality
    console.log("Contacting provider:", daycare.name);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMessageProvider = (daycare: Daycare) => {
    setSelectedProvider(daycare);
    setShowMessaging(true);
  };

  const handleViewDetails = (daycare: Daycare) => {
    // Navigate to detail page
    window.location.href = `/daycare/${daycare.id}`;
  };

  const addToRecentlyViewed = (daycare: Daycare) => {
    const recentlyViewed = JSON.parse(
      localStorage.getItem("recently-viewed") || "[]"
    );
    const updated = [
      daycare,
      ...recentlyViewed.filter((d: Daycare) => d.id !== daycare.id),
    ].slice(0, 5);
    localStorage.setItem("recently-viewed", JSON.stringify(updated));
    // update UI immediately
    setRecentlyViewed(updated);
  };

  // Load recently viewed from localStorage (client-side only).
  // Client Components still render on the server for the initial HTML, so
  // we must not touch `localStorage` during render.
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("recently-viewed") || "[]";
      const parsed = JSON.parse(raw) as Daycare[];
      setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  // Keep recently viewed in sync with current results dataset
  const filteredRecentlyViewed = useMemo(() => {
    return recentlyViewed.filter((daycare: Daycare) =>
      daycaresData.some((d: Daycare) => d.id === daycare.id)
    );
  }, [recentlyViewed, daycaresData]);

  // Show page structure immediately, use cached data if available
  // Only show loading indicator in results area when fetching

  if (queryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-red-100 to-red-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-red-500 text-5xl">⚠️</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Error Loading Data
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {queryError instanceof Error
                ? queryError.message
                : "An error occurred while loading KinderBridge locations"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Form */}
          <form
            onSubmit={() => {}}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 mb-6"
          >
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Find Your Perfect Daycare
              </h1>
              <p className="text-sm text-gray-600">
                Search through our verified network of childcare providers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search daycares, features, or descriptions..."
                  value={""}
                  onChange={() => {}}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm transition-all duration-200 hover:shadow-md"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Search Daycares
              </button>
            </div>
          </form>

          {/* Back Navigation */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Search Summary Bar */}
          <SearchSummary
            isLoading={isLoading}
            totalCount={totalCount}
            favoritesCount={
              user
                ? apiFavorites.filter((fav) => fav.daycare).length
                : 0
            }
            compareListCount={compareList.length}
            compareListLength={compareList.length}
            onShowComparison={() => setShowComparison(true)}
          />

          {/* Floating Compare Button */}
          {compareList.length > 0 && (
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setShowComparison(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Compare ({compareList.length})</span>
              </button>
            </div>
          )}

          {/* Recently Viewed Section */}
          <RecentlyViewed
            recentlyViewed={filteredRecentlyViewed}
            onViewDetails={handleViewDetails}
          />

          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Filter Panel */}
            <div className="lg:w-[480px] mb-6 lg:mb-0">
              <FilterPanel
                isLoading={isLoading}
                regions={regions}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                cityWardOptions={cityWardOptions}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedAgeRange={selectedAgeRange}
                setSelectedAgeRange={setSelectedAgeRange}
                programAgeOptions={programAgeOptions}
                programAgesLoading={programAgesLoading}
                selectedProgramAges={selectedProgramAges}
                setSelectedProgramAges={setSelectedProgramAges}
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
                selectedWard={selectedWard}
                setSelectedWard={setSelectedWard}
                cwelccParticipating={cwelccParticipating}
                setCwelccParticipating={setCwelccParticipating}
                acceptsSubsidy={acceptsSubsidy}
                setAcceptsSubsidy={setAcceptsSubsidy}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                expandedSections={expandedSections}
                setExpandedSections={setExpandedSections}
                displayedDaycaresLength={displayedDaycares.length}
                onAddContactLog={() => setShowContactLogModal(true)}
                typeOptions={
                  selectedRegion || selectedWard ? typeOptions : undefined
                }
              />
            </div>

            {/* Main Content Area */}
            <SearchResults
              isLoading={isLoading}
              isFetching={isFetching}
              displayedDaycares={displayedDaycares}
              allDaycaresForMap={allDaycaresForMap}
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={currentPage}
              isGuest={isGuest}
              hasPurchasedReport={hasPurchasedReport}
              hasMoreResults={hasMoreResults}
              compareList={compareList}
              favorites={favorites}
              favoriteLoadingId={favoriteLoadingId}
              onToggleCompare={toggleCompare}
              onToggleFavorite={toggleFavorite}
              onViewDetails={handleViewDetails}
              onAddToRecentlyViewed={addToRecentlyViewed}
              onPageChange={goToPage}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
            />
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={showComparison}
        daycares={getDaycaresToCompare()}
        onClose={() => setShowComparison(false)}
        onClearComparison={clearComparison}
        onContactProvider={handleContactProvider}
      />

      {/* Messaging System Modal */}
      {showMessaging && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh]">
            <MessagingSystem
              currentUserId="demo-user-123"
              currentUserType="parent"
              recipientId={selectedProvider.id}
              recipientType="provider"
              recipientName={selectedProvider.name}
              onClose={() => {
                setShowMessaging(false);
                setSelectedProvider(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Contact Log Modal */}
      <ContactLogModal
        isOpen={showContactLogModal}
        onClose={() => setShowContactLogModal(false)}
      />
    </>
  );
}
