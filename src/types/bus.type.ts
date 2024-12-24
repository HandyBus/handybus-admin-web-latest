import { z } from 'zod';

const phoneRegex = /^01\d\-\d{4}\-d{4}$/;

export const BusSchema = z.object({
  type: z.enum(['SEATER_12', 'SEATER_28', 'BUS_45']),
  name: z.string(),
  number: z.string(),
  phoneNumber: z.string().refine(
    (value) => phoneRegex.test(value),
    '010으로 시작하는 11자리 숫자를 입력해주세요',
    // 이렇게 메세지 커스텀을 바로 넣어줄수 있다.
  ),
  openChatLink: z.string().url(),
});

export type BusType = z.infer<typeof BusSchema>;
