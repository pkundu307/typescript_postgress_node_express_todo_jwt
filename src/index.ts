import express, { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
declare global {
    namespace Express {
      interface Request {
        user?: { userId: number };
      }
    }
  }
  
// Secret key for signing JWT tokens
const JWT_SECRET = 'Prasanna';

app.use(express.json());

// Register a user
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400).json({ error: 'Failed to register user' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login a user
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({where:{email}})
        if (!user) {
            res.status(400).json({ error: 'User not found' });
        }
       if(user!=null){ const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            res.status(400).json({ error: 'Invalid password' });
        }
       
       
       }
       let token;
       if(user!=null){  token = jwt.sign({ userId: user.id, }, JWT_SECRET)}
       res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login user' });
        
    }

})

// Middleware to authenticate and verify the JWT token
const authenticateToken: express.RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ error: 'Access token missing' });
      return; // Explicitly return to terminate the function
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' });
        return; // Explicitly return to terminate the function
      }
  
      // Attach user information to request
      req.user = decoded as { userId: number }; // Extend Request type for user
      next(); // Pass control to the next middleware
    });
  };
  
  
app.post('/api/todos', authenticateToken,async (req: Request, res: Response) => {
    
    const { title, 
        
     } = req.body;
  const userId = (req as any).user.userId;
    // Validate input
    if (!title || !userId) {
  
    }
  
    try {
      // Create a new Todo
      const todo = await prisma.todo.create({
        data: {
          title,
          userId, // Associate the Todo with the user
        },
      });
  
      res.status(201).json(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  });

app.get('/api/todos', authenticateToken, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    try {
      // Fetch all Todos associated with the user
      const todos = await prisma.todo.findMany({
        where: { userId,completed: false },
      });
      res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
        }
})
  

// Protected route example
app.get('/protected', (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
