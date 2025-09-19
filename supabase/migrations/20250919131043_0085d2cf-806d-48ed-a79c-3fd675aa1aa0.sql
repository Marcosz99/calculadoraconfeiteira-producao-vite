-- Reset all users to free plan for testing
UPDATE profiles SET plano = 'free' WHERE plano = 'professional';