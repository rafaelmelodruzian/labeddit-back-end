import z from 'zod';
import { CommentModel } from '../../models/Comment';

export interface GetCommentsInputDTO {
  postId: string;
  token: string;
}

export type GetCommentsOutputDTO = CommentModel[];

export const GetCommentsSchema = z.object({
  postId: z.string().min(1),
  token: z.string().min(1),
}).transform(data => data as GetCommentsInputDTO);
