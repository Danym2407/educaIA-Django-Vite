import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ActivateAccountPage = () => {
  const { uidb64, token } = useParams();
  const [message, setMessage] = useState('Activando tu cuenta...');

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/auth/activate/${uidb64}/${token}/`);
        const data = await res.json();
        if (res.ok) {
          setMessage(data.detail || 'Cuenta activada correctamente.');
        } else {
          setMessage(data.detail || 'Enlace inválido o expirado.');
        }
      } catch (error) {
        setMessage('Ocurrió un error al activar tu cuenta.');
      }
    };
    activate();
  }, [uidb64, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-primary">Activación de Cuenta</h1>
        <p className="mb-6 text-muted-foreground">{message}</p>
        <Button asChild>
          <Link to="/auth">Ir a Iniciar Sesión</Link>
        </Button>
      </div>
    </div>
  );
};

export default ActivateAccountPage;