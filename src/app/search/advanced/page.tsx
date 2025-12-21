'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  FunnelIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { formatDaycarePrice } from '../../../utils/priceFormatter';

interface Daycare {
  id: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: string | number;
  priceString?: string;
  capacity: string;
  ageRange: string;
  hours: string;
  phone: string;
  email: string;
  description: string;
  features: string[];
  images: string[];
  availability: string;
  verified: boolean;
  distance: string;
  coordinates: { lat: number; lng: number };
}

// Enhanced GTA daycare data with coordinates
const advancedDaycares: Daycare[] = [
  // Toronto
  {
    id: 1,
    name: "Little Explorers Academy",
    location: "Toronto",
    address: "123 Yonge St, Toronto, ON M5C 2W1",
    rating: 4.8,
    reviewCount: 127,
    price: "$1,800/month",
    capacity: "45 children",
    ageRange: "6 months - 6 years",
    hours: "7:00 AM - 6:00 PM",
    phone: "(416) 555-0123",
    email: "hello@littleexplorers.ca",
    description: "Premium early learning center with a nature-inspired curriculum and small class sizes for personalized attention.",
    features: ["Nature-Inspired Learning", "Small Class Sizes", "Forest School Program", "Organic Meals", "Parent Education", "Community Garden"],
    images: ["/api/placeholder/400/300"],
    availability: "3 spots available",
    verified: true,
    distance: "0.5 km",
    coordinates: { lat: 43.6532, lng: -79.3832 }
  },
  // Whitby
  {
    id: 2,
    name: "Bright Beginnings Childcare",
    location: "Whitby",
    address: "456 Brock St, Whitby, ON L1N 4J8",
    rating: 4.6,
    reviewCount: 89,
    price: "$1,100/month",
    capacity: "32 children",
    ageRange: "12 months - 5 years",
    hours: "7:30 AM - 5:30 PM",
    phone: "(905) 555-0456",
    email: "info@brightbeginnings.ca",
    description: "Nurturing environment focused on early childhood development with experienced educators and modern facilities.",
    features: ["Early Childhood Development", "Experienced Educators", "Modern Facilities", "Outdoor Play Area", "Nutritious Meals", "Parent Communication"],
    images: ["/api/placeholder/400/300"],
    availability: "5 spots available",
    verified: true,
    distance: "1.2 km",
    coordinates: { lat: 43.8975, lng: -78.9428 }
  },
  // Oshawa
  {
    id: 3,
    name: "Sunshine Daycare Center",
    location: "Oshawa",
    address: "789 King St E, Oshawa, ON L1H 1C5",
    rating: 4.9,
    reviewCount: 156,
    price: "$1,500/month",
    capacity: "28 children",
    ageRange: "12 months - 5 years",
    hours: "8:00 AM - 5:30 PM",
    phone: "(905) 555-0789",
    email: "contact@sunshinedaycare.com",
    description: "Premium childcare with small class sizes, personalized attention, and a nature-based curriculum that connects children with the outdoors.",
    features: ["Nature-Based Learning", "Small Class Sizes", "Organic Garden", "Yoga & Mindfulness", "Parent Workshops", "Extended Hours"],
    images: ["/api/placeholder/400/300"],
    availability: "1 spot available",
    verified: true,
    distance: "1.8 km",
    coordinates: { lat: 43.8971, lng: -78.8658 }
  },
  // Ajax
  {
    id: 4,
    name: "Happy Hearts Learning",
    location: "Ajax",
    address: "321 Harwood Ave S, Ajax, ON L1S 2H6",
    rating: 4.4,
    reviewCount: 73,
    price: "$1,100/month",
    capacity: "38 children",
    ageRange: "6 months - 5 years",
    hours: "7:30 AM - 6:30 PM",
    phone: "(905) 555-0321",
    email: "hello@happyhearts.com",
    description: "Affordable, quality childcare with a play-based approach. We believe every child deserves a happy, safe environment to grow and learn.",
    features: ["Play-Based Learning", "Affordable Rates", "Flexible Scheduling", "Parent Involvement", "Community Events", "Transportation Available"],
    images: ["/api/placeholder/400/300"],
    availability: "5 spots available",
    verified: true,
    distance: "2.1 km",
    coordinates: { lat: 43.8509, lng: -79.0205 }
  },
  // Mississauga
  {
    id: 5,
    name: "Creative Kids Corner",
    location: "Mississauga",
    address: "654 Hurontario St, Mississauga, ON L5B 1A1",
    rating: 4.7,
    reviewCount: 94,
    price: "$1,400/month",
    capacity: "25 children",
    ageRange: "2-6 years",
    hours: "8:30 AM - 5:00 PM",
    phone: "(905) 555-0654",
    email: "info@creativekidscorner.com",
    description: "Arts-focused early childhood program where creativity meets education. Children develop artistic skills while learning core academic concepts.",
    features: ["Arts & Crafts Focus", "Music & Movement", "Drama & Storytelling", "Exhibition Space", "Artist Visits", "Creative Curriculum"],
    images: ["/api/placeholder/400/300"],
    availability: "2 spots available",
    verified: true,
    distance: "2.5 km",
    coordinates: { lat: 43.5890, lng: -79.6441 }
  },
  // Brampton
  {
    id: 6,
    name: "Little Learners Academy",
    location: "Brampton",
    address: "987 Main St N, Brampton, ON L6X 1N9",
    rating: 4.5,
    reviewCount: 112,
    price: "$1,250/month",
    capacity: "40 children",
    ageRange: "6 months - 5 years",
    hours: "7:00 AM - 6:00 PM",
    phone: "(905) 555-0987",
    email: "info@littlelearners.com",
    description: "Comprehensive early childhood development with a focus on multicultural learning and inclusive education.",
    features: ["Multicultural Program", "Inclusive Education", "Parent Workshops", "Outdoor Activities", "Healthy Meals", "Extended Care"],
    images: ["/api/placeholder/400/300"],
    availability: "4 spots available",
    verified: true,
    distance: "1.5 km",
    coordinates: { lat: 43.6831, lng: -79.7663 }
  }
];

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [daycareType, setDaycareType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Get URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    const locationParam = urlParams.get('location');
    
    if (queryParam) setSearchQuery(queryParam);
    if (locationParam) setLocation(locationParam);
  }, []);

  const filteredDaycares = advancedDaycares.filter(daycare => {
    const searchLower = searchQuery.toLowerCase().trim();
    const locationLower = location.toLowerCase().trim();
    
    const matchesSearch = searchLower === '' || 
                         daycare.name.toLowerCase().includes(searchLower) ||
                         daycare.description.toLowerCase().includes(searchLower) ||
                         daycare.features.some(feature => 
                           feature.toLowerCase().includes(searchLower)
                         );
    
    const matchesLocation = locationLower === '' || 
                           daycare.location.toLowerCase().includes(locationLower);
    
    const matchesAge = ageRange === '' || 
                      daycare.ageRange.includes(ageRange);
    
    const matchesPrice = priceRange === '' || 
                        (() => {
                          const price = daycare.price && typeof daycare.price === 'string' ? parseInt(daycare.price.replace(/[^0-9]/g, '')) : 0;
                          switch (priceRange) {
                            case 'under-1000': return price < 1000;
                            case '1000-1500': return price >= 1000 && price <= 1500;
                            case '1500-2000': return price > 1500 && price <= 2000;
                            case 'over-2000': return price > 2000;
                            default: return true;
                          }
                        })();
    
    const matchesType = daycareType === '' || 
                       daycare.features.some(feature => 
                         feature.toLowerCase().includes(daycareType.toLowerCase())
                       );
    
    return matchesSearch && matchesLocation && matchesAge && matchesPrice && matchesType;
  });

  const sortedDaycares = [...filteredDaycares].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        const aPrice = a.price && typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : 0;
        const bPrice = b.price && typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : 0;
        return aPrice - bPrice;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'availability':
        return a.availability.localeCompare(b.availability);
      default:
        return 0;
    }
  });

  const toggleFavorite = (daycareId: number) => {
    setFavorites(prev => 
      prev.includes(daycareId) 
        ? prev.filter(id => id !== daycareId)
        : [...prev, daycareId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                DayCare Concierge
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/parent/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/provider/dashboard" className="text-gray-600 hover:text-gray-900">
                Provider Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Class</h1>
          <p className="text-gray-600">Discover the perfect daycare for your child</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Ages</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
              <option value="2-6 years">2-6 years</option>
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Price</option>
              <option value="under-1000">Under $1,000</option>
              <option value="1000-1500">$1,000 - $1,500</option>
              <option value="1500-2000">$1,500 - $2,000</option>
              <option value="over-2000">Over $2,000</option>
            </select>
            
            <select
              value={daycareType}
              onChange={(e) => setDaycareType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Type</option>
              <option value="nature">Nature-Based</option>
              <option value="arts">Arts & Creative</option>
              <option value="multicultural">Multicultural</option>
              <option value="play">Play-Based</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
                                      <FunnelIcon className="h-5 w-5" />
              <span>Advanced Filters</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="distance">Distance</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MapPinIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            {sortedDaycares.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No class found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDaycares.map((daycare) => (
                  <motion.div
                    key={daycare.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <div className="text-gray-500 text-center text-xs">
                            <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-1"></div>
                            Image
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{daycare.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  <span>{daycare.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <StarIcon className="h-4 w-4 text-yellow-400" />
                                  <span>{daycare.rating} ({daycare.reviewCount} reviews)</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleFavorite(daycare.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  favorites.includes(daycare.id)
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                <HeartIcon className="h-5 w-5" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <ShareIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{daycare.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{formatDaycarePrice(daycare.price, daycare.priceString)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="h-4 w-4 text-gray-400" />
                              <span>{daycare.capacity}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              <span>{daycare.hours}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="h-4 w-4 text-gray-400" />
                              <span>{daycare.distance}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {daycare.features && Array.isArray(daycare.features) && daycare.features.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                <PhoneIcon className="h-4 w-4 inline mr-2" />
                                Call
                              </button>
                              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Map View */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Map View</h2>
              <p className="text-sm text-gray-600 mb-4">Daycare locations near you</p>
              
              {/* Placeholder Map */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPinIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Interactive Map</p>
                  <p className="text-xs">Google Maps integration</p>
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Daycare Centers</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
