import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'car_analysis' })
export class CarAnalysisEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.cars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  // optional but useful if you still want direct access
  @Column()
  userId!: string;

  // =========================
  // 📦 FILE STORAGE (S3 KEYS)
  // =========================

  // original uploaded image
  @Column()
  originalFileKey!: string;

  // AI processed background removed image
  @Column({ nullable: true })
  bgRemovedFileKey?: string;

  // =========================
  // 🚗 CAR DATA (AI OUTPUT)
  // =========================

  @Column({ nullable: true })
  carName?: string;

  @Column({ nullable: true })
  modelNumber?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-array', nullable: true })
  highlights?: string[];

  @Column({ type: 'text', nullable: true })
  salesPitch?: string;

  // =========================
  // 📊 PROCESS STATUS
  // =========================

  @Column({ default: 'uploaded' })
  status!: 'uploaded' | 'processing' | 'completed' | 'failed';

  // =========================
  // ⏱ TIMESTAMPS
  // =========================

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
