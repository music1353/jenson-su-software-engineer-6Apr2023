import { getRepository } from 'typeorm';
import { Profile } from "../entities/profile";
import { Experience } from "../entities/experience";
import { File } from "../entities/file";


interface ExpType {
  profileId: number;
  title: string
  logoId: number | null;
  company: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isPresent: boolean;
}

export class ExpService {
  async insertOne(payload: ExpType): Promise<Experience> {
    const profileRepository = getRepository(Profile);
    const expRepository = getRepository(Experience);
    const fileRepository = getRepository(File);

    const profile = await profileRepository.findOne({ id: payload.profileId });
    const logo =  await fileRepository.findOne({ id: payload.logoId });

    const exp = {
      ...payload,
      profile,
      logo
    }
    const data = expRepository.create(exp);
    await expRepository.save(data);
    
    return data;
  }

  async findOne(id: string) {
    const expRepository = getRepository(Experience);
    const data = await expRepository.findOne(id, {
      relations: ['logo']
    });

    return data
  }

  async updateOne(id: string, updateData: Experience) {
    if (Object.keys(updateData).includes('logo')) {
      const fileRepository = getRepository(File);

      if (typeof updateData.logo === 'number') {
        const file = await fileRepository.findOne(updateData.logo);
        if (!file) {
          throw new Error("File not found");
        }
        
        updateData.logo = file;
      }
    }

    updateData.updatedAt = new Date();

    const expRepository = getRepository(Experience);
    await expRepository.update(id, updateData);
  }

  async deleteOne(id: string) {
    const expRepository = getRepository(Experience);
    await expRepository.delete(id);
  }
}