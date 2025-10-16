import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
