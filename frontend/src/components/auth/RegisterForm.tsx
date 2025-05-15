import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { registerCustomer } from '../../services/authService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { User } from '../../types';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNo: string;
  eCardHolder: boolean;
}

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<RegisterFormData>();

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      const userData: User = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNo: data.phoneNo,
        role: 'customer'
      };
      
      await registerCustomer(userData, data.eCardHolder);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Create Account</h2>
        <p className="text-neutral-500 mt-2">Sign up to start using our services</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          fullWidth
          error={errors.fullName?.message}
          {...register('fullName', { 
            required: 'Full name is required' 
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          fullWidth
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Please enter a valid email address',
            }
          })}
        />

        <Input
          label="Phone Number"
          placeholder="+1234567890"
          fullWidth
          error={errors.phoneNo?.message}
          {...register('phoneNo', { 
            required: 'Phone number is required',
            pattern: {
              value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message: 'Please enter a valid phone number',
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          fullWidth
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            }
          })}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          fullWidth
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm', { 
            required: 'Please confirm your password',
            validate: value => 
              value === password || 'The passwords do not match'
          })}
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="eCardHolder"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            {...register('eCardHolder')}
          />
          <label htmlFor="eCardHolder" className="ml-2 block text-sm text-neutral-700">
            I have an e-card
          </label>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            loading={isLoading}
            icon={<UserPlus size={18} />}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-600">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            Log in
          </a>
        </p>
      </div>
    </Card>
  );
};