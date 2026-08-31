import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 6C12.686 6 10 8.686 10 12C10 16.5 16 26 16 26C16 26 22 16.5 22 12C22 8.686 19.314 6 16 6Z"
            fill="#1E1B6E"
          />
          <circle cx="16" cy="12" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
