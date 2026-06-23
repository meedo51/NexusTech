import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/api';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.get();
      return res.data.data.user;
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { fullName?: string; username?: string; preferences?: any }) => {
      const res = await profileApi.update(data);
      return res.data.data.user;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] })
  });

  const changeEmail = useMutation({
    mutationFn: async (data: { newEmail: string; password: string }) => {
      const res = await profileApi.changeEmail(data);
      return res.data;
    }
  });

  const changePassword = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const res = await profileApi.changePassword(data);
      return res.data;
    }
  });

  const enableTwoFactor = useMutation({
    mutationFn: async () => {
      const res = await profileApi.enable2FA();
      return res.data.data;
    }
  });

  const verifyTwoFactor = useMutation({
    mutationFn: async (code: string) => {
      const res = await profileApi.verify2FA(code);
      return res.data;
    }
  });

  const disableTwoFactor = useMutation({
    mutationFn: async (data: { password: string; code: string }) => {
      const res = await profileApi.disable2FA(data);
      return res.data;
    }
  });

  const getBackupCodes = useMutation({
    mutationFn: async () => {
      const res = await profileApi.getBackupCodes();
      return res.data.data.backupCodes;
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutateAsync,
    changeEmail: changeEmail.mutateAsync,
    changePassword: changePassword.mutateAsync,
    enableTwoFactor: enableTwoFactor.mutateAsync,
    verifyTwoFactor: verifyTwoFactor.mutateAsync,
    disableTwoFactor: disableTwoFactor.mutateAsync,
    getBackupCodes: getBackupCodes.mutateAsync,
    loading: updateProfile.isPending || changePassword.isPending
  };
};
