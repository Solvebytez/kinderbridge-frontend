'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, DollarSign, TrendingUp, Calendar, Plus, Search, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  childrenCount: number;
  childcareNeeds: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
}

interface ChildcareBenefit {
  id: string;
  type: string;
  description: string;
  cost: number;
  coverage: string;
  employeesEnrolled: number;
  maxEmployees: number;
  status: 'active' | 'pending' | 'expired';
}

export default function EmployerDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const employees: Employee[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      childrenCount: 2,
      childcareNeeds: 'Full-time daycare for 3-year-old and 6-year-old',
      status: 'active',
      lastActive: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      childrenCount: 1,
      childcareNeeds: 'Part-time preschool for 4-year-old',
      status: 'active',
      lastActive: '2024-01-14'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'HR',
      position: 'HR Specialist',
      childrenCount: 3,
      childcareNeeds: 'After-school care for 7, 9, and 11-year-olds',
      status: 'pending',
      lastActive: '2024-01-10'
    }
  ];

  const childcareBenefits: ChildcareBenefit[] = [
    {
      id: '1',
      type: 'Daycare Subsidy',
      description: 'Monthly subsidy for licensed daycare centers',
      cost: 500,
      coverage: 'Up to $500/month per child',
      employeesEnrolled: 15,
      maxEmployees: 25,
      status: 'active'
    },
    {
      id: '2',
      type: 'Backup Care',
      description: 'Emergency childcare when regular care is unavailable',
      cost: 200,
      coverage: 'Up to 10 days per year',
      employeesEnrolled: 8,
      maxEmployees: 20,
      status: 'active'
    },
    {
      id: '3',
      type: 'Summer Camp Program',
      description: 'Summer childcare program for school-age children',
      cost: 800,
      coverage: '8 weeks of summer camp',
      employeesEnrolled: 12,
      maxEmployees: 15,
      status: 'pending'
    }
  ];

  const stats = [
    {
      title: 'Total Employees',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Childcare Benefits',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: Building,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Monthly Investment',
      value: '$15,400',
      change: '+8%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Retention Rate',
      value: '94%',
      change: '+2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Prevent wrapping */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer whitespace-nowrap">
                DayCare Concierge
              </Link>
            </div>
            
            {/* Center Navigation - Hide on smaller screens to prevent wrapping */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Link href="/" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Home
                </Link>
                <Link href="/search" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Find Daycare
                </Link>
                <Link href="/classes" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Find a Class
                </Link>
                <Link href="/toys" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Developmental Toys
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  About
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Contact
                </Link>
              </div>
            </div>
            
            {/* Right Side Actions - Compact and prevent wrapping */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Employer Portal</span>
              </div>
              {authLoading ? (
                <div className="text-gray-500 px-3 py-2 text-sm">Loading...</div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden sm:inline">{user.firstName || user.email}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Home</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="text-gray-500 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your company&apos;s childcare benefits and employee programs</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'employees', label: 'Employees', icon: Users },
                { id: 'benefits', label: 'Benefits', icon: Building },
                { id: 'analytics', label: 'Analytics', icon: DollarSign }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-800">Sarah Johnson enrolled in Daycare Subsidy</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-800">New Summer Camp Program added</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-blue-800">Monthly benefits report generated</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add New Benefit</span>
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Invite Employees</span>
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Employee Childcare Needs</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Employee</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Childcare Needs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.department}</div>
                            <div className="text-sm text-gray-500">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {employee.childrenCount} children
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{employee.childcareNeeds}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.status === 'active' ? 'bg-green-100 text-green-800' :
                              employee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Childcare Benefits Programs</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create New Benefit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {childcareBenefits.map((benefit) => (
                    <div key={benefit.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{benefit.type}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          benefit.status === 'active' ? 'bg-green-100 text-green-800' :
                          benefit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {benefit.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{benefit.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monthly Cost:</span>
                          <span className="font-medium">${benefit.cost}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Coverage:</span>
                          <span className="font-medium">{benefit.coverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Enrollment:</span>
                          <span className="font-medium">{benefit.employeesEnrolled}/{benefit.maxEmployees}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                          Edit
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">Benefits Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Daycare Subsidy</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Backup Care</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                          <span className="text-sm font-medium">40%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Summer Camp</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm font-medium">80%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Monthly Cost</span>
                        <span className="text-lg font-bold text-gray-900">$15,400</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Per Employee</span>
                        <span className="text-sm font-medium">$121</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ROI (Retention)</span>
                        <span className="text-sm font-medium text-green-600">+$45,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
