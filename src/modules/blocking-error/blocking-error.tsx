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
  const { accountUidError } = useSelector((state: RootState) => state.userInfo);
  return (
    accountUidError && (
      <div>
        <AlertDialog open={accountUidError}>
          <AlertDialogContent>
            <AlertDialogHeader>Oops. Something went wrong.</AlertDialogHeader>
            <AlertDialogDescription>
              This is most likely because you forgot to create a .env file and
              set a ACCESS_TOKEN variable.
              <br />
              <br />
              Please make sure you set one then try again.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button onClick={() => location.reload()}>Try Again</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
};

export default BlockingError;
