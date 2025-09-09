import React, { useState, useContext, createContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

// Crear contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación para envolver la aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulación de base de datos de usuarios (en un caso real, esto vendría de una API)
  const [usersDB, setUsersDB] = useState([
    {
      id: 1,
      name: "Usuario Demo",
      email: "demo@example.com",
      password: "password123",
    },
  ]);

  const login = async (email, password) => {
    setLoading(true);
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Buscar usuario en la "base de datos"
    const userFound = usersDB.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound) {
      // Eliminar password del objeto usuario antes de guardarlo
      const { password, ...userWithoutPassword } = userFound;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setLoading(false);
      return { success: true, message: "Inicio de sesión exitoso" };
    } else {
      setLoading(false);
      return { success: false, message: "Credenciales incorrectas" };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verificar si el usuario ya existe
    const userExists = usersDB.find((user) => user.email === userData.email);

    if (userExists) {
      setLoading(false);
      return { success: false, message: "El usuario ya existe" };
    }

    // Agregar nuevo usuario
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };

    setUsersDB([...usersDB, newUser]);

    // Eliminar password del objeto usuario antes de guardarlo
    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));

    setLoading(false);
    return { success: true, message: "Usuario registrado exitosamente" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Cargar usuario desde localStorage al inicializar
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Componente para proteger rutas
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "Ingresa una contraseña";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Ingresa un nombre";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirma tu contraseña";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas deben coincidir";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let result;

      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        navigate("/dashboard");
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    }
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setMessage({ text: "", type: "" });
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Bienvenido" : "Crear Cuenta"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Inicia Sesión" : "Regístrate"}
          </p>
        </div>

        {/* Mensaje de éxito/error */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field (only for registration) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingresa tu nombre"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ingresa tu email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ingresa tu contraseña"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirma tu contraseña"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? "Procesando..."
              : isLogin
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
          </button>
        </form>

        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              onClick={toggleFormMode}
              className="text-blue-600 font-semibold hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isLogin ? "Registrarse" : "Iniciar sesión"}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-blue-600 text-sm hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
