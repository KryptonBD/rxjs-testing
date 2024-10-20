import { catchError, delay, map, mergeMap, of, toArray } from "rxjs";

/**
 *  RxJs subscribe and assert testing
 */
describe("Subscribe and Assert Pattern", () => {
  it("should compare each emitted value", () => {
    const source$ = of(1, 2, 3);
    const final$ = source$.pipe(map((val) => val * 10));

    const expected = [10, 20, 30];
    let index = 0;

    final$.subscribe((val) => {
      expect(val).toEqual(expected[index]);
      index++;
    });
  });

  it("should compare each emitted value on completion with toArray", () => {
    const source$ = of(1, 2, 3);
    const final$ = source$.pipe(
      map((val) => val * 10),
      toArray()
    );

    const expected = [10, 20, 30];

    final$.subscribe((val) => {
      expect(val).toEqual(expected);
    });
  });

  it("should let you test async operations with done callback", (done) => {
    const source$ = of("Ready", "Set", "Go!").pipe(
      mergeMap((message, index) => of(message).pipe(delay(index * 1000)))
    );

    const expected = ["Ready", "Set", "Go!"];
    let index = 0;

    source$.subscribe({
      next: (val) => {
        expect(val).toEqual(expected[index]);
        index++;
      },
      complete: () => done(),
    });
  });

  it("should let you test errors and error messages", () => {
    const source$ = of({ firstName: "John", lastName: "Doe" }, null).pipe(
      map((o) => `${o.firstName} ${o.lastName}`),
      catchError(() => {
        throw { message: "Invalid User" };
      })
    );

    source$.subscribe({
      next: (value) => {
        expect(value).toBe("John Doe");
      },
      error: (error) => {
        expect(error).toEqual({ message: "Invalid User" });
      },
    });
  });
});
