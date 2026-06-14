'use client';

import { useRouter } from 'next/navigation';

export default function CloseInvoiceButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      title="Close Invoice"
      className="print:hidden"
      style={{
        position: 'relative',
        zIndex: 9999,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#1a1a1a',
        border: '1.5px solid #c5a059',
        color: '#c5a059',
        fontSize: 20,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#c5a059';
        (e.currentTarget as HTMLButtonElement).style.color = '#000';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a';
        (e.currentTarget as HTMLButtonElement).style.color = '#c5a059';
      }}
    >
      ✕
    </button>
  );
}
