import { getRepository } from 'typeorm';
import { Auth } from "../entities/auth";
import { Profile } from "../entities/profile";
import { Setting } from "../entities/setting";
import { File } from "../entities/file";

export class ProfileService {
  async create(uid: string, name: string): Promise<Profile> {
    const authRepository = getRepository(Auth);
    const auth = await authRepository.findOne({ uid });

    const settingRepository = getRepository(Setting);
    const setting = settingRepository.create();
    await settingRepository.save(setting);
    
    const profileRepository = getRepository(Profile);
    const data = profileRepository.create({
      auth: auth,
      setting: setting,
      name: name
    });
    await profileRepository.save(data);
    
    return data;
  }

  async findOneByUid(uid: string) {
    const authRepository = getRepository(Auth);
    const auth = await authRepository.findOne({ uid });

    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({
      where: { auth },
      relations: ['avatar', 'experiences', 'experiences.logo', 'setting']
    });

    return profile;
  }

  async updateOne(id: number, updateData: Profile) {
    if (Object.keys(updateData).includes('avatar')) {
      const fileRepository = getRepository(File);

      if (typeof updateData.avatar === 'number') {
        const file = await fileRepository.findOne(updateData.avatar);
        if (!file) {
          throw new Error("File not found");
        }
        updateData.avatar = file;
      }
    }

    updateData.updatedAt = new Date();

    const profileRepository = getRepository(Profile);
    await profileRepository.update(id, updateData);
  }

  async updateOneSetting(profileId: number, updateData: Setting) {
    updateData.updatedAt = new Date();

    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne(profileId, {
      relations: ['setting']
    });
    
    const settingRepository = getRepository(Setting);
    await settingRepository.update(profile.setting.id, updateData);
  }
}