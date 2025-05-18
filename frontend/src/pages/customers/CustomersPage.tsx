import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserCircle, Plus, Edit, Trash, Phone, Mail, Search, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getAllCustomers, deleteCustomer } from '../../services/customerService';
import { Customer } from '../../types';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchCustomers();
    }
  }, [isAdmin]);
  
  const handleDeleteCustomer = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this customer?')) {
        await deleteCustomer(id);
        setCustomers(customers.filter(customer => customer._id !== id));
        toast.success('Customer deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    }
  };
  
  const filteredCustomers = customers.filter(customer => {
    // Handle both cases - when user is populated object or just an ID
    const userData = typeof customer.user === 'string' ? null : customer.user;
    
    return (
      (userData?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userData?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userData?.phoneNo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Customers</h1>
          <p className="text-neutral-500">
            Manage all supermarket registered customers
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => window.location.href = '/customers/new'}
              icon={<Plus size={18} />}
            >
              Add Customer
            </Button>
          </div>
        )}
      </div>
      
      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <Input 
            placeholder="Search customers by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
      </Card>
      
      {/* Customers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Loading customers...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredCustomers.map((customer) => {
            // Handle both cases - when user is populated object or just an ID
            const userData = typeof customer.user === 'string' ? null : customer.user;
            
            return (
              <motion.div key={customer._id} variants={item}>
                <Card className="h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-100 p-3 rounded-md">
                        <UserCircle size={20} className="text-primary-600" />
                      </div>
                      <div className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {customer.eCardHolder ? 'E-Card Member' : 'Basic Member'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      {userData?.fullName || 'Customer'}
                    </h3>
                    
                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                      <Mail size={16} className="mr-2" />
                      <span>{userData?.email || 'No email available'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                      <Phone size={16} className="mr-2" />
                      <span>{userData?.phoneNo || 'No phone available'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-neutral-500 mb-4">
                      <CreditCard size={16} className="mr-2" />
                      <span>E-Card Status: {customer.eCardHolder ? 'Active' : 'Not Active'}</span>
                    </div>
                    
                    {customer.createdAt && (
                      <div className="text-xs text-neutral-400 mt-2">
                        Registered: {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 flex">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2 flex-1"
                        onClick={() => window.location.href = `/customers/edit/${customer._id}`}
                        icon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDeleteCustomer(customer._id!)}
                        icon={<Trash size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <UserCircle size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-xl font-medium text-neutral-700 mb-2">No customers found</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `No customers match "${searchTerm}". Try adjusting your search.`
              : 'There are no customers to display. Customers can register through the public registration page.'}
          </p>
          {isAdmin && (
            <Button 
              onClick={() => window.location.href = '/customers/new'}
              icon={<Plus size={18} />}
            >
              Add Customer
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};