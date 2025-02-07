'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const revalidateAllPath = async () => {
  revalidatePath('/', 'layout');
  redirect('/login');
};

export default revalidateAllPath;
