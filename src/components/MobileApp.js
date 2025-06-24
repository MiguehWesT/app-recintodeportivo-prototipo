import React, { useState } from 'react';
import { User, Home, Calendar, History, Dumbbell, Settings, ArrowLeft, QrCode, Clock, MapPin, CheckCircle, Eye, EyeOff } from 'lucide-react';

const MobileAppPrototype = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    password: '',
    selectedFacility: '',
    selectedDate: '',
    selectedTime: '',
    userInfo: {
      name: 'Juan Pérez',
      rut: '12.345.678-9',
      email: 'juan.perez@email.com',
      phone: '+56 9 1234 5678'
    }
  });

  const [reservations] = useState([
    { id: 1, facility: 'Cancha de Tenis 1', date: '25-06-2025', time: '14:00', status: 'Confirmada' },
    { id: 2, facility: 'Piscina', date: '23-06-2025', time: '10:00', status: 'Activa' },
    { id: 3, facility: 'Gimnasio', date: '20-06-2025', time: '18:00', status: 'Completada' }
  ]);

  const [equipment] = useState([
    { id: 1, name: 'Raqueta de Tenis', available: 8, total: 12, facility: 'Cancha de Tenis' },
    { id: 2, name: 'Pelota de Basquet', available: 5, total: 10, facility: 'Cancha de Basquet' },
    { id: 3, name: 'Pesas 5kg', available: 12, total: 20, facility: 'Gimnasio' },
    { id: 4, name: 'Flotadores', available: 15, total: 25, facility: 'Piscina' }
  ]);

  const facilities = ['Cancha de Tenis 1', 'Cancha de Tenis 2', 'Piscina', 'Gimnasio', 'Cancha de Fútbol'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    if (formData.rut && formData.password) {
      setCurrentScreen('dashboard');
    }
  };

  const Screen = ({ children, title, showBack = false, onBack }) => (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center">
        {showBack && (
          <button onClick={onBack} className="mr-3">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="p-4 pb-20">
        {children}
      </div>
    </div>
  );

  const Login = () => (
    <Screen title="Iniciar Sesión">
      <div className="space-y-6 mt-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-600">Accede a tu cuenta</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
            <input
              type="text"
              placeholder="12.345.678-9"
              value={formData.rut}
              onChange={(e) => handleInputChange('rut', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>

          <button className="w-full text-blue-600 text-sm hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </Screen>
  );

  const Dashboard = () => (
    <Screen title="Inicio">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">¡Hola, {formData.userInfo.name}!</h2>
          <p className="text-gray-600">Tienes 2 reservas activas</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Reservas Activas</h3>
          {reservations.filter(r => r.status === 'Activa' || r.status === 'Confirmada').map(reservation => (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{reservation.facility}</h4>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar size={16} className="mr-1" />
                    {reservation.date} - {reservation.time}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  reservation.status === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {reservation.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentScreen('booking')}
            className="bg-blue-600 text-white p-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
          >
            <Calendar size={24} className="mx-auto mb-2" />
            Nueva Reserva
          </button>
          <button
            onClick={() => setCurrentScreen('credential')}
            className="bg-green-600 text-white p-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors"
          >
            <QrCode size={24} className="mx-auto mb-2" />
            Mi Credencial
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className="bg-purple-600 text-white p-4 rounded-lg text-center font-medium hover:bg-purple-700 transition-colors"
          >
            <History size={24} className="mx-auto mb-2" />
            Historial
          </button>
          <button
            onClick={() => setCurrentScreen('equipment')}
            className="bg-orange-600 text-white p-4 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors"
          >
            <Dumbbell size={24} className="mx-auto mb-2" />
            Implementos
          </button>
        </div>
      </div>
    </Screen>
  );

  const Reservar = () => (
    <Screen title="Nueva Reserva" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instalación</label>
          <select
            value={formData.selectedFacility}
            onChange={(e) => handleInputChange('selectedFacility', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una instalación</option>
            {facilities.map(facility => (
              <option key={facility} value={facility}>{facility}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
          <input
            type="date"
            value={formData.selectedDate}
            onChange={(e) => handleInputChange('selectedDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Horario Disponible</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => handleInputChange('selectedTime', time)}
                className={`p-2 rounded-lg border text-sm font-medium ${
                  formData.selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {formData.selectedFacility && formData.selectedDate && formData.selectedTime && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Resumen de Reserva</h3>
            <p className="text-sm text-gray-600">
              <strong>Instalación:</strong> {formData.selectedFacility}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {formData.selectedDate}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Hora:</strong> {formData.selectedTime}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            if (formData.selectedFacility && formData.selectedDate && formData.selectedTime) {
              alert('¡Reserva confirmada exitosamente!');
              setCurrentScreen('dashboard');
            }
          }}
          disabled={!formData.selectedFacility || !formData.selectedDate || !formData.selectedTime}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirmar Reserva
        </button>
      </div>
    </Screen>
  );

  const Historial = () => (
    <Screen title="Historial de Reservas" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-4">
        {reservations.map(reservation => (
          <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800">{reservation.facility}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                reservation.status === 'Activa' ? 'bg-green-100 text-green-800' :
                reservation.status === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reservation.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar size={16} className="mr-2" />
                {reservation.date}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock size={16} className="mr-2" />
                {reservation.time}
              </p>
            </div>
            {reservation.status === 'Activa' && (
              <button className="mt-3 text-red-600 text-sm font-medium hover:underline">
                Cancelar Reserva
              </button>
            )}
          </div>
        ))}
      </div>
    </Screen>
  );

  const Credencial = () => (
    <Screen title="Mi Credencial Digital" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg text-center">
          <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
            <QrCode size={80} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">{formData.userInfo.name}</h2>
          <p className="text-blue-100">{formData.userInfo.rut}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Información Personal</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium">{formData.userInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RUT:</span>
              <span className="font-medium">{formData.userInfo.rut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-sm">{formData.userInfo.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Credencial Activa</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Válida hasta: 31 de Diciembre, 2025
          </p>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Presenta este código QR en el acceso a las instalaciones
        </p>
      </div>
    </Screen>
  );

  const Equipamento = () => (
    <Screen title="Implementos Deportivos" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-4">
        {equipment.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {item.facility}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {item.available}/{item.total}
                </p>
                <p className="text-xs text-gray-500">Disponibles</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full ${
                  item.available > item.total * 0.5 ? 'bg-green-500' :
                  item.available > item.total * 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(item.available / item.total) * 100}%` }}
              ></div>
            </div>

            <button
              disabled={item.available === 0}
              className="w-full bg-blue-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {item.available > 0 ? 'Solicitar' : 'No Disponible'}
            </button>
          </div>
        ))}
      </div>
    </Screen>
  );

  const ProfileScreen = () => (
    <Screen title="Mi Perfil" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{formData.userInfo.name}</h2>
          <p className="text-gray-600">{formData.userInfo.rut}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              value={formData.userInfo.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
            <input
              type="text"
              value={formData.userInfo.rut}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.userInfo.email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.userInfo.phone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Guardar Cambios
          </button>

          <button className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </Screen>
  );

  // Barra de Navegación

  const Barra = () => {
    if (currentScreen === 'login') return null;
    
    return (
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center p-2 ${currentScreen === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Inicio</span>
          </button>
          <button
            onClick={() => setCurrentScreen('booking')}
            className={`flex flex-col items-center p-2 ${currentScreen === 'booking' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Reservar</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center p-2 ${currentScreen === 'history' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <History size={20} />
            <span className="text-xs mt-1">Historial</span>
          </button>
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center p-2 ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <Login />;
      case 'dashboard': return <Dashboard />;
      case 'booking': return <Reservar />;
      case 'history': return <Historial />;
      case 'credential': return <Credencial />;
      case 'equipment': return <Equipamento />;
      case 'profile': return <ProfileScreen />;
      default: return <Login />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {renderScreen()}
      <Barra />
    </div>
  );
};

export default MobileAppPrototype;