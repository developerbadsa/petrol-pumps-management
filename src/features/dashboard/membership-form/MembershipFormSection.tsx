import Link from 'next/link';
import {Download, FileText, Search} from 'lucide-react';

const rows = [
  {
    id: 'MF-2024-001',
    name: 'Md. Rahim Uddin',
    phone: '01711-234567',
    station: 'Green Valley Filling Station',
    district: 'Dhaka',
    status: 'Pending',
    submitted: '12 Jan 2024',
  },
  {
    id: 'MF-2024-002',
    name: 'Fahima Akter',
    phone: '01819-887766',
    station: 'Sunrise Petroleum',
    district: 'Chattogram',
    status: 'Reviewed',
    submitted: '14 Jan 2024',
  },
  {
    id: 'MF-2024-003',
    name: 'Md. Habib Ullah',
    phone: '01912-554433',
    station: 'Northern Oil Depot',
    district: 'Rajshahi',
    status: 'Approved',
    submitted: '16 Jan 2024',
  },
  {
    id: 'MF-2024-004',
    name: 'Sharmin Ara',
    phone: '01618-221100',
    station: 'Prime Fuel Station',
    district: 'Khulna',
    status: 'Pending',
    submitted: '18 Jan 2024',
  },
];

const statusStyles: Record<string, string> = {
  Pending: 'bg-[#FFE8CC] text-[#C77700]',
  Reviewed: 'bg-[#E7F0FF] text-[#2554B0]',
  Approved: 'bg-[#E4F7E4] text-[#1F7A1F]',
};

export default function MembershipFormSection() {
  return (
    <section className="mx-auto max-w-[1100px] space-y-6">
      <div className="rounded-[12px] border border-black/10 bg-white px-6 py-8 shadow-[0_14px_30px_rgba(9,30,66,0.12)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-[#133374]">Membership Form Entries</h1>
            <p className="mt-1 text-[12px] text-[#7B8EA3]">
              Review submitted membership forms and download the application template.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* <Link
              href="/dashboard-downloads"
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[#CFE1F5] bg-white px-3 text-[11px] font-semibold text-[#133374] shadow-sm hover:bg-[#F5F8FF]"
            >
              <FileText size={14} />
              Downloads
            </Link> */}
            <a
              href="/files/membership-form.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110"
            >
              <Download size={14} />
              Download Form
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-black/10 bg-white shadow-[0_10px_24px_rgba(9,30,66,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#EEF2F8] px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-[13px] font-semibold text-[#133374]">Submitted Applications</div>
          <div className="flex items-center gap-2 rounded-[6px] border border-[#E6EDF7] bg-[#F9FBFF] px-3 py-2 text-[12px] text-[#6B7A90]">
            <Search size={14} className="text-[#98A6BF]" />
            <input
              placeholder="Search by name, station, or id"
              className="w-full bg-transparent text-[12px] text-[#173A7A] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[12px]">
            <thead className="bg-[#F7FAFF] text-[#61708A]">
              <tr>
                <th className="px-6 py-3 font-semibold">Form ID</th>
                <th className="px-6 py-3 font-semibold">Applicant</th>
                <th className="px-6 py-3 font-semibold">Station</th>
                <th className="px-6 py-3 font-semibold">District</th>
                <th className="px-6 py-3 font-semibold">Submitted</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#EEF2F8] text-[#1F2A44]">
                  <td className="px-6 py-4 font-semibold text-[#133374]">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{row.name}</div>
                    <div className="text-[11px] text-[#7B8EA3]">{row.phone}</div>
                  </td>
                  <td className="px-6 py-4">{row.station}</td>
                  <td className="px-6 py-4">{row.district}</td>
                  <td className="px-6 py-4">{row.submitted}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${
                        statusStyles[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded-[6px] border border-[#D7E1F4] px-3 text-[11px] font-semibold text-[#133374] hover:bg-[#F5F8FF]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[10px] border border-dashed border-[#D7E1F4] bg-[#F9FBFF] px-6 py-4 text-[12px] text-[#6B7A90]">
        Tip: Need the blank membership form? Use the download button above or visit the Downloads page.
      </div>
    </section>
  );
}
