import React from "react";
import { Button } from "./ui/Button";

interface SubscribeLeaveToggleProps {}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({}) => {
  const isSubscribed = false;
  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
