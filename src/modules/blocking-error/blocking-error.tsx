import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const BlockingError = () => {
  const { accountUidError, otherErrors, otherErrorsExplination } = useSelector(
    (state: RootState) => state.globalError
  );
  //if there is an error while getting the accountUid or any other api call then display this modal
  //ONLY FOR INITIAL LOAD.
  return (
    (accountUidError || otherErrors) && (
      <AlertDialog open={accountUidError || otherErrors}>
        <AlertDialogContent className="w-[300px] rounded-lg">
          <AlertDialogHeader>Oops. Something went wrong.</AlertDialogHeader>
          {accountUidError && (
            <AlertDialogDescription>
              This is most likely because you forgot to create a .env file and
              set a ACCESS_TOKEN variable.
              <br />
              <br />
              Please make sure you set one then try again.
            </AlertDialogDescription>
          )}
          {otherErrors && (
            <AlertDialogDescription>
              <p>Specifically, it looks like something went wrong when:</p>
              <br />
              <ul className="ml-12 list-disc">
                {otherErrorsExplination.map((error) => {
                  return <li>Getting {error}</li>;
                })}
              </ul>
            </AlertDialogDescription>
          )}
          <AlertDialogFooter>
            <Button onClick={() => location.reload()}>Try Again</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default BlockingError;
