import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // If auto-login after register is needed

interface RegisterFormProps {
    // This prop is useful if the parent component needs to handle the registration API call.
    // If registration logic (like API call and navigation) is self-contained, this might not be needed.
    onRegister?: (data: RegisterFormData) => Promise<void> | void;
}

export interface RegisterFormData {
    username: string;
    password: string;
    confirmPassword?: string; // Optional: for password confirmation
    organizationName: string;
}

const Register: React.FC<RegisterFormProps> = ({ onRegister }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
    const navigate = useNavigate();
    // const { setIsUserLoggedIn } = useAuth(); // If you want to log the user in immediately after registration

    // Watch password field for confirm password validation
    const passwordValue = watch('password');

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        console.log('Registration data:', data);
        if (onRegister) {
            try {
                await onRegister(data);
                // Optionally navigate on successful registration if onRegister handles it
                // navigate('/login'); // Or '/dashboard' if auto-login
            } catch (error) {
                console.error("Registration failed:", error);
                // Handle registration error (e.g., display a message to the user)
            }
        } else {
            // If no onRegister prop, handle registration logic here (e.g., API call)
            // For demo, just navigate to login

            const response = await fetch('http://localhost:3000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                alert(`Registration failed: ${result.message}`);
                return;
            }

            alert(`User ${data.username} from ${data.organizationName} registered! Please login.`);
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        {...register("username", { required: "Username is required" })}
                        className={`mt-1 block w-full p-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                        className={`mt-1 block w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                </div>
                {/* Optional: Confirm Password Field */}
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword", { required: "Please confirm your password", validate: value => value === passwordValue || "Passwords do not match" })}
                        className={`mt-1 block w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
                </div>
                <div className="mb-6">
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                        type="text"
                        id="organizationName"
                        {...register("organizationName", { required: "Organization name is required" })}
                        className={`mt-1 block w-full p-3 border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.organizationName && <span className="text-red-500 text-xs mt-1">{errors.organizationName.message}</span>}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150">
                    Register
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
