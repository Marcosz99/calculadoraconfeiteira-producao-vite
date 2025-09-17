import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { db } from './db'
import { profiles } from './schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface User {
  id: string
  email: string
  nome: string
  plano?: string // opcional
}

// === Helpers de senha e token ===
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    nome: user.nome,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify JWT:', error)
    return null
  }
}

// === Cadastro (signUp) ===
export async function signUp(email: string, password: string, nome: string) {
  try {
    // Verificar se email já existe
    const existingUser = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('Email já cadastrado')
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Criar usuário
    const [newUser] = await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        email,
        nome,
        password: hashedPassword,
        plano: 'free', // opcional, se existir no schema
      })
      .returning({
        id: profiles.id,
        email: profiles.email,
        nome: profiles.nome,
        plano: profiles.plano,
      })

    // Gerar token
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      nome: newUser.nome,
      plano: newUser.plano,
    })

    return { user: newUser, token }
  } catch (error) {
    console.error('Erro no cadastro:', error)
    throw error
  }
}

// === Login (signIn) ===
export async function signIn(email: string, password: string) {
  try {
    const [user] = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        nome: profiles.nome,
        password: profiles.password,
        plano: profiles.plano,
      })
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1)

    if (!user) {
      throw new Error('Email ou senha incorretos')
    }

    const isValid = await verifyPassword(password, user.password || '')
    if (!isValid) {
      throw new Error('Email ou senha incorretos')
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      nome: user.nome,
      plano: user.plano,
    })

    return { user, token }
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

// === Pegar usuário logado ===
export async function getCurrentUser(token: string) {
  try {
    const decoded = await verifyToken(token)
    if (!decoded) return null

    const [user] = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        nome: profiles.nome,
        plano: profiles.plano,
      })
      .from(profiles)
      .where(eq(profiles.id, decoded.userId))
      .limit(1)

    return user || null
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }
}
