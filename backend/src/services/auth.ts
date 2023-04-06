import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { Auth } from "../entities/auth";

export class AuthService {
  private saltRounds = 10;

  async create(identifier: string, credential: string, username: string): Promise<Auth> {
    const authRepository = getRepository(Auth);
    
    const data = authRepository.create({
      uid: uuidv4(),
      identifier: identifier,
      credential: await bcrypt.hash(credential, this.saltRounds),
      authType: 'email',
      username: username
    });
    await authRepository.save(data);
    
    return data;
  }
  
  async getAuthenticatedData(identifier: string, credential: string): Promise<Auth | null> {
    const authRepository = getRepository(Auth);

    const auth = await authRepository.findOne({ identifier });
    if (!auth) {
      throw new Error('Invalid identifier or password');
    }

    const passwordMatches = await bcrypt.compare(credential, auth.credential);
    if (!passwordMatches) {
      throw new Error('Invalid identifier or password');
    }

    delete auth.credential;
    return auth;
  }

  async findOne(uid: string): Promise<Auth | null> {
    const authRepository = getRepository(Auth);

    const auth = await authRepository.findOne({ uid });
    if (!auth) {
      throw new Error('Cannot find the auth data.');
    }

    delete auth.credential;
    return auth;
  }

  async checkIsAccountExist(identifier: string): Promise<boolean> {
    const authRepository = getRepository(Auth);

    const count = await authRepository.count({ identifier });
    return count > 0;
  }
}