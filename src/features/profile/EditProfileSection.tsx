'use client';

import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {changePasswordSchema, updateProfileSchema} from './schemas';
import {
  useChangePassword,
  useMeProfile,
  useUpdateProfile,
  useUploadAvatar,
} from './queries';
import type {ChangePasswordInput, UpdateProfileInput} from './types';

const BRAND = '#009970';

const BTN_PRIMARY =
  'h-9 rounded-full bg-[#009970] px-10 text-sm font-semibold text-white ' +
  'shadow-[0_10px_22px_rgba(0,153,112,0.18)] ' +
  'hover:bg-[#008463] active:bg-[#007a59] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009970]/35 ' +
  'disabled:pointer-events-none disabled:opacity-60';

const INPUT =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 ' +
  'outline-none transition ' +
  'focus:border-[#009970]/45 focus:ring-2 focus:ring-[#009970]/15';

export default function EditProfileSection() {
  const meQ = useMeProfile();
  const uploadM = useUploadAvatar();
  const changePassM = useChangePassword();
  const updateM = useUpdateProfile();

  const passForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {oldPassword: '', newPassword: ''},
  });

  const infoForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {fullName: '', email: '', phone: '', address: ''},
  });

  useEffect(() => {
    if (!meQ.data) return;
    infoForm.reset({
      fullName: meQ.data.fullName,
      email: meQ.data.email,
      phone: meQ.data.phone,
      address: meQ.data.address,
    });
  }, [meQ.data, infoForm]);

  if (meQ.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (meQ.isError) return <div className="text-sm text-red-600">Failed to load profile.</div>;

  const me = meQ.data!;

  return (
    <section className="space-y-10">
      {/* Upload Profile Picture */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-700">Upload Profile Picture</h3>

        <div className="mt-4 flex flex-col items-center gap-3">
          <label className="grid w-[360px] cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[#009970]/45 bg-[#F7FFFC] px-6 py-6 text-center shadow-sm">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                uploadM.mutate(f);
                e.currentTarget.value = '';
              }}
            />

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E7F7F1]">
              <span className="h-4 w-4 rounded bg-[#009970]/70" />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-600">
              Choose images or drag &amp; drop it here.
            </p>
            <p className="mt-1 text-[10px] text-slate-500">JPG, PNG up to 2MB</p>

            {me.avatarUrl ? (
              <div className="mt-4 h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={me.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </label>

          <button type="button" disabled={uploadM.isPending} className={BTN_PRIMARY}>
            {uploadM.isPending ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <Divider />

      {/* Change Password */}
      <div className="mx-auto w-full max-w-[760px]">
        <h3 className="text-center text-sm font-semibold text-slate-700">Change Password</h3>

        <form
          className="mt-6 space-y-4"
          onSubmit={passForm.handleSubmit((v) => changePassM.mutate(v))}
        >
          <Row label="Old Password">
            <input type="password" className={INPUT} {...passForm.register('oldPassword')} />
            <ErrorLine msg={passForm.formState.errors.oldPassword?.message} />
          </Row>

          <Row label="New Password">
            <input type="password" className={INPUT} {...passForm.register('newPassword')} />
            <ErrorLine msg={passForm.formState.errors.newPassword?.message} />
          </Row>

          <div className="flex justify-center pt-2">
            <button type="submit" disabled={changePassM.isPending} className={BTN_PRIMARY}>
              {changePassM.isPending ? 'Changing...' : 'Change'}
            </button>
          </div>
        </form>
      </div>

      <Divider />

      {/* Change Other Informations */}
      <div className="mx-auto w-full max-w-[760px]">
        <h3 className="text-center text-sm font-semibold text-slate-700">
          Change Other Informations
        </h3>

        <form
          className="mt-6 space-y-4"
          onSubmit={infoForm.handleSubmit((v) => updateM.mutate(v))}
        >
          <Row label="Name">
            <input className={INPUT} {...infoForm.register('fullName')} />
            <ErrorLine msg={infoForm.formState.errors.fullName?.message} />
          </Row>

          <Row label="Email">
            <input className={INPUT} {...infoForm.register('email')} />
            <ErrorLine msg={infoForm.formState.errors.email?.message} />
          </Row>

          <Row label="Phone">
            <input className={INPUT} {...infoForm.register('phone')} />
            <ErrorLine msg={infoForm.formState.errors.phone?.message} />
          </Row>

          <Row label="Address">
            <input className={INPUT} {...infoForm.register('address')} />
            <ErrorLine msg={infoForm.formState.errors.address?.message} />
          </Row>

          <div className="flex justify-center pt-2">
            <button type="submit" disabled={updateM.isPending} className={BTN_PRIMARY}>
              {updateM.isPending ? 'Updating...' : 'Change'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Divider() {
  return <div className="mx-auto h-px w-full max-w-[960px] bg-slate-200" />;
}

function Row({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="grid items-center gap-4 md:grid-cols-[140px_520px] md:justify-center">
      <div className="text-xs font-semibold text-slate-600 md:text-right">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function ErrorLine({msg}: {msg?: string}) {
  if (!msg) return null;
  return <p className="mt-1 text-[11px] text-red-600">{msg}</p>;
}
