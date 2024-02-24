import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  createGoal,
  deleteGoal,
  getSavings,
  transferFromGoal,
  transferToGoal,
} from "./savings-slice";
import { AppStore, createTestStore } from "@/redux/testStore";
import { mockSavingsGoals, newSavingsGoal } from "./helpers/mocks";
import { initialState } from "./savings-slice";

const accountUid = "uid";
const goalUid = "5301c816-4613-4a7f-8d28-9ba156c7821b";

//------------------------------------------------------------------------
describe("getSavings thunk", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    //preload some savings goals into state so that reducers can be tested
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  it("should set states correctly when api response ok", async () => {
    mockAxios.onGet(`api/savings/${accountUid}`).reply(200, mockSavingsGoals);

    await store.dispatch(getSavings(accountUid));

    expect(store.getState().savings.savingsGoals).toEqual(mockSavingsGoals);
    expect(store.getState().savings.savingsLoading).toEqual(false);
  });

  it("should not set states when api response fails", async () => {
    mockAxios.onGet(`api/savings/${accountUid}`).reply(400, "oops");

    await store.dispatch(getSavings(accountUid));

    expect(store.getState().savings.savingsGoals).toEqual([]);
    expect(store.getState().savings.savingsLoading).toEqual(true);
  });
});

//------------------------------------------------------------------------
describe("createGoal thunk", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    //preload some savings goals into state so that reducers can be tested
    store = createTestStore({
      savings: { ...initialState, savingsGoals: mockSavingsGoals },
    });
    mockAxios = new MockAdapter(axios);
  });

  const body = {
    name: "retirment",
    target: {
      currency: "GBP",
      minorUnits: 100000000,
    },
    currency: "GBP",
  };

  it("should set states correctly when api response ok", async () => {
    mockAxios.onPut(`api/savings/${accountUid}`).reply(200, newSavingsGoal);

    await store.dispatch(createGoal({ accountUid: accountUid, body: body }));
    expect(store.getState().savings.savingsGoals).toEqual([
      ...mockSavingsGoals,
      newSavingsGoal,
    ]);
    expect(store.getState().savings.createGoalLoading).toEqual(false);
    expect(store.getState().savings.createGoalError).toEqual(false);
  });

  it("should set states correctly when api response failsa", async () => {
    mockAxios.onPut(`api/savings/${accountUid}`).reply(400, "oops");

    await store.dispatch(createGoal({ accountUid: accountUid, body: body }));
    expect(store.getState().savings.savingsGoals).toEqual(mockSavingsGoals);
    expect(store.getState().savings.createGoalLoading).toEqual(false);
    expect(store.getState().savings.createGoalError).toEqual(true);
  });
});

//------------------------------------------------------------------------
describe("transferToGoal thunk", () => {
  //not going to be modifying balance here. Will have reducers in balance to update the balance amount
  let store: AppStore;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    //preload some savings goals into state so that reducers can be tested
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  const body = {
    currency: "GBP",
    minorUnits: 1234,
  };

  it("should set states correctly when api response ok", async () => {
    mockAxios
      .onPut(`api/savings/${accountUid}/${goalUid}/transfer-in`)
      .reply(200, true);

    await store.dispatch(
      transferToGoal({
        accountUid: accountUid,
        body: body,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.transferInError).toEqual(false);
    expect(store.getState().savings.transferInLoading).toEqual(false);
  });

  it("should set states correctly when api response fails", async () => {
    mockAxios
      .onPut(`api/savings/${accountUid}/${goalUid}/transfer-in`)
      .reply(400, "oops");

    await store.dispatch(
      transferToGoal({
        accountUid: accountUid,
        body: body,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.transferInError).toEqual(true);
    expect(store.getState().savings.transferInLoading).toEqual(false);
  });
});

//------------------------------------------------------------------------
describe("transferFromGoal thunk", () => {
  //not going to be modifying balance here. Will have reducers in balance to update the balance amount
  let store: AppStore;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    //preload some savings goals into state so that reducers can be tested
    store = createTestStore();
    mockAxios = new MockAdapter(axios);
  });

  const body = {
    currency: "GBP",
    minorUnits: 1234,
  };

  it("should set states correctly when api response ok", async () => {
    mockAxios
      .onPut(`api/savings/${accountUid}/${goalUid}/transfer-out`)
      .reply(200, true);

    await store.dispatch(
      transferFromGoal({
        accountUid: accountUid,
        body: body,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.transferOutLoading).toEqual(false);
    expect(store.getState().savings.transferOutError).toEqual(false);
  });

  it("should set states correctly when api response fails", async () => {
    mockAxios
      .onPut(`api/savings/${accountUid}/${goalUid}/transfer-out`)
      .reply(400, "oops");

    await store.dispatch(
      transferFromGoal({
        accountUid: accountUid,
        body: body,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.transferOutError).toEqual(true);
    expect(store.getState().savings.transferOutLoading).toEqual(false);
  });
});

//------------------------------------------------------------------------
describe("deleteGoal thunk", () => {
  let store: AppStore;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    //preload some savings goals into state so that reducers can be tested
    store = createTestStore({
      savings: { ...initialState, savingsGoals: mockSavingsGoals },
    });
    mockAxios = new MockAdapter(axios);
  });

  it("should set states correctly when api response ok", async () => {
    mockAxios
      .onDelete(`api/savings/${accountUid}/${goalUid}/delete`)
      .reply(200, "5301c816-4613-4a7f-8d28-9ba156c7821b");

    await store.dispatch(
      deleteGoal({
        accountUid: accountUid,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.deleteGoalLoading).toEqual(false);
    expect(store.getState().savings.deleteGoalError).toEqual(false);
    expect(store.getState().savings.savingsGoals).toEqual(
      mockSavingsGoals.filter((goal) => goal.savingsGoalUid != goalUid)
    );
  });

  it("should set states correctly when api response fails", async () => {
    mockAxios
      .onDelete(`api/savings/${accountUid}/${goalUid}/delete`)
      .reply(400, "oops");

    await store.dispatch(
      deleteGoal({
        accountUid: accountUid,
        savingsGoalUid: goalUid,
      })
    );
    expect(store.getState().savings.deleteGoalLoading).toEqual(false);
    expect(store.getState().savings.deleteGoalError).toEqual(true);
    expect(store.getState().savings.savingsGoals).toEqual(mockSavingsGoals);
  });
});
