// Data Migration Hook - Automatically migrate localStorage to Supabase
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { migrationService } from '@/services/supabaseMigration';
import { useToast } from '@/hooks/use-toast';

export function useDataMigration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [migrationStatus, setMigrationStatus] = useState<{
    isLoading: boolean;
    isCompleted: boolean;
    hasError: boolean;
  }>({
    isLoading: false,
    isCompleted: false,
    hasError: false
  });

  useEffect(() => {
    if (!user?.id) return;

    // Check if migration already completed
    if (migrationService.isMigrationCompleted(user.id)) {
      setMigrationStatus({
        isLoading: false,
        isCompleted: true,
        hasError: false
      });
      return;
    }

    // Auto-migrate data on login
    const performMigration = async () => {
      setMigrationStatus({
        isLoading: true,
        isCompleted: false,
        hasError: false
      });

      try {
        const result = await migrationService.migrateAllUserData(user.id);
        
        if (result.success) {
          setMigrationStatus({
            isLoading: false,
            isCompleted: true,
            hasError: false
          });

          toast({
            title: "Dados migrados com sucesso!",
            description: "Seus dados foram transferidos para a nuvem.",
          });
        } else {
          setMigrationStatus({
            isLoading: false,
            isCompleted: false,
            hasError: true
          });

          toast({
            title: "Migração parcial",
            description: "Alguns dados foram migrados. Verifique o console para detalhes.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro na migração:', error);
        setMigrationStatus({
          isLoading: false,
          isCompleted: false,
          hasError: true
        });

        toast({
          title: "Erro na migração",
          description: "Houve um problema ao migrar seus dados. Tente novamente.",
          variant: "destructive",
        });
      }
    };

    // Only perform migration if not already done
    const timer = setTimeout(performMigration, 2000); // Delay to ensure user is fully loaded

    return () => clearTimeout(timer);
  }, [user?.id, toast]);

  return migrationStatus;
}