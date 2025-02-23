import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const navigate = useNavigate();

  const users = [
    { name: "admin@gmail.com", pass: "Admin@@##25", role: "admin" },
    { name: "user@gmail.com", pass: "User$$%%27", role: "user" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find((u) => u.name === email && u.pass === password);
    if (user) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name: user.name, role: user.role })
      );
      navigate("/current");
    } else {
      toast.error('Invalid email or password!')
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm md:max-w-lg mx-auto my-10">
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-gray-900 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-600 font-medium rounded-full text-sm px-5 py-2.5 text-center"
      >
        Login
      </button>
      <ToastContainer/>
    </form>
    
  );
}

export default LoginForm;
