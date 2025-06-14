import { Connection, createConnection } from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<Connection> => {
      const conn = await createConnection('mongodb://localhost/personal-horoscope').asPromise();
      console.log('Database connection established');
      return conn;
    },
  },
];
