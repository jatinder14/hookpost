'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@hookpost/frontend/components/new-launch/providers/high.order.provider';
import { useSettings } from '@hookpost/frontend/components/launches/helpers/use.values';
import { PinterestBoard } from '@hookpost/frontend/components/new-launch/providers/pinterest/pinterest.board';
import { PinterestSettingsDto } from '@hookpost/nestjs-libraries/dtos/posts/providers-settings/pinterest.dto';
import { Input } from '@hookpost/react/form/input';
import { ColorPicker } from '@hookpost/react/form/color.picker';
import { PinterestPreview } from '@hookpost/frontend/components/new-launch/providers/pinterest/pinterest.preview';
const PinterestSettings: FC = () => {
  const { register, control } = useSettings();
  return (
    <div className="flex flex-col">
      <Input label={'Title'} {...register('title')} />
      <Input label={'Link'} {...register('link')} />
      <PinterestBoard {...register('board')} />
      <ColorPicker
        label="Select Pin Color"
        name="dominant_color"
        enabled={false}
        canBeCancelled={true}
      />
    </div>
  );
};
export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  comments: false,
  SettingsComponent: PinterestSettings,
  CustomPreviewComponent: PinterestPreview,
  dto: PinterestSettingsDto,
  maximumCharacters: 500,
});
