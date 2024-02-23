import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getAccountUid, getBalance } from "./user-info-slice";
import { testStore } from "@/redux/testStore";

const initialState = {
  accountUid: "",
  accountUidLoading: true,
  accountUidError: false,
  currency: "USD",
  balance: "$0.00",
  balanceLoading: true,
};

describe("accountUid reducer", () => {
  let store: typeof testStore;

  beforeEach(() => {
    store = testStore;
  });

  it("should set the initial state properly", () => {
    expect(store.getState().userInfo).toEqual(initialState);
  });

  it("should set accountUidError to true on dispatch of userInfo/accountErr", () => {
    store.dispatch({ type: "userInfo/accountErr" });
    expect(store.getState().userInfo.accountUidError).toBe(true);
  });
});

describe("accountUid Thunk", () => {
  let store: typeof testStore;
  let mockAxios: MockAdapter;
  beforeEach(() => {
    //setup store and a mock axios instance before each test
    store = testStore;
    mockAxios = new MockAdapter(axios);
  });

  it("should set accountUidError to true if the api call fails", async () => {
    mockAxios.onGet("/api/account-uid").reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUidError).toBe(true);
  });

  it("should not set uid in state if the request fails", async () => {
    mockAxios.onGet("/api/account-uid").reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUid).toBe("");
  });

  it("should leave loading state as true if the request fails", async () => {
    mockAxios.onGet("/api/account-uid").reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUidLoading).toBe(true);
  });

  it("should set account state and set loading to false if response is ok", async () => {
    mockAxios.onGet("/api/account-uid").reply(200, "uid");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUid).toBe("uid");
    expect(store.getState().userInfo.accountUidLoading).toBe(false);
  });

  it("should set loading to false if response is ok", async () => {
    mockAxios.onGet("/api/account-uid").reply(200, "uid");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUidLoading).toBe(false);
  });
});

describe("balance Thunk", () => {
  let store: typeof testStore;
  let mockAxios: MockAdapter;
  const accountUid = "uid";
  beforeEach(() => {
    store = testStore;
    mockAxios = new MockAdapter(axios);
  });

  it("should not set balance state and leave loading state as true if the api throws an error", async () => {
    mockAxios.onGet(`/api/balance/${accountUid}`).reply(400, "oops");

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balance).toBe("$0.00");
    expect(store.getState().userInfo.balanceLoading).toBe(true);
  });

  it("should leave loading state as true if the api throws an error", async () => {
    mockAxios.onGet(`/api/balance/${accountUid}`).reply(400, "oops");

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balanceLoading).toBe(true);
  });

  it("should set balance state and loading to false if the api response is ok", async () => {
    mockAxios
      .onGet(`/api/balance/${accountUid}`)
      .reply(200, { currency: "GBP", minorUnits: 1234 });

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balance).toBe("£12.34");
    expect(store.getState().userInfo.balanceLoading).toBe(false);
  });

  it("should set loading to false if the api response is ok", async () => {
    mockAxios
      .onGet(`/api/balance/${accountUid}`)
      .reply(200, { currency: "GBP", minorUnits: 1234 });

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balanceLoading).toBe(false);
  });
});
