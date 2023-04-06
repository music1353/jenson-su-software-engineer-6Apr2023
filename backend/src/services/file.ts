import { getRepository } from 'typeorm';
import AWS from 'aws-sdk';
import path from 'path';
import crypto from 'crypto';
import { Config } from '../../config';
import { File } from '../entities/file';

const s3 = new AWS.S3({
  region: Config.aws.REGION,
  accessKeyId: Config.aws.ACCESS_KEY_ID,
  secretAccessKey: Config.aws.SECRET_ACCESS_KEY,
});
const BUCKET_NAME = Config.aws.BUCKET_NAME;

interface S3ResultType {
  key: string;
  url: string;
}

export class FileService {
  async uploadS3(name: string, buffer: Buffer, mimetype: string): Promise<S3ResultType> {
    const extname = path.extname(name);

    const hash = crypto.createHash('sha256');
    hash.update(name);
    const key = hash.digest('hex') + extname;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      Tagging: 'public=true'
    };
    const result = await s3.upload(params).promise();
    
    const resultData = {
      key: key,
      url: result.Location
    }
    return resultData;
  }

  async insertOne(key: string, name: string, uri: string, size: number, mimetype: string): Promise<File> {
    const fileRepository = getRepository(File);
    
    const data = fileRepository.create({
      key: key,
      name: name,
      uri: uri,
      size: size,
      mimetype: mimetype
    });
    await fileRepository.save(data);

    return data;
  }

  async deleteOne(id: number): Promise<void> {
    const fileRepository = getRepository(File);

    const file = await fileRepository.findOne(id);
    if (!file) {
      throw new Error(`File with id ${id} not found.`);
    }
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: file.key
    };
    await s3.deleteObject(params).promise();
    
    await fileRepository.delete(id);
  }
}