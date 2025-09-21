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
    if (migrationStatus.isCompleted || migrationService.isMigrationCompleted(user.id)) {
      setMigrationStatus(prev => ({
        ...prev,
        isLoading: false,
        isCompleted: true,
        hasError: false
      }));
      return;
    }

    // Prevent multiple migrations
    if (migrationStatus.isLoading) return;

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

          // Show toast only once when migration completes
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
        }
      } catch (error) {
        console.error('Erro na migração:', error);
        setMigrationStatus({
          isLoading: false,
          isCompleted: false,
          hasError: true
        });
      }
    };

    // Only perform migration if not already done or in progress
    const timer = setTimeout(performMigration, 2000);

    return () => clearTimeout(timer);
  }, [user?.id]); // Removed toast from dependencies to prevent infinite loop

  return migrationStatus;
}