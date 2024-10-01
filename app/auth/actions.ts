'use server'

import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export async function registerUser(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = 'USER' // Set default role to USER

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    })

    logger.info(`User registered: ${user.email}`)
  } catch (error) {
    logger.error(`Error in registration: ${error}`)
    throw error
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ id: string, name: string | null, email: string, role: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    logger.error(`Unexpected error during login: ${error}`)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    })
    return users
  } catch (error) {
    logger.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
    logger.info(`User role updated: ${updatedUser.email} - New role: ${newRole}`)
    return updatedUser
  } catch (error) {
    logger.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

export async function toggleDarkMode(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { darkMode: !user.darkMode },
    })

    logger.info(`Dark mode toggled for user: ${updatedUser.email}`)
    return updatedUser.darkMode
  } catch (error) {
    logger.error('Error toggling dark mode:', error)
    throw new Error('Failed to toggle dark mode')
  }
}

export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        darkMode: true,
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    logger.error('Error fetching user data:', error)
    throw new Error('Failed to fetch user data')
  }
}
