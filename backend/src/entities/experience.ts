import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { File } from "./file";
import { Profile } from "./profile";

@Entity({ name: 'experiences' })
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.experiences)
  profile: Profile;

  @Column()
  title: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: "logoId" })
  logo: File | null = null;

  @Column()
  company: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  startYear: string;

  @Column({ default: '' })
  startMonth: string;

  @Column({ default: '' })
  endYear: string;

  @Column({ default: '' })
  endMonth: string;

  @Column({ default: false })
  isPresent: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
