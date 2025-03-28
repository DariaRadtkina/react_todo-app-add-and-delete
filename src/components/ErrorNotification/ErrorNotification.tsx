import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (error: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      // eslint-disable-next-line max-len
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
