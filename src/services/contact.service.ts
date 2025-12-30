import { AdminContactResponseModelSchema } from '@/types/contact.type';
import { authInstance } from './config';
import { useQuery } from '@tanstack/react-query';

export const getContacts = async () => {
  const res = await authInstance.get('/v1/core/admin/contacts', {
    shape: {
      contacts: AdminContactResponseModelSchema.array(),
    },
  });
  return res.contacts;
};

export const useGetContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
};

export const getContact = async (contactId: string) => {
  const res = await authInstance.get(`/v1/core/admin/contacts/${contactId}`, {
    shape: {
      contact: AdminContactResponseModelSchema,
    },
  });
  return res.contact;
};

export const useGetContact = (contactId: string) => {
  return useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContact(contactId),
  });
};
