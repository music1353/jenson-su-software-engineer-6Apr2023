import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum AuthType {
  GOOGLE = 'google',
  EMAIL = 'email',
}

@Entity({ name: 'auths' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  uid: string;

  @Column()
  identifier: string;

  @Column()
  credential: string;

  @Column({ type: 'enum', enum: AuthType })
  authType: string;

  @Column()
  username: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}