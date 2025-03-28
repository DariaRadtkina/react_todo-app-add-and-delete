import React from 'react';
import { FilterBy } from '../../types/Todo';

type Props = {
  countItemsCompleted: number;
  countItemsNotCompleted: number;
  setFilterTodo: (arg: string) => void;
  filterTodo: string;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  countItemsCompleted,
  countItemsNotCompleted,
  setFilterTodo,
  filterTodo,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countItemsCompleted} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={`filter__link ${filterTodo === FilterBy.ALL && 'selected'}`}
          onClick={() => setFilterTodo(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={`filter__link ${filterTodo === FilterBy.ACTIVE && 'selected'}`}
          onClick={() => setFilterTodo(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={`filter__link ${filterTodo === FilterBy.COMPLETED && 'selected'}`}
          onClick={() => setFilterTodo(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={countItemsNotCompleted === 0}
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
