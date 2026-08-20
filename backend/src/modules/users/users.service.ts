import { UserModel, IUserDocument } from './user.model';
import { PatientProfileModel, IPatientProfileDocument } from './patientProfile.model';
import { CreateUserDTO, CreateWalkInPatientDTO, UpdatePatientProfileDTO } from './users.types';
import { Role } from '../../common/types';
import { AppError } from '../../common/errors/AppError';

export class UsersService {
  async findUserByPhone(sdt: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ sdt });
  }

  async findUserByEmail(email: string, includePassword = false): Promise<IUserDocument | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+mat_khau_hash');
    }
    return query.exec();
  }

  async findUserById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async createUserWithPatientProfile(dto: CreateUserDTO): Promise<{ user: IUserDocument; profile: IPatientProfileDocument }> {
    const role = dto.role || Role.PATIENT;

    const user = await UserModel.create({
      ho_ten: dto.ho_ten,
      sdt: dto.sdt,
      email: dto.email ? dto.email.toLowerCase() : undefined,
      mat_khau_hash: dto.mat_khau,
      role,
      is_temp: dto.is_temp || false,
      chuyen_khoa: dto.chuyen_khoa,
    });

    let profile: IPatientProfileDocument;
    if (role === Role.PATIENT) {
      profile = await PatientProfileModel.create({
        user_id: user._id.toString(),
        muc_huong: 80,
      });
    } else {
      profile = null as any;
    }

    return { user, profile };
  }

  async createWalkInPatient(dto: CreateWalkInPatientDTO): Promise<{ user: IUserDocument; profile: IPatientProfileDocument }> {
    if (dto.sdt) {
      const existing = await this.findUserByPhone(dto.sdt);
      if (existing) {
        throw new AppError('Số điện thoại đã tồn tại trong hệ thống', 400, 'PHONE_EXISTS');
      }
    }

    const user = await UserModel.create({
      ho_ten: dto.ho_ten,
      sdt: dto.sdt,
      role: Role.PATIENT,
      is_temp: true,
    });

    const profile = await PatientProfileModel.create({
      user_id: user._id.toString(),
      ma_the_bhyt: dto.ma_the_bhyt,
      muc_huong: dto.ma_the_bhyt ? 80 : 0,
    });

    return { user, profile };
  }

  async getPatientProfileByUserId(userId: string): Promise<{ user: IUserDocument; profile: IPatientProfileDocument }> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404, 'USER_NOT_FOUND');
    }

    let profile = await PatientProfileModel.findOne({ user_id: userId }).populate('danh_sach_di_ung');
    if (!profile && user.role === Role.PATIENT) {
      profile = await PatientProfileModel.create({ user_id: userId, muc_huong: 80 });
    }

    return { user, profile: profile! };
  }

  async updatePatientProfile(userId: string, dto: UpdatePatientProfileDTO): Promise<IPatientProfileDocument> {
    let profile = await PatientProfileModel.findOne({ user_id: userId });
    if (!profile) {
      profile = new PatientProfileModel({ user_id: userId });
    }

    if (dto.chi_so_sinh_ton) {
      profile.chi_so_sinh_ton = {
        ...profile.chi_so_sinh_ton,
        ...dto.chi_so_sinh_ton,
      };
    }

    if (dto.ma_the_bhyt !== undefined) {
      profile.ma_the_bhyt = dto.ma_the_bhyt;
    }

    if (dto.danh_sach_di_ung !== undefined) {
      profile.danh_sach_di_ung = dto.danh_sach_di_ung as any;
    }

    await profile.save();
    return profile;
  }
}

export const usersService = new UsersService();
