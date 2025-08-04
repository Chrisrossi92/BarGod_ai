// src/components/therise/avatar/AvatarCard.jsx

import React from 'react';
import AvatarPreview from './AvatarPreview';
import AvatarSeedInput from './AvatarSeedInput';
import BattlerInfoForm from './BattlerInfoForm';

export default function AvatarCard({
  avatarSeed,
  appearance,
  name,
  title,
  setAvatarSeed,
  setName,
  setTitle,
  setAppearance,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-[#0f111a] text-white rounded-xl p-6 shadow-xl border border-neutral-800">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col items-center text-center gap-4">
        <AvatarPreview seed={avatarSeed} />
        <AvatarSeedInput avatarSeed={avatarSeed} setAvatarSeed={setAvatarSeed} />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col gap-4">
        <BattlerInfoForm
          name={name}
          setName={setName}
          title={title}
          setTitle={setTitle}
          appearance={appearance}
          setAppearance={setAppearance}
        />
      </div>
    </div>
  );
}
