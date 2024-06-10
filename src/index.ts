import { Server } from 'http';

import Bluebird from 'bluebird';

import mongoose from './config/mongooseConfig';
import express from './config/expressConfig';

const handleTermination = ({ tasks }: { tasks: (() => Promise<void>)[] }) => {
  return Bluebird.mapSeries(tasks, (task) => task());
};

const startServer = async () => {
  try {
    const database = await mongoose();

    console.log('Database Connection Established');

    const app = express();

    const server: Server = await new Promise((resolve) => {
      app.listen(process.env.PORT || 8080, () => {
        console.log(`Server listening on port ${process.env.PORT || 8080}`);
        resolve(app);
      });
    });

    process.on('SIGINT', async () => {
      console.log('Performing Graceful Shutdown');

      await handleTermination({
        tasks: [
          () =>
            new Promise<void>((resolve, reject) =>
              server.close(function (err) {
                console.log('Server Shutting Down');

                if (err) return reject(err);

                resolve();
              })
            ),
          () => {
            console.log('Database Disconnected');
            return database.disconnect();
          },
          () => process.exit(0),
        ],
      });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
