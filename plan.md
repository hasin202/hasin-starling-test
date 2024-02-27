# Requirments:

- Take all a customers transactions for a given week and round each up to the nearest pound.
- All the customer to transfer these into a savings goal on the press of button

## Requirments Analysis:

- Need to have a date selector to allow the customer to choose the week they want to find the round up amount for.
  <strike>- In doing this I need to keep a record of the weeks that have already been rounded up so that the customer wont be able to round up twice for the same week.
- I also need to make sure that the customer can only select one day each week to simplify the problem. Ie they should only be able to select mondays.

  - This is becuase say a customer rounds up for the 8th of Feb. If they are then able select the 9th of Feb a lot of additional logic is required to enusre only the round up for the 9th of Feb is displayed.

    But by only allowing them to select one day a week there is no need to worry about situation occuring.</strike>

    Thinking about it now this wasn't the best way to think about the problem. What if the user wants to transfer the roundup amount to multiple savings goals. If they want to do this then they should be able to.

    Because of this realisation there is no need to keep track of which weeks they have rounded up for or limit the date picker selection.

    This decision leads to a better ux and simplifies the logic significantly.

- I need to prompt the customer to make a savings goal if they don't have one

- CRUD functionality for savings goals. Here updating savings goals isn't a breaking feature for the site so it won't be included in this MVP

# Required Endpoints:

#### _Whenever minor units are mentioned its referring to the cash amount in the smallest unit for the currency. Ie. If the the currency is £ then a minor units value of 3456 means £34.56_

### GET account balance:

    api/v2/accounts/6451c9b5-8eb6-4544-a406-494c1f069a82/balance

    Use:
    * Display account balance
    * Get currency of users account. _This needs to be stored in state._

### GET all settled transactions:

    api/v2/feed/account/6451c9b5-8eb6-4544-a406-494c1f069a82/settled-transactions-between

    Headers:

        - Accept: application/json
        - Content-Type - application/json
        - Authorization - Bearer {Auth token}

    Params: In the format YYYY-MM-DDTHH:MM:SS.000Z

        - maxTransactionTimestamp
        - minTransactionTimestamp

    _The date selected by the user can be used as the minTransactionTimeStamp and the max can be set to 7 days ahear._

    Use:
    * To calculate the amount to round up by
    * To display a list of that weeks transactions

    ### _Only make this API call when the user selects a new date. Ie have the use effect be dependent on the date stored in state._ ###

### GET an array of savings goals:

    api/v2/account/6451c9b5-8eb6-4544-a406-494c1f069a82/savings-goals

    Use:
    * To get a list of all the users savings goals so that the names can be displayed allowing them to decide which pot they want to add the round-up amount to

### PUT money into a savings goal:

    api/v2/account/6451c9b5-8eb6-4544-a406-494c1f069a82/savings-goals/{savingsGoalUid}/add-money/{transferUid}

    Params:

        - savingsGoalUid (from state)
        - transferUid (generate a uuid)

    Request Body:

        Example format:
        {
            "amount": {
                "currency": "GBP",
                "minorUnits": 123456
            }
        }

    Use:
    * To transfer the round-up amount for the given week into the selected savings goal pot.

### PUT make a new savings goal

    /api/v2/account/6451c9b5-8eb6-4544-a406-494c1f069a82/savings-goal

    Request Body:

            Example format:
            {
                "name": "Trip to Paris",
                "currency": "GBP",
                "target": {
                    "currency": "GBP",
                    "minorUnits": 123456
                },
                "base64EncodedPhoto": "string"
            }

    Use:
    * Allow the user to make a new savings goal if they want to start saving for something new.

    ### _Use the currency stored in state for currency in request body_ ###

### DELETE a savings goal

    /api/v2/account/6451c9b5-8eb6-4544-a406-494c1f069a82/savings-goal

    Use:
    * Allow the user to delete a savings goal
    * Starling API automatically transfers any money inside a savings goal back to the users account when deleted

---

# Tech & Logic:

### Tech Stack:

    Typescript, NextJS, Redux, Shadcn, lucide, jest

Redux setup:

### Slices:

- Settled transactions - Inital state empty object
- Selected date - Initial state date a week before currecnt date
- Saving spaces - Initial state, empty array
- User Info - Initial state "GBP"

Use thunks to make actions for API calls. Using a thunk is beneficial because it automatically provides an easy to use interface for logic like loading and error for api calls.

#### Error handling:

If an error occurs while making an api call from the client side display a shadcn toast with a button to refresh the page.

### Round-up amount logic:

- Search the database to see if the selected week has already been rounded up. If it has then display a suitable message telling the user they've already rounded up and disable the button.
- If it hasn't:
  - Get the settled transactions from the redux store.
  - filter for the direction "OUT"
  - reshape the data so that its an array containg just amount.minourUnits for each payement
  - transform this array so that each element is just the last 2 digits of its original value. This is to isolate the minor unit for each transaction.
  - reduce this array, making sure for each element to do 100 - element to calculate the actual round up amount.

### UI:

- Always display a customers balace.
- Nav bar for navigating between transactions and savings components.
- / display transactions
- /savings display savings

- Shad CN components to use:
  - Button
  - Sheet
  - Form
  - Date Picker
  - toast

### Styling:

Customise shadcn default theme:

- Update foreground and bg colors
- Make dark mode the default
- Make a button variant
