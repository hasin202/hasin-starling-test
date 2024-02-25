import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  addBalance,
  getAccountUid,
  getBalance,
  removeBalance,
} from "./user-info-slice";
import { AppStore, createTestStore } from "@/redux/testStore";
import { mockFeedItems } from "../transactions/helpers/mocks";
import { mockSavingsGoals } from "../savings/helpers/mocks";

describe("accountUid reducer", () => {
  let store: AppStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it("should add the correct value to the balance", () => {
    store.dispatch(addBalance(100));
    expect(store.getState().userInfo.balance).toBe(100);
  });

  it("should remove the correct value to the balance", () => {
    store.dispatch(removeBalance(100));
    expect(store.getState().userInfo.balance).toBe(-100);
  });
});

describe("accountUid Thunk & global errors", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;
  beforeEach(() => {
    //setup store and a mock axios instance before each test
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  it("should set states correctly if response is ok", async () => {
    mockAxios.onGet("/api/account-uid").reply(200, "uid");

    mockAxios
      .onGet(`/api/balance/uid`)
      .reply(200, { currency: "GBP", minorUnits: 1234 });
    mockAxios.onGet(`/api/transactions/uid`).reply(200, mockFeedItems);
    mockAxios.onGet(`/api/savings/uid`).reply(200, mockSavingsGoals);

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUid).toBe("uid");
    expect(store.getState().userInfo.initalLoading).toBe(false);
    expect(store.getState().globalError.accountUidError).toBe(false);
    expect(store.getState().globalError.otherErrors).toBe(false);
    expect(store.getState().globalError.otherErrorsExplination).toEqual([]);
  });

  it("should set states correctly if account Uid fails, specifically error states", async () => {
    mockAxios.onGet("/api/account-uid").reply(400, "oops");

    mockAxios
      .onGet(`/api/balance/uid`)
      .reply(200, { currency: "GBP", minorUnits: 1234 });
    mockAxios.onGet(`/api/transactions/uid`).reply(200, mockFeedItems);
    mockAxios.onGet(`/api/savings/uid`).reply(200, mockSavingsGoals);

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUid).toBe("");
    expect(store.getState().userInfo.initalLoading).toBe(true);
    expect(store.getState().globalError.accountUidError).toBe(true);
    expect(store.getState().globalError.otherErrors).toBe(false);
    expect(store.getState().globalError.otherErrorsExplination).toEqual([]);
  });

  it("should set states correctly if response fails", async () => {
    mockAxios.onGet("/api/account-uid").reply(200, "uid");

    mockAxios.onGet(`/api/balance/uid`).reply(400, "oops");
    mockAxios.onGet(`/api/transactions/uid`).reply(200, mockFeedItems);
    mockAxios.onGet(`/api/savings/uid`).reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUid).toBe("");
    expect(store.getState().userInfo.initalLoading).toBe(true);
    expect(store.getState().globalError.accountUidError).toBe(false);
    expect(store.getState().globalError.otherErrors).toBe(true);
    expect(store.getState().globalError.otherErrorsExplination).toEqual([
      "balance",
      "savings",
    ]);
  });
});

describe("balance Thunk", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;
  const accountUid = "uid";
  beforeEach(() => {
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  it("should not set states if the api throws an error", async () => {
    mockAxios.onGet(`/api/balance/${accountUid}`).reply(400, "oops");

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balance).toBe(0);
    expect(store.getState().userInfo.balanceLoading).toBe(true);
  });

  it("should set states correctly if the api response is ok", async () => {
    mockAxios
      .onGet(`/api/balance/${accountUid}`)
      .reply(200, { currency: "GBP", minorUnits: 1234 });

    await store.dispatch(getBalance(accountUid));
    expect(store.getState().userInfo.balance).toBe(1234);
    expect(store.getState().userInfo.balanceLoading).toBe(false);
  });
});
