import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
console.log('APP ENV:', NODE_ENV);

const readDockerSecrets = (name: string) => {
  return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim()
}

interface ConfigType {
  app: {
    PORT: string;
    SESSION_SECRET: string;
  }

  database: {
    HOST: string;
    PORT: string;
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
  }

  aws: {
    REGION: string;
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    BUCKET_NAME: string;
  }
}

const Config: ConfigType = {
  app: {
    PORT: NODE_ENV === 'production' ? readDockerSecrets("app_port") : process.env.APP_PORT,
    SESSION_SECRET: NODE_ENV === 'production' ? readDockerSecrets("app_session_secret") : process.env.APP_SESSION_SECRET
  },
  database: {
    HOST: NODE_ENV === 'production' ? readDockerSecrets("db_host") : process.env.DB_HOST,
    PORT: NODE_ENV === 'production' ? readDockerSecrets("db_port") : process.env.DB_PORT,
    USERNAME: NODE_ENV === 'production' ? readDockerSecrets("db_username") : process.env.DB_USERNAME,
    PASSWORD: NODE_ENV === 'production' ? readDockerSecrets("db_password") : process.env.DB_PASSWORD,
    NAME: NODE_ENV === 'production' ? readDockerSecrets("db_name") : process.env.DB_NAME
  },
  aws: {
    REGION: NODE_ENV === 'production' ? readDockerSecrets("aws_region") : process.env.AWS_REGION,
    ACCESS_KEY_ID: NODE_ENV === 'production' ? readDockerSecrets("aws_access_key_id") : process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: NODE_ENV === 'production' ? readDockerSecrets("aws_secret_access_key") : process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME: NODE_ENV === 'production' ? readDockerSecrets("aws_bucket_name") : process.env.AWS_BUCKET_NAME
  }
}

export { Config };