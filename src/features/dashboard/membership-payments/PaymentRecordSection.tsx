'use client';

import { useMemo, useState } from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import Loader from '@/components/shared/Loader';
import {
  useCreatePaymentRecord,
  useDeletePaymentRecord,
  usePaymentRecords,
  useUnverifiedStationOptions,
} from './queries';
import type { PaymentRecordRow } from './types';

const PAYMENT_METHODS = ['VISA', 'bKash', 'Nagad', 'Rocket', 'Mastercard', 'Amex'];

const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export default function PaymentRecordSection() {
  const recordsQ = usePaymentRecords();
  const stationsQ = useUnverifiedStationOptions(true);
  const createM = useCreatePaymentRecord();
  const deleteM = useDeletePaymentRecord();

  const [stationId, setStationId] = useState('');
  const [stationSearch, setStationSearch] = useState('');
  const [bankName, setBankName] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [note, setNote] = useState('');
  const [paymentDoc, setPaymentDoc] = useState<File | null>(null);
  const [formError, setFormError] = useState('');

  const stationOptions = stationsQ.data ?? [];
  const loadingStations = stationsQ.isLoading;

  const columns = useMemo<ColumnDef<PaymentRecordRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[80px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'station',
        header: 'Station',
        sortable: true,
        sortValue: (r) => r.stationName,
        headerClassName: 'w-[220px]',
        csvHeader: 'Station',
        csvValue: (r) => r.stationName,
        cell: (r) => (
          <span className="text-[#2B3A4A]">
            {r.stationName}
            {r.stationId ? ` (ID: ${r.stationId})` : ''}
          </span>
        ),
      },
      {
        id: 'bank',
        header: 'Bank Name',
        sortable: true,
        sortValue: (r) => r.bankName,
        csvHeader: 'Bank Name',
        csvValue: (r) => r.bankName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.bankName}</span>,
      },
      {
        id: 'amount',
        header: 'Amount',
        sortable: true,
        sortValue: (r) => r.amountPaid,
        align: 'right',
        headerClassName: 'w-[120px]',
        csvHeader: 'Amount Paid',
        csvValue: (r) => r.amountPaid,
        cell: (r) => <span className="text-[#133374]">{money(r.amountPaid)}</span>,
      },
      {
        id: 'note',
        header: 'Note',
        sortable: false,
        csvHeader: 'Note',
        csvValue: (r) => r.note,
        cell: (r) => (
          <span className="block max-w-[220px] truncate text-[#2B3A4A]">
            {r.note || '—'}
          </span>
        ),
      },
      {
        id: 'doc',
        header: 'Document',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Document',
        csvValue: (r) => r.paymentDocUrl ?? '',
        cell: (r) =>
          r.paymentDocUrl ? (
            <a
              href={r.paymentDocUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold text-[#133374] hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-[11px] text-[#94A3B8]">No file</span>
          ),
      },
      {
        id: 'delete',
        header: 'Delete',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[120px]',
        csvHeader: 'Delete',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => deleteM.mutate(r.id)}
            disabled={deleteM.isPending}
            className="h-7 rounded-[4px] bg-[#FC7160] px-4 text-[11px] font-semibold text-white shadow-sm disabled:opacity-60"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [deleteM.isPending]);

  return (
    <div className="space-y-6">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Gas Station&apos;s Payment
      </h2>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[12px] border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-[14px] font-semibold text-[#2B3A4A]">
            Payment Information
          </h3>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setFormError('');

              if (!stationId.trim()) {
                setFormError('Station ID is required');
                return;
              }
              const amountNum = Number(amountPaid);
              if (!Number.isFinite(amountNum) || amountNum <= 0) {
                setFormError('Amount paid must be a valid number');
                return;
              }
              if (!bankName.trim()) {
                setFormError('Bank name is required');
                return;
              }
              if (!paymentDoc) {
                setFormError('Payment document is required');
                return;
              }

              try {
                await createM.mutateAsync({
                  stationId: stationId.trim(),
                  bankName: bankName.trim(),
                  amountPaid: amountNum,
                  note: note.trim() || undefined,
                  paymentDoc,
                });

                setStationId('');
                setStationSearch('');
                setBankName('');
                setAmountPaid('');
                setNote('');
                setPaymentDoc(null);
              } catch (err: any) {
                setFormError(err?.message ?? 'Failed to create payment record');
              }
            }}
          >
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Station Name
              </label>
              <input
                list="station-options"
                value={stationSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setStationSearch(value);
                  const match = stationOptions.find(
                    (option) => option.label === value || option.id === value
                  );
                  setStationId(match ? match.id : value);
                }}
                placeholder={loadingStations ? 'Loading stations...' : 'Select station name'}
                disabled={stationsQ.isError}
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5"
              />
              <datalist id="station-options">
                {stationOptions.map((option) => (
                  <option key={option.id} value={option.label} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Station ID
              </label>
              <input
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                placeholder="Enter station ID"
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Bank Name
              </label>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter a bank name"
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Amount Paid
              </label>
              <input
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter the amount that you have paid"
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
                inputMode="decimal"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Note
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter any note (optional)"
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              />
            </div>

            <div className="border border-black/10  rounded-[6px] p-2">
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Choose Documents
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setPaymentDoc(e.target.files?.[0] ?? null)}
                className="block w-full text-[12px]"
                required
              />
            </div>

            {formError ? (
              <div className="text-[12px] text-red-600">{formError}</div>
            ) : null}

            <button
              type="submit"
              disabled={createM.isPending}
              className="h-9 w-full rounded-[6px] bg-[#133374] text-[12px] font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {createM.isPending ? 'Submitting...' : 'Submit Payment'}
            </button>
          </form>
        </div>

        <div className="rounded-[12px] border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-center text-[14px] font-semibold text-[#2B3A4A]">
            Payment Methods
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method}
                className="flex h-[52px] items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#2B3A4A] shadow-sm"
              >
                {method}
              </div>
            ))}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`placeholder-${idx}`}
                className="h-[52px] rounded-[6px] border border-[#E5E7EB] bg-[#F8FAFF]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* <div className="rounded-[12px] border border-black/5 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-[14px] font-semibold text-[#2B3A4A]">
          Payment Records
        </h3>
        {recordsQ.isLoading ? (
          <Loader label="Loading records..." />
        ) : recordsQ.isError ? (
          <div className="text-sm text-red-600">Failed to load payment records.</div>
        ) : (
          <TablePanel<PaymentRecordRow>
            rows={recordsQ.data ?? []}
            columns={columns}
            getRowKey={(r) => r.id}
            searchText={(r) => `${r.stationName} ${r.bankName} ${r.amountPaid}`}
            showExport={false}
          />
        )}
      </div> */}
    </div>
  );
}
