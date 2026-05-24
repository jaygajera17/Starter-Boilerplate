import express, { Application } from 'express';
import cors from 'cors';
import routes from './src/routes';
import { PORT } from './src/config/secrets';
import { globalErrorHandler } from './src/middleware/errorHandler';
import connectDB from './src/config/db';

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }

  private config() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    this.app.use('/api', routes);
  }

  private errorHandling() {
    this.app.use(globalErrorHandler);
  }

  public async start(): Promise<void> {
    await connectDB();
    this.app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV ?? 'development'} mode on port ${PORT}`,
      );
    });
  }
}

const server = new Server();
server.start();

export default server.app;
