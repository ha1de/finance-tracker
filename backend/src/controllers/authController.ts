// backend/src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../services/prisma';
import { config } from '../config';

// --- User Registration ---
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // Explicit return
  }

  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return; // Explicit return
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    next(error);
  }
};

// --- User Login ---
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // Explicit return
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.status(401).json({ message: 'Invalid credentials' });
       return; // Explicit return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       res.status(401).json({ message: 'Invalid credentials' });
       return; // Explicit return
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    // --- FIX: Use seconds for expiresIn to match type definition (number | StringValue) ---
    // Example: '1d' = 24 hours * 60 minutes * 60 seconds
    const expiresInSeconds = 24 * 60 * 60;
    const signOptions: SignOptions = {
        // expiresIn: config.jwt.expiresIn, // This was causing type error 'string' is not 'number | StringValue | undefined'
        expiresIn: expiresInSeconds, // Use number (seconds)
    };
    const token = jwt.sign(payload, config.jwt.secret as Secret, signOptions);
    // --- END FIX ---

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    next(error);
  }
};

// --- Get Current User ---
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return; // Explicit return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, createdAt: true }
        });

        if (!user) {
             res.status(404).json({ message: 'User not found' });
             return; // Explicit return
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};