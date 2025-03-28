import React from 'react';

type Props = {
  countItemsCompleted: number;
  addTodo: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  isInputDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  countItemsCompleted,
  addTodo,
  inputRef,
  inputValue,
  setInputValue,
  isInputDisabled,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(inputValue);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${countItemsCompleted === 0 && 'active'}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
