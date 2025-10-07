import React, {createContext, useState} from 'react';

type PublishShiftContext = {
  details: string;
  setDetails: (details: string) => void;
};

const PublishShiftContext = createContext<PublishShiftContext>({
  details: '',
  setDetails: () => {}
});

export const PublishShiftContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [details, setdetails] = useState('');

  return (
    <PublishShiftContext.Provider
      value={{
       details,
        setDetails: setdetails,
      }}>
      {children}
    </PublishShiftContext.Provider>
  );
};

export default PublishShiftContext;
