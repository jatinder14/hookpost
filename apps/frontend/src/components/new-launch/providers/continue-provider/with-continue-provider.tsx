'use client';

import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import { Button } from '@hookpost/react/form/button';
import { useT } from '@hookpost/react/translation/get.transation.service.client';
import { useCustomProviderFunction } from '@hookpost/frontend/components/launches/helpers/use.custom.provider.function';

const SWR_OPTIONS = {
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
  refreshInterval: 0,
};

export interface ContinueProviderProps {
  onSave: (data: any) => Promise<void>;
  existingId: string[];
  initialData?: any[];
  isSaving?: boolean;
}

export interface EmptyStateMessage {
  key: string;
  text: string;
}

export interface ContinueProviderConfig<TItem, TSelection> {
  endpoint: string;
  swrKey: string;
  titleKey: string;
  titleDefault: string;
  emptyStateMessages: EmptyStateMessage[];
  getSelectionValue: (item: TItem) => TSelection;
  transformSaveData: (selection: TSelection) => any;
  renderItem: (item: TItem, isSelected: boolean) => ReactNode;
  isSelected: (item: TItem, selection: TSelection | null) => boolean;
  getItemId: (item: TItem) => string;
}

export function withContinueProvider<TItem, TSelection>(
  config: ContinueProviderConfig<TItem, TSelection>
): FC<ContinueProviderProps> {
  const {
    endpoint,
    swrKey,
    titleKey,
    titleDefault,
    emptyStateMessages,
    getSelectionValue,
    transformSaveData,
    renderItem,
    isSelected,
    getItemId,
  } = config;

  return function ContinueProviderComponent(props: ContinueProviderProps) {
    const { onSave, existingId, initialData, isSaving } = props;
    const call = useCustomProviderFunction();
    const t = useT();
    const [selections, setSelections] = useState<TSelection[]>([]);

    const loadData = useCallback(async () => {
      // Skip fetch if initial data was provided
      if (initialData) {
        return initialData;
      }
      try {
        return await call.get(endpoint);
      } catch (e) {
        // Handle error silently
      }
    }, [initialData]);

    const { data, isLoading } = useSWR(
      initialData ? null : swrKey,
      loadData,
      SWR_OPTIONS
    );

    const resolvedData = initialData || data;

    const filteredData = useMemo(() => {
      return (
        (resolvedData as TItem[])?.filter(
          (item) => !existingId.includes(getItemId(item))
        ) || []
      );
    }, [resolvedData, existingId]);

    const handleToggle = useCallback(
      (item: TItem) => () => {
        setSelections((prev) => {
          const exists = prev.some((s) => isSelected(item, s));
          if (exists) {
            return prev.filter((s) => !isSelected(item, s));
          } else {
            return [...prev, getSelectionValue(item)];
          }
        });
      },
      [isSelected, getSelectionValue]
    );

    const isAllSelected = useMemo(() => {
      return (
        filteredData.length > 0 &&
        filteredData.every((item) =>
          selections.some((s) => isSelected(item, s))
        )
      );
    }, [filteredData, selections, isSelected]);

    const handleToggleAll = useCallback(() => {
      if (isAllSelected) {
        setSelections([]);
      } else {
        setSelections(filteredData.map(getSelectionValue));
      }
    }, [isAllSelected, filteredData, getSelectionValue]);

    const handleSave = useCallback(async () => {
      if (!selections.length) return;
      if (selections.length === 1) {
        await onSave(transformSaveData(selections[0]));
      } else {
        await onSave({ items: selections.map(transformSaveData) });
      }
    }, [onSave, selections, transformSaveData]);

    if (!isLoading && !resolvedData?.length) {
      return (
        <div className="text-center flex flex-col justify-center items-center text-[18px] leading-[26px] h-[300px]">
          {emptyStateMessages.map((msg, index) => (
            <span key={msg.key}>
              {t(msg.key, msg.text)}
              {index < emptyStateMessages.length - 1 && (
                <>
                  <br />
                  <br />
                </>
              )}
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <div className="font-medium text-[15px]">
            {t(titleKey, titleDefault)}
          </div>
          {filteredData.length > 1 && (
            <button
              type="button"
              className="text-xs text-primary hover:underline font-semibold cursor-pointer focus:outline-none"
              onClick={handleToggleAll}
            >
              {isAllSelected
                ? t('deselect_all', 'Deselect All')
                : t('select_all', 'Select All')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 justify-items-center select-none cursor-pointer gap-[10px]">
          {filteredData.map((item) => {
            const selected = selections.some((s) => isSelected(item, s));
            return (
              <div
                key={getItemId(item)}
                className={clsx(
                  'relative flex flex-col w-full text-center gap-[10px] border border-input p-[10px] hover:bg-seventh rounded-[8px] transition-all cursor-pointer select-none',
                  selected && 'bg-seventh border-primary ring-1 ring-primary'
                )}
                onClick={handleToggle(item)}
              >
                <div
                  className={clsx(
                    'absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all',
                    selected
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border/80 bg-background/50 opacity-60'
                  )}
                >
                  {selected && (
                    <svg
                      className="w-3 h-3 stroke-current stroke-[3] fill-none"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {renderItem(item, selected)}
              </div>
            );
          })}
        </div>
        <div>
          <Button
            disabled={!selections.length || isSaving}
            loading={isSaving}
            onClick={handleSave}
          >
            {selections.length > 1
              ? `${t('connect_selected', 'Connect Selected')} (${selections.length})`
              : t('save', 'Save')}
          </Button>
        </div>
      </div>
    );
  };
}
