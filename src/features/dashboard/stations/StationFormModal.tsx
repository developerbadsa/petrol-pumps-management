'use client';

import Modal from '@/components/ui/modal/Modal';
import StationForm, {type Mode} from './StationForm';
import type {StationUpsertPayload} from './formData';

export default function StationFormModal({
   open,
   mode,
   stationId,
   saving,
   error,
   onClose,
   onSubmit,
}: {
   open: boolean;
   mode: Mode;
   stationId?: string | null;
   saving?: boolean;
   error?: string;
   onClose: () => void;
   onSubmit: (payload: StationUpsertPayload) => void;
}) {
   const title =
      mode === 'create'
         ? 'Create Station'
         : mode === 'edit'
         ? 'Edit Station'
         : 'View Station';

   return (
      <Modal
         open={open}
         title={title}
         onClose={onClose}
         maxWidthClassName='max-w-[980px]'>
         <div className='p-5'>
            <StationForm
               mode={mode}
               stationId={stationId}
               saving={saving}
               error={error}
               onCancel={onClose}
               onSubmit={onSubmit}
               enabled={open}
            />
         </div>
      </Modal>
   );
}
