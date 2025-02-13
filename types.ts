/**
 * @description A result that can end up with success(ok) or failure(not ok).
 */
export type Result<T, E extends string = string> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: E;
      value: undefined;
    };

/**
 * @description A result that can end up with success(ok) or failure(not ok).
 */
export namespace Result {
  /**
   * @description Creates a new `Result` with the specified `value` and `ok` set to `true`.
   */
  export const ok = <T, E extends string = string>(value: T): Result<T, E> => ({
    ok: true,
    value,
  });

  /**
   * @description Creates a new `Result` with the specified `reason` and `ok` set to `false`.
   */
  export const notok = <E extends string = string>(
    reason: E,
  ): Result<never, E> => ({
    ok: false,
    reason,
    value: undefined,
  });
}
