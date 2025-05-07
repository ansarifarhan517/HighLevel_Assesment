import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

const url = 'http://localhost:3000'

const Login = ({ setIsUserLoggedIn }) => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data: any) => {
        console.log(data)
        const response = await fetch(url + '/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const result = await response.json()
        if (!response.ok) {
            alert(`Login failed: ${result.message}`)
            return
        }
        alert(`User ${data.username} logged in!`)
        setIsUserLoggedIn(true)
        navigate('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        {...register("username", { required: true })}
                        className={`mt-1 block w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.username && <span className="text-red-500 text-sm">Username is required</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: true })}
                        className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">Login</button>
            </form>
            <p className="mt-4">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></p>
        </div>
    )
}

export default Login
