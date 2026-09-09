'use client';

import {
  PostComment,
  withProvider,
} from '@hookpost/frontend/components/new-launch/providers/high.order.provider';
import { ListmonkDto } from '@hookpost/nestjs-libraries/dtos/posts/providers-settings/listmonk.dto';
import { Input } from '@hookpost/react/form/input';
import { useSettings } from '@hookpost/frontend/components/launches/helpers/use.values';
import { SelectList } from '@hookpost/frontend/components/new-launch/providers/listmonk/select.list';
import { SelectTemplates } from '@hookpost/frontend/components/new-launch/providers/listmonk/select.templates';

const SettingsComponent = () => {
  const form = useSettings();

  return (
    <>
      <Input label="Subject" {...form.register('subject')} />
      <Input label="Preview" {...form.register('preview')} />
      <SelectList {...form.register('list')} />
      <SelectTemplates {...form.register('template')} />
    </>
  );
};

export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: SettingsComponent,
  CustomPreviewComponent: undefined,
  dto: ListmonkDto,
  maximumCharacters: 300000,
});
