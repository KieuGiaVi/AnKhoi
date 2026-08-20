import { usersService } from '../../src/modules/users/users.service';
import { UserModel } from '../../src/modules/users/user.model';
import { PatientProfileModel } from '../../src/modules/users/patientProfile.model';
import { Role } from '../../src/common/types';

describe('users.service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWalkInPatient', () => {
    it('should create walk-in patient with is_temp: true and patient profile', async () => {
      jest.spyOn(usersService, 'findUserByPhone').mockResolvedValue(null);
      jest.spyOn(UserModel, 'create').mockResolvedValue({
        _id: '507f1f77bcf86cd799439033',
        ho_ten: 'Khách Khám Ngang',
        sdt: '0912345678',
        role: Role.PATIENT,
        is_temp: true,
      } as any);
      jest.spyOn(PatientProfileModel, 'create').mockResolvedValue({
        _id: 'prof-walkin-1',
        user_id: '507f1f77bcf86cd799439033',
        ma_the_bhyt: 'DN999888777',
        muc_huong: 80,
      } as any);

      const result = await usersService.createWalkInPatient({
        ho_ten: 'Khách Khám Ngang',
        sdt: '0912345678',
        ma_the_bhyt: 'DN999888777',
      });

      expect(result.user.is_temp).toBe(true);
      expect(result.user.role).toBe(Role.PATIENT);
      expect(result.profile.ma_the_bhyt).toBe('DN999888777');
    });

    it('should throw 400 PHONE_EXISTS if walk-in phone already exists', async () => {
      jest.spyOn(usersService, 'findUserByPhone').mockResolvedValue({ _id: 'existing-id' } as any);

      await expect(
        usersService.createWalkInPatient({
          ho_ten: 'Khách Trùng Số',
          sdt: '0912345678',
        })
      ).rejects.toThrow(
        expect.objectContaining({
          statusCode: 400,
          errorCode: 'PHONE_EXISTS',
        })
      );
    });
  });

  describe('updatePatientProfile', () => {
    it('should update vital signs and BHYT card number', async () => {
      const mockProfile = {
        _id: 'prof-1',
        user_id: 'user-1',
        chi_so_sinh_ton: { mach: 75, huyet_ap: '120/80' },
        ma_the_bhyt: 'OLD123',
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(PatientProfileModel, 'findOne').mockResolvedValue(mockProfile as any);

      const result = await usersService.updatePatientProfile('user-1', {
        chi_so_sinh_ton: { mach: 80, huyet_ap: '125/82' },
        ma_the_bhyt: 'NEW456',
      });

      expect(mockProfile.save).toHaveBeenCalled();
      expect(result.chi_so_sinh_ton?.mach).toBe(80);
      expect(result.ma_the_bhyt).toBe('NEW456');
    });
  });
});
