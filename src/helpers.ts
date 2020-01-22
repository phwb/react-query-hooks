import {PredicateFunction, PromiseFunction} from './types';

export const delay = (timeout: number): Promise<void> => new Promise(resolve => setTimeout(resolve, timeout));

/**
 * Функция оборачивает промис в логику повтора запроса.
 *
 * Например, если запрос:
 * ```javascript
 * const fetchSomeData = () => fetch('/some-data')
 * ```
 *
 * который возвращает данные:
 * ```json
 * {
 *   data: 1
 * }
 * ```
 *
 * есть следующий предикат:
 * ```javascript
 * const isOne = (response) => response.data === 1
 * ```
 *
 * обернем наш запрос в хелпер
 * ```javascript
 * const refresh = withRefresh(isOne, 2)(fetchSomeData)
 * ```
 * теперь когда запрос вернети в ответе 1, то произойдет повтор запроса кол-во раз указанное в фукнции,
 * когда попытки кончатся, фукнция просто вернет полученые ответ.
 */
export const withRefresh = (predicate: PredicateFunction, maxCount = 0) => <T = unknown>(fn: PromiseFunction<T>) => {
  const refresh = (count: number, ...args: any[]): Promise<T> => fn(...args).then((result: T) => {
    if (predicate(result) && count < maxCount) {
      return refresh(count + 1, ...args);
    }

    return result;
  });

  return (...args: any[]): Promise<T> => refresh(0, ...args);
};

/**
 * см. описание withRefresh
 */
export const withRetry = (predicate: PredicateFunction, maxCount = 0, timeout = 0) => <T = unknown>(fn: PromiseFunction<T>) => {
  const retry = (count: number, ...args: any[]): Promise<T> => fn(...args).catch((error: any) => {
    if (predicate(error) && count < maxCount) {
      if (timeout) {
        return delay(timeout).then(() => retry(count + 1, ...args));
      }

      return retry(count + 1, ...args);
    }

    throw error;
  });

  return (...args: any[]): Promise<T> => retry(0, ...args);
};
