-- Atualizar plano do desenvolvedor para professional permanentemente
UPDATE profiles 
SET plano = 'professional', updated_at = now() 
WHERE email = 'marcossantos13690@gmail.com';