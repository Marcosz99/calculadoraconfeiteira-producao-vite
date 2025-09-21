// Supabase Data Hook - Replace localStorage with Supabase
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { migrationService } from '@/services/supabaseMigration';
import type { Receita, IngredienteUsuario, Cliente } from '@/types';

export function useReceitas() {
  const { user } = useAuth();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchReceitas = async () => {
      try {
        const data = await migrationService.getReceitas(user.id);
        setReceitas(data);
      } catch (error) {
        console.error('Erro ao buscar receitas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceitas();
  }, [user?.id]);

  const refreshReceitas = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const data = await migrationService.getReceitas(user.id);
    setReceitas(data);
    setLoading(false);
  };

  return { receitas, loading, refreshReceitas };
}

export function useIngredientes() {
  const { user } = useAuth();
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchIngredientes = async () => {
      try {
        const data = await migrationService.getIngredientes(user.id);
        setIngredientes(data);
      } catch (error) {
        console.error('Erro ao buscar ingredientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientes();
  }, [user?.id]);

  const refreshIngredientes = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const data = await migrationService.getIngredientes(user.id);
    setIngredientes(data);
    setLoading(false);
  };

  return { ingredientes, loading, refreshIngredientes };
}

export function useClientes() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchClientes = async () => {
      try {
        const data = await migrationService.getClientes(user.id);
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [user?.id]);

  const refreshClientes = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const data = await migrationService.getClientes(user.id);
    setClientes(data);
    setLoading(false);
  };

  return { clientes, loading, refreshClientes };
}