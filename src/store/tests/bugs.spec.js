import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  assignBugToUser,
  loadBugs,
  addBug,
  getUnresolvedBugs,
  resolveBug
} from '../bugs';
import configureStore from '../configureStore';

describe('bugsSlice', () => {
  let fakeAxios = new MockAdapter(axios);
  let store;
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });
  // Helper functions
  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: []
      }
    }
  });

  it("should add the bug to the store if it's saved to the server", async () => {
    // Arrange
    const bug = { description: 'a' };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost('/bugs').reply(200, savedBug);
    // Act
    await store.dispatch(addBug(bug));
    // Assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the bug to the store if it's not saved to the server", async () => {
    // Arrange
    const bug = { description: 'a' };
    fakeAxios.onPost('/bugs').reply(500);
    // Act
    await store.dispatch(addBug(bug));
    // Assert
    expect(bugsSlice().list).toHaveLength(0);
  });

  it("should mark the bug resolved if it's saved to the server", async () => {
    // Arrange
    const bug = { id: 1, resolved: true };
    fakeAxios.onPost('/bugs').reply(200, { id: 1 });
    fakeAxios.onPatch('/bugs/' + bug.id).reply(200, bug);
    // Act
    await store.dispatch(addBug());
    await store.dispatch(resolveBug(bug.id));
    // Assert
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark the bug resolved if it's not saved to the server", async () => {
    // Arrange
    const bug = { id: 1, resolved: true };
    fakeAxios.onPost('/bugs').reply(200, { id: 1 });
    fakeAxios.onPatch('/bugs/' + bug.id).reply(500);

    // Act
    await store.dispatch(addBug());
    await store.dispatch(resolveBug(bug.id));

    // Assert
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  it("should mark the bug assigned to the user if it's saved to the server", async () => {
    // Arrange
    const bug = { id: 1, userId: 1 };
    fakeAxios.onPost('/bugs').reply(200, { id: 1 });
    fakeAxios.onPatch('/bugs/' + bug.id).reply(200, bug);
    // Act
    await store.dispatch(addBug());
    await store.dispatch(assignBugToUser(bug.id, bug.userId));
    // Assert
    expect(bugsSlice().list[0].userId).toBe(1);
  });

  describe('loading bugs', () => {
    describe('if the bugs exist in the cache', () => {
      it('should not be fetched from the server again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe("if the bugs don't exist in the cache", () => {
      it('should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the bugs', () => {
          // Arrange
          // These 2 calls are identical
          // but this second signature allow us to run some code before
          // the mock adapter sends the fake response
          // So we can check for the loading there
          // fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
          fakeAxios.onGet('/bugs').reply(() => {
            // Assert
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });
          // Act
          store.dispatch(loadBugs());
        });
        it('should be false after the bugs are fetched', async () => {
          // Arrange
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
          // act
          await store.dispatch(loadBugs());
          // Assert
          expect(bugsSlice().loading).toBe(false);
        });
        it('should be false if teh server returns an error', async () => {
          // Arrange
          fakeAxios.onGet('/bugs').reply(500);
          // act
          await store.dispatch(loadBugs());
          // Assert
          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe('selectors', () => {
    it('getUnresolvedBugs', async () => {
      // Arrange
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 }
      ];

      // Act
      const result = getUnresolvedBugs(state);

      // Assert
      expect(result).toHaveLength(2);
    });
  });
});
