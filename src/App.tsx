import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as clientData from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Error, FilterBy, Todo } from './types/Todo';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState<string>(FilterBy.ALL);

  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function getClientData() {
    setIsLoading(true);

    clientData
      .getTodos()
      .then(data => {
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage(Error.LOAD);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(getClientData, []);

  function addTodo(newTitle: string) {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.TITLE);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const tempNewTodo: Todo = {
      id: 0,
      userId: clientData.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(tempNewTodo);
    setIsInputDisabled(true);
    setLoadingTodo((prev: number[]) => [...prev, clientData.USER_ID]);
    setErrorMessage('');

    clientData
      .addTodos({
        userId: clientData.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(Error.ADD);
        setTimeout(() => setErrorMessage(''), 3000);
        setInputValue(trimmedTitle);
        setTempTodo(null);
      })
      .finally(() => {
        setLoadingTodo((prev: number[]) =>
          prev.filter(id => id !== clientData.USER_ID),
        );
        setIsInputDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodo((prev: number[]) => [...prev, todoId]);
    setErrorMessage('');

    clientData
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.DELETE);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodo((prev: number[]) => prev.filter(id => id !== todoId));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function clearCompletedTodos() {
    const allCompleted = todos.filter((todo: Todo) => todo.completed);

    allCompleted.forEach((todo: Todo) => deleteTodo(todo.id));
  }

  const filteredByCompleted = todos.filter(todo => {
    if (filterTodo === FilterBy.ACTIVE) {
      return !todo.completed;
    }

    if (filterTodo === FilterBy.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const countFilterNotCompleted = todos.filter(todo => !todo.completed).length;
  const countFilterCompleted = todos.filter(todo => todo.completed).length;

  if (!clientData.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countItemsCompleted={countFilterNotCompleted}
          addTodo={addTodo}
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isInputDisabled={isInputDisabled}
        />
        {!isLoading ? (
          <TodoList
            todos={filteredByCompleted}
            deleteTodo={deleteTodo}
            loadingTodo={loadingTodo}
          />
        ) : (
          <div>Loading...</div>
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodo={loadingTodo}
            isTemp
            deleteTodo={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            countItemsCompleted={countFilterNotCompleted}
            countItemsNotCompleted={countFilterCompleted}
            setFilterTodo={setFilterTodo}
            filterTodo={filterTodo}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
