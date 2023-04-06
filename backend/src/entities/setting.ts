import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Profile } from "./profile";

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  isPass: boolean;

  @Column({ default: '' })
  passCode: string;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}