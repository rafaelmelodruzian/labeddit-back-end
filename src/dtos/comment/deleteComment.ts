import z from 'zod'

export interface DeleteCommentInputDTO {
  token: string;
  commentId: string;
}

export type DeleteCommentOutputDTO = undefined;

export const DeleteCommentSchema = z.object({
  token: z.string().min(1),
  commentId: z.string().min(1),
}).transform((data) => data as DeleteCommentInputDTO);

