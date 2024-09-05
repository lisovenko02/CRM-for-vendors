import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { createPromotion, getCompany, Promotion } from '../../../lib/api';
import { Form, Formik } from 'formik';
import LogoUploader from './logo-uploader';
import InputField from './input-field';
import Button from './button';

export type PromotionFieldValues = {
  title: string;
  description: string;
  discount: string | number;
};

const initialValues: PromotionFieldValues = {
  title: '',
  description: '',
  discount: '',
};
export interface PromotionFormProps {
  companyId: string;
  onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

export default function PromotionForm({
  companyId,
  onSubmit,
}: PromotionFormProps) {
  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ['companies', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 10 * 1000,
    enabled: Boolean(companyId),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPromotion,
    onSuccess: (data) => {
      queryClient.setQueryData<Promotion[]>(
        ['promotions', companyId],
        (oldData) => {
          return (oldData ?? []).concat(data);
        },
      );

      queryClient.setQueryData<Promotion[]>(['promotions'], (oldData) => {
        return (oldData ?? []).concat(data);
      });
    },
  });

  const handleSubmit = async (values: PromotionFieldValues) => {
    if (!company) {
      console.error('Company data is not available');
      return;
    }

    await mutateAsync({
      ...values,
      discount: Number(values.discount) || 0,
      companyId: company.id,
      companyTitle: company.title,
    });

    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-10">
        <p className="mb-0.5 text-xl">Add new promotion</p>
        <div className="flex flex-col gap-5">
          <InputField required label="Title" placeholder="Title" name="title" />
          <InputField
            required
            label="Description"
            placeholder="Description"
            name="description"
          />
          <InputField
            required
            type="number"
            label="Discount"
            placeholder="Discount"
            name="discount"
          />
          <LogoUploader
            square={true}
            label="Image"
            placeholder="Upload photo"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Add promotion
        </Button>
      </Form>
    </Formik>
  );
}
