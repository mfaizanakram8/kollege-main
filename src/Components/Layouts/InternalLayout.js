import React from "react";
import UserContext from "../../Hooks/UserContext";
import Loading from "./Loading";

const InternalLayout = () => {
  const InternalResultForm = React.lazy(() =>
    import("../Forms/InternalResultForm")
  );
  const InternalStudent = React.lazy(() =>
    import("../Queries/InternalStudent")
  );
  const { user } = React.useContext(UserContext);
  return (
    <>
      {user.role === "student" ? (
        <React.Suspense fallback={<Loading />}>
          <InternalStudent />
        </React.Suspense>
      ) : (user.role === "HOD" || user.role === "teacher") ? (
        <React.Suspense fallback={<Loading />}>
          <InternalResultForm />
        </React.Suspense>
      ) : null}
    </>
  );
};

export default InternalLayout;
