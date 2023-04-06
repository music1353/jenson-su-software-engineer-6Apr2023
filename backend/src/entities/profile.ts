import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Auth } from "./auth";
import { File } from "./file";
import { Experience } from "./experience";
import { Setting } from "./setting";

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Auth)
  @JoinColumn({ name: "authId" })
  auth: Auth;
  
  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: "avatarId" })
  avatar: File | null = null;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: null, nullable: true })
  age: number | null;

  @OneToMany(() => Experience, (experience) => experience.profile)
  experiences: Experience[];

  @OneToOne(() => Setting)
  @JoinColumn({ name: "settingId" })
  setting: Setting;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
