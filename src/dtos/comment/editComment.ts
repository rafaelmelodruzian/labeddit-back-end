import z from 'zod'

export interface EditCommentInputDTO {
  content: string;
  token: string;
  commentId: string;
}

export type EditCommentOutputDTO = undefined;

export const EditCommentSchema = z.object({
  content: z.string().min(1),
  token: z.string().min(1),
  commentId: z.string().min(1),
}).transform((data) => data as EditCommentInputDTO);