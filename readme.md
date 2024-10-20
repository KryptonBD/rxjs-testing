# RxJS Testing

Rxjs's marble and assert pattern random practice

## Marble Testing

- **-** represent frame of virtual time &emsp; _-a--b_
- **#** represent error &emsp; _-a--b#_
- **()** represent synchronous grouping &emsp; _-(abc)---_
- **|** represent complete &emsp; _(abc|)_
- **^** represent subscription point &emsp; _-a--b-^-c-_
- **!** represent unsubscribe &emsp; _4s !_

---

**hot** - observable whose subscription starts when the test begins<br>
**cold** - observable that will behave as though it's already "running" when the test begins<br>
**expectObservable** - schedules an assertion for when the TestScheduler flushes
