import React, { useState, useEffect } from 'react';
import { User, Home, Calendar, History, Dumbbell, Settings, ArrowLeft, QrCode, Clock, MapPin, CheckCircle, Eye, EyeOff, Users, BarChart3, Package, Plus, Minus, Edit, Trash2, Save, X } from 'lucide-react';

const MobileAppPrototype = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Base de datos simulada
  const [users] = useState([
    {
      id: 1,
      rut: '12.345.678-9',
      password: 'admin123',
      name: 'Admin Principal',
      email: 'admin@recinto.com',
      phone: '+56 9 1111 1111',
      role: 'admin'
    },
    {
      id: 2,
      rut: '98.765.432-1',
      password: 'user123',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+56 9 2222 2222',
      role: 'user'
    }
  ]);

  const [formData, setFormData] = useState({
    rut: '',
    password: '',
    selectedFacility: '',
    selectedDate: '',
    selectedStartTime: '',
    selectedEndTime: '',
    reservationHours: []
  });

  const [reservations, setReservations] = useState([
    { 
      id: 1, 
      userId: 2,
      facility: 'Cancha de Tenis 1', 
      date: '2025-07-15', 
      startTime: '14:00',
      endTime: '16:00',
      hours: ['14:00', '15:00'],
      status: 'Confirmada',
      createdAt: '2025-07-10'
    },
    { 
      id: 2, 
      userId: 2,
      facility: 'Piscina', 
      date: '2025-07-13', 
      startTime: '10:00',
      endTime: '12:00',
      hours: ['10:00', '11:00'],
      status: 'Activa',
      createdAt: '2025-07-08'
    },
    { 
      id: 3, 
      userId: 2,
      facility: 'Gimnasio', 
      date: '2025-07-08', 
      startTime: '18:00',
      endTime: '20:00',
      hours: ['18:00', '19:00'],
      status: 'Completada',
      createdAt: '2025-07-05'
    }
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Raqueta de Tenis', available: 8, total: 12, facility: 'Cancha de Tenis', price: 2000 },
    { id: 2, name: 'Pelota de Basquet', available: 5, total: 10, facility: 'Cancha de Basquet', price: 1500 },
    { id: 3, name: 'Pesas 5kg', available: 12, total: 20, facility: 'Gimnasio', price: 3000 },
    { id: 4, name: 'Flotadores', available: 15, total: 25, facility: 'Piscina', price: 1000 }
  ]);

  const facilities = ['Cancha de Tenis 1', 'Cancha de Tenis 2', 'Piscina', 'Gimnasio', 'Cancha de Fútbol'];
  const allTimeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    const user = users.find(u => u.rut === formData.rut && u.password === formData.password);
    if (user) {
      setCurrentUser(user);
      setCurrentScreen(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setFormData({ rut: '', password: '', selectedFacility: '', selectedDate: '', selectedStartTime: '', selectedEndTime: '', reservationHours: [] });
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const isTimeSlotAvailable = (facility, date, time) => {
    return !reservations.some(res => 
      res.facility === facility && 
      res.date === date && 
      res.hours.includes(time) && 
      res.status !== 'Cancelada'
    );
  };

  const handleReservation = () => {
    if (!formData.selectedFacility || !formData.selectedDate || !formData.selectedStartTime || !formData.selectedEndTime) {
      alert('Por favor complete todos los campos');
      return;
    }

    const hours = generateTimeSlots(formData.selectedStartTime, formData.selectedEndTime);
    
    // Verificar disponibilidad
    const unavailableSlots = hours.filter(hour => 
      !isTimeSlotAvailable(formData.selectedFacility, formData.selectedDate, hour)
    );

    if (unavailableSlots.length > 0) {
      alert(`Los siguientes horarios no están disponibles: ${unavailableSlots.join(', ')}`);
      return;
    }

    const newReservation = {
      id: reservations.length + 1,
      userId: currentUser.id,
      facility: formData.selectedFacility,
      date: formData.selectedDate,
      startTime: formData.selectedStartTime,
      endTime: formData.selectedEndTime,
      hours: hours,
      status: 'Confirmada',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReservations(prev => [...prev, newReservation]);
    alert('¡Reserva confirmada exitosamente!');
    setCurrentScreen('dashboard');
    setFormData(prev => ({ ...prev, selectedFacility: '', selectedDate: '', selectedStartTime: '', selectedEndTime: '', reservationHours: [] }));
  };

  const cancelReservation = (id) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'Cancelada' } : res
    ));
  };

  const updateEquipmentStock = (id, field, value) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: Math.max(0, value) } : item
    ));
  };

  const addNewEquipment = () => {
    const newItem = {
      id: equipment.length + 1,
      name: 'Nuevo Implemento',
      available: 0,
      total: 0,
      facility: 'Gimnasio',
      price: 0
    };
    setEquipment(prev => [...prev, newItem]);
    setEditingItem(newItem.id);
  };

  const deleteEquipment = (id) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const saveEquipmentChanges = (id, changes) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, ...changes } : item
    ));
    setEditingItem(null);
  };

  // Obtener reservas del usuario actual
  const getUserReservations = () => {
    return reservations.filter(res => res.userId === currentUser?.id);
  };

  const getActiveReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return getUserReservations().filter(res => 
      res.status === 'Confirmada' || res.status === 'Activa' && res.date >= today
    );
  };

  const Screen = ({ children, title, showBack = false, onBack, showLogout = false }) => (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button onClick={onBack} className="mr-3">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {showLogout && (
          <button onClick={handleLogout} className="text-sm bg-blue-700 px-3 py-1 rounded">
            Salir
          </button>
        )}
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

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Usuarios de prueba:</p>
            <p className="text-xs text-gray-500">Admin: 12.345.678-9 / admin123</p>
            <p className="text-xs text-gray-500">Usuario: 98.765.432-1 / user123</p>
          </div>
        </div>
      </div>
    </Screen>
  );

  const Dashboard = () => {
    const activeReservations = getActiveReservations();
    
    return (
      <Screen title="Inicio" showLogout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800">¡Hola, {currentUser?.name}!</h2>
            <p className="text-gray-600">Tienes {activeReservations.length} reservas activas</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Reservas Activas</h3>
            {activeReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tienes reservas activas</p>
            ) : (
              activeReservations.map(reservation => (
                <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{reservation.facility}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar size={16} className="mr-1" />
                        {reservation.date} | {reservation.startTime} - {reservation.endTime}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {reservation.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => cancelReservation(reservation.id)}
                    className="mt-2 text-red-600 text-sm hover:underline"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              ))
            )}
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
  };

  const AdminDashboard = () => (
    <Screen title="Panel Administrativo" showLogout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Panel de Control</h2>
          <p className="text-gray-600">Administrador: {currentUser?.name}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{reservations.filter(r => r.status === 'Confirmada').length}</p>
                <p className="text-sm text-gray-600">Reservas Activas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'user').length}</p>
                <p className="text-sm text-gray-600">Usuarios</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('admin-equipment')}
            className="bg-blue-600 text-white p-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
          >
            <Package size={24} className="mx-auto mb-2" />
            Gestionar Implementos
          </button>

          <button
            onClick={() => setCurrentScreen('admin-reservations')}
            className="bg-purple-600 text-white p-4 rounded-lg text-center font-medium hover:bg-purple-700 transition-colors"
          >
            <BarChart3 size={24} className="mx-auto mb-2" />
            Ver Todas las Reservas
          </button>

          <button
            onClick={() => setCurrentScreen('admin-users')}
            className="bg-green-600 text-white p-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors"
          >
            <Users size={24} className="mx-auto mb-2" />
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </Screen>
  );

  const AdminEquipment = () => (
    <Screen title="Gestión de Implementos" showBack onBack={() => setCurrentScreen('admin-dashboard')}>
      <div className="space-y-4">
        <button
          onClick={addNewEquipment}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Agregar Implemento
        </button>

        {equipment.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {editingItem === item.id ? (
              <EditEquipmentForm 
                item={item} 
                onSave={(changes) => saveEquipmentChanges(item.id, changes)}
                onCancel={() => setEditingItem(null)}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.facility}</p>
                    <p className="text-sm text-gray-600">Precio: ${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteEquipment(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Disponible</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateEquipmentStock(item.id, 'available', item.available - 1)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-medium w-8 text-center">{item.available}</span>
                      <button
                        onClick={() => updateEquipmentStock(item.id, 'available', item.available + 1)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Total</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateEquipmentStock(item.id, 'total', item.total - 1)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-medium w-8 text-center">{item.total}</span>
                      <button
                        onClick={() => updateEquipmentStock(item.id, 'total', item.total + 1)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.available > item.total * 0.5 ? 'bg-green-500' :
                      item.available > item.total * 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.total > 0 ? (item.available / item.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Screen>
  );

  const EditEquipmentForm = ({ item, onSave, onCancel }) => {
    const [editData, setEditData] = useState({ ...item });

    const handleSave = () => {
      onSave(editData);
    };

    return (
      <div className="space-y-3">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Nombre del implemento"
        />
        
        <select
          value={editData.facility}
          onChange={(e) => setEditData({ ...editData, facility: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {facilities.map(facility => (
            <option key={facility} value={facility}>{facility}</option>
          ))}
        </select>

        <input
          type="number"
          value={editData.price}
          onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) || 0 })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Precio"
        />

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700"
          >
            <Save size={16} className="inline mr-1" />
            Guardar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white p-2 rounded text-sm hover:bg-gray-700"
          >
            <X size={16} className="inline mr-1" />
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  const AdminReservations = () => (
    <Screen title="Todas las Reservas" showBack onBack={() => setCurrentScreen('admin-dashboard')}>
      <div className="space-y-4">
        {reservations.map(reservation => {
          const user = users.find(u => u.id === reservation.userId);
          return (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-800">{reservation.facility}</h3>
                  <p className="text-sm text-gray-600">Usuario: {user?.name}</p>
                  <p className="text-sm text-gray-600">RUT: {user?.rut}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  reservation.status === 'Activa' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                  reservation.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {reservation.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Fecha: {reservation.date}</p>
                <p className="text-sm text-gray-600">Horario: {reservation.startTime} - {reservation.endTime}</p>
                <p className="text-sm text-gray-600">Creada: {reservation.createdAt}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );

  const AdminUsers = () => (
    <Screen title="Gestión de Usuarios" showBack onBack={() => setCurrentScreen('admin-dashboard')}>
      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">RUT: {user.rut}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Teléfono: {user.phone}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Reservas: {reservations.filter(r => r.userId === user.id).length}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );

const Booking = () => (
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora Inicio</label>
          <select
            value={formData.selectedStartTime}
            onChange={(e) => handleInputChange('selectedStartTime', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona hora</option>
            {allTimeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora Fin</label>
          <select
            value={formData.selectedEndTime}
            onChange={(e) => handleInputChange('selectedEndTime', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona hora</option>
            {allTimeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.selectedFacility && formData.selectedDate && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Disponibilidad</h3>
          <div className="grid grid-cols-4 gap-2">
            {allTimeSlots.map(time => {
              const isAvailable = isTimeSlotAvailable(formData.selectedFacility, formData.selectedDate, time);
              return (
                <div
                  key={time}
                  className={`p-2 text-center text-xs rounded ${
                    isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {time}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleReservation}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Confirmar Reserva
        </button>
        
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="w-full bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  </Screen>
);

const ProfileScreen = () => (
  <Screen title="Mi Perfil" showBack onBack={() => setCurrentScreen('dashboard')} showLogout>
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{currentUser?.name}</h2>
        <p className="text-gray-600">{currentUser?.rut}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input
            type="text"
            value={currentUser?.name || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
          <input
            type="text"
            value={currentUser?.rut || ''}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={currentUser?.email || ''}
            onChange={(e) => {
              // Aquí podrías implementar la actualización del email si lo deseas
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={currentUser?.phone || ''}
            onChange={(e) => {
              // Aquí podrías implementar la actualización del teléfono si lo deseas
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Aquí podrías implementar la lógica para guardar cambios
            alert('Cambios guardados (simulado)');
          }}
        >
          Guardar Cambios
        </button>

        <button 
          className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          onClick={() => {
            // Aquí podrías implementar la lógica para cambiar contraseña
            setCurrentScreen('change-password');
          }}
        >
          Cambiar Contraseña
        </button>
      </div>
    </div>
  </Screen>
);


  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'booking':
        return <Booking />;
      case 'credential':
        return <Credential />;
      case 'history':
        return <HistoryScreen />;
      case 'equipment':
        return <Equipment />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin-equipment':
        return <AdminEquipment />;
      case 'admin-reservations':
        return <AdminReservations />;
      case 'admin-users':
        return <AdminUsers />;
      default:
        return <Login />;
    }
  };

  const Credential = () => (
    <Screen title="Mi Credencial" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-6 text-center">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="bg-white p-4 rounded shadow-md inline-block">
            <QrCode size={120} className="mx-auto text-blue-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{currentUser?.name}</h2>
          <p className="text-gray-600">{currentUser?.rut}</p>
          <p className="text-sm text-gray-500 mt-2">Muestra este código al ingresar a las instalaciones</p>
        </div>
      </div>
    </Screen>
  );

  const HistoryScreen = () => (
    <Screen title="Historial de Reservas" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-4">
        {getUserReservations().length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tienes reservas históricas</p>
        ) : (
          getUserReservations().map(reservation => (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{reservation.facility}</h4>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar size={16} className="mr-1" />
                    {reservation.date} | {reservation.startTime} - {reservation.endTime}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  reservation.status === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                  reservation.status === 'Activa' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {reservation.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Creada: {reservation.createdAt}</p>
            </div>
          ))
        )}
      </div>
    </Screen>
  );

  const Equipment = () => (
    <Screen title="Implementos Disponibles" showBack onBack={() => setCurrentScreen('dashboard')}>
      <div className="space-y-4">
        {equipment.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.facility}</p>
                <p className="text-sm text-gray-600">Precio: ${item.price.toLocaleString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.available} disponibles
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  item.available > item.total * 0.5 ? 'bg-green-500' :
                  item.available > item.total * 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${item.total > 0 ? (item.available / item.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );

  return (
    <div className="font-sans">
      {renderScreen()}
      
      {/* Barra de navegación(parte inferior del cel) */}
      {(currentScreen === 'dashboard' || currentScreen === 'booking' || currentScreen === 'history' || 
        currentScreen === 'equipment' || currentScreen === 'credential' || currentScreen === 'profile') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 max-w-sm mx-auto">
          <div className="flex justify-around">
            <button 
              onClick={() => setCurrentScreen('dashboard')} 
              className={`p-2 rounded-full ${currentScreen === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Home size={24} />
            </button>
            <button 
              onClick={() => setCurrentScreen('booking')} 
              className={`p-2 rounded-full ${currentScreen === 'booking' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Calendar size={24} />
            </button>
            <button 
              onClick={() => setCurrentScreen('history')} 
              className={`p-2 rounded-full ${currentScreen === 'history' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <History size={24} />
            </button>
            <button 
              onClick={() => setCurrentScreen('equipment')} 
              className={`p-2 rounded-full ${currentScreen === 'equipment' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Dumbbell size={24} />
            </button>
            <button 
              onClick={() => setCurrentScreen('profile')} 
              className={`p-2 rounded-full ${currentScreen === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <User size={24} /> {}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAppPrototype;