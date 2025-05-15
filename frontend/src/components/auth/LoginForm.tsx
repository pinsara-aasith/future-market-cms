import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Log In</h2>
        <p className="text-neutral-500 mt-2">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        
        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            loading={isLoading} 
            icon={<LogIn size={18} />}
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 hover:text-primary-800 font-medium">
            Register
          </a>
        </p>
      </div>
    </Card>
  );
};