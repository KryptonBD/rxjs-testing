import { TestScheduler } from "rxjs/testing";
import { catchError, concat, map, take, of, interval } from "rxjs";

/**
 *  RxJs Marble Testing
 *  -   represent frame of virtual time    -a--b
 *  #   represent error                    -a--b#
 *  ()  represent synchronous grouping     -(abc)---
 *  |   represent complete                  (abc|)
 *  ^   subscription point                  -a--b-^-c-
 *  !   unsubscribe                         4s !
 */

describe("Marble Testing", () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("should convert ASCII into observables", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const source$ = cold("--a-b---c");

      const expected = "--a-b---c";
      expectObservable(source$).toBe(expected);
    });
  });

  it("should allow configuration of emitted values", () => {
    testScheduler.run((helpers) => {
      // arrange
      const { cold, expectObservable } = helpers;
      const source$ = cold("--a-b---c", { a: 1, b: 2, c: 3 });
      // act
      const final$ = source$.pipe(map((val) => val * 10));

      //assert
      expectObservable(final$).toBe("--a-b---c", { a: 10, b: 20, c: 30 });
    });
  });

  it("should let you identify subscription points", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source$ = cold("-a---b-|");
      const source2$ = cold("-c---d-|");

      const final$ = concat(source$, source2$);
      const expected = "-a---b--c---d-|";

      expectObservable(final$).toBe(expected);
    });
  });

  it("should let test hot observable", () => {
    testScheduler.run((helpers) => {
      const { cold, hot, expectObservable } = helpers;

      const source$ = hot("--a-b-^-c");
      const final$ = source$.pipe(take(1));

      const expected = "--(c|)";

      expectObservable(final$).toBe(expected);
    });
  });

  it("should let you test errors and error messages", () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const source$ = of({ firstName: "John", lastName: "Doe" }, null).pipe(
        map((o) => `${o.firstName} ${o.lastName}`),
        catchError(() => {
          throw { message: "Invalid User" };
        })
      );
      const expected = "(a#)";

      expectObservable(source$).toBe(
        expected,
        { a: "John Doe" },
        { message: "Invalid User" }
      );
    });
  });

  it("should let you test snapshots of streams that does not complete", () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const source$ = interval(1000).pipe(map((val) => `${val + 1}sec`));

      const expected = "1s a 999ms b 999ms c";
      const unsubscribe = "4s !";

      expectObservable(source$, unsubscribe).toBe(expected, {
        a: "1sec",
        b: "2sec",
        c: "3sec",
      });
    });
  });
});
