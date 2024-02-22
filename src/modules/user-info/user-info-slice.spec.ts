import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getAccountUid } from "./user-info-slice";
import { testStore } from "@/redux/store";

const initialState = {
  accountUid: "",
  accountUidLoading: false,
  accountUidError: false,
  currency: "USD",
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
  let mock: MockAdapter;
  beforeEach(() => {
    store = testStore;
    mock = new MockAdapter(axios);
  });

  it("should set accountUidError to true if the api call fails", async () => {
    mock.onGet("/api/account-uid").reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(store.getState().userInfo.accountUidError).toBe(true);
  });

  it("should not set uid in local storage if the request fails", async () => {
    mock.onGet("/api/account-uid").reply(400, "oops");

    await store.dispatch(getAccountUid());
    expect(localStorage.getItem("accountUid")).toBe(null);
  });

  it("should set account uid in local storage if response is ok", async () => {
    mock.onGet("/api/account-uid").reply(200, "uid");
    //the thunk now thinks the response has been fulfilled so the uid should be set in local storage

    await store.dispatch(getAccountUid());
    expect(localStorage.getItem("accountUid")).toBe("uid");
  });
});
