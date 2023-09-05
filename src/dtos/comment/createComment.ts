import z from 'zod';

export interface CreateCommentInputDTO {
  post_id: string;
  content: string;
  token: string;
}

export type CreateCommentOutputDTO = undefined;

export const CreateCommentSchema = z.object({
  post_id: z.string().min(1),
  content: z.string().min(1),
  token: z.string().min(1),
}).transform((data) => data as CreateCommentInputDTO);
