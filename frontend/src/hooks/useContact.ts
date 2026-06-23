import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../services/contactApi';

export const useContact = (options?: { public?: boolean }) => {
  const isPublic = options?.public;
  const queryClient = useQueryClient();
  const queryKey = isPublic ? ['contact', 'public'] : ['contact'];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['contact'] });
    queryClient.invalidateQueries({ queryKey: ['contact', 'public'] });
  };

  const { data: contact, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isPublic) {
        const res = await contactApi.getPublic();
        return res.data.data.contact;
      }
      const res = await contactApi.get();
      return res.data.data.contact;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateContact = useMutation({
    mutationFn: (data: any) => contactApi.update(data).then(r => r.data.data.contact),
    onSuccess: invalidate
  });

  const addSocialMedia = useMutation({
    mutationFn: (data: any) => contactApi.addSocialMedia(data).then(r => r.data.data.socialMedia),
    onSuccess: invalidate
  });

  const updateSocialMedia = useMutation({
    mutationFn: ({ platform, data }: { platform: string; data: any }) =>
      contactApi.updateSocialMedia(platform, data).then(r => r.data.data.socialMedia),
    onSuccess: invalidate
  });

  const deleteSocialMedia = useMutation({
    mutationFn: (platform: string) => contactApi.deleteSocialMedia(platform).then(r => r.data.data.socialMedia),
    onSuccess: invalidate
  });

  const reorderSocialMedia = useMutation({
    mutationFn: (order: string[]) => contactApi.reorderSocialMedia(order).then(r => r.data.data.socialMedia),
    onSuccess: invalidate
  });

  const updateBusinessHours = useMutation({
    mutationFn: (data: any) => contactApi.updateBusinessHours(data).then(r => r.data.data.businessHours),
    onSuccess: invalidate
  });

  const updateFormSettings = useMutation({
    mutationFn: (data: any) => contactApi.updateFormSettings(data).then(r => r.data.data.contactForm),
    onSuccess: invalidate
  });

  const updateLocation = useMutation({
    mutationFn: (data: any) => contactApi.updateLocation(data).then(r => r.data.data.location),
    onSuccess: invalidate
  });

  const updateEmergencyContact = useMutation({
    mutationFn: (data: any) => contactApi.updateEmergencyContact(data).then(r => r.data.data.emergencyContact),
    onSuccess: invalidate
  });

  return {
    contact, loading: isLoading, error, refreshContact: refetch, isFetching,
    updateContact: updateContact.mutateAsync,
    addSocialMedia: addSocialMedia.mutateAsync,
    updateSocialMedia: updateSocialMedia.mutateAsync,
    deleteSocialMedia: deleteSocialMedia.mutateAsync,
    reorderSocialMedia: reorderSocialMedia.mutateAsync,
    updateBusinessHours: updateBusinessHours.mutateAsync,
    updateFormSettings: updateFormSettings.mutateAsync,
    updateLocation: updateLocation.mutateAsync,
    updateEmergencyContact: updateEmergencyContact.mutateAsync,
  };
};
