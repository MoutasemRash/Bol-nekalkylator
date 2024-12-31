import { PropsWithChildren } from "react";

const FromErrorMessage = ({ children }: PropsWithChildren) => {
  if (children)
    return (
      <div className="border-2 border-rose-300 w-full h-[62px] text-rose-300 flex items-center justify-center mt-4 p-2">
        {children}
      </div>
    );

  return null;
};

export default FromErrorMessage;
