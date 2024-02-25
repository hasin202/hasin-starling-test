import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getTransactions } from "./transactions-slice";
import { AppStore, createTestStore } from "@/redux/testStore";
import { mockFeedItems } from "./helpers/mocks";

const initialState = {
  feedItems: [],
  transactionsLoading: true,
  roundUpAmount: 0,
};

describe("transactions slice", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;

  const accountUid = "uid";
  const endPoint = new RegExp(`/api/transactions/${accountUid}\/*`);

  beforeEach(() => {
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  it("the inital state shouldn't be changed if no actions are dispatched.", () => {
    expect(store.getState().transactionsInfo).toEqual(initialState);
  });

  it("should not change states if the request fails", async () => {
    mockAxios.onGet(endPoint).reply(400, "oops");

    await store.dispatch(getTransactions(accountUid));
    expect(store.getState().transactionsInfo.transactionsLoading).toBe(true);
    expect(store.getState().transactionsInfo.roundUpAmount).toBe(0);
    expect(store.getState().transactionsInfo.transactionsLoading).toBe(true);
  });

  it("should states properly if the api response is ok", async () => {
    mockAxios.onGet(endPoint).reply(200, mockFeedItems);

    await store.dispatch(getTransactions(accountUid));

    expect(store.getState().transactionsInfo.feedItems).toEqual(
      mockFeedItems.reverse()
    );
    expect(store.getState().transactionsInfo.roundUpAmount).toEqual(785);
  });
});
