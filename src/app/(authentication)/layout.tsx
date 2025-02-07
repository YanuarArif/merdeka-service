import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Background Radial */}
      <div
        className="absolute inset-0 
    bg-[radial-gradient(#e5e7eb_1px,transparent_1.5px)]
    [background-size:15px_15px]
    [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_70%,transparent_100%)]
    
    dark:bg-[#000000] 
    dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1.5px)]
    dark:bg-[size:15px_15px]
    dark:[mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_50%,transparent_100%)]"
      />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

AuthLayout.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};
