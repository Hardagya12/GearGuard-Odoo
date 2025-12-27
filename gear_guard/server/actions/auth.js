'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-dev-secret-do-not-use-in-prod'
);

const COOKIE_NAME = 'session';

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function signup(formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role') || 'EMPLOYEE';

    if (!email || !password || !name) {
      return { success: false, error: 'Missing required fields' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create session
    const session = await encrypt({ id: user.id, email: user.email, role: user.role });
    
    // In Next 15+, cookies() is async
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function login(formData) {
  try {
      const email = formData.get('email');
      const password = formData.get('password');

      if (!email || !password) {
          return { success: false, error: 'Missing credentials' };
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
          return { success: false, error: 'Invalid credentials' };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
          return { success: false, error: 'Invalid credentials' };
      }

      const session = await encrypt({ id: user.id, email: user.email, role: user.role });
      
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, session, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
      });

      return { success: true };
  } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to login' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}
