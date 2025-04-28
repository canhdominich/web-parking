import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Tên bảng trong cơ sở dữ liệu
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number; // Khóa chính, tự tăng

  @Column({ type: 'varchar', length: 15 })
  phone: string; // Số điện thoại

  @Column({ type: 'varchar', length: 255 })
  email: string; // Email

  @Column({ type: 'varchar', length: 255 })
  password: string; // Mã hóa mật khẩu

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // Ngày tạo tài khoản
}
