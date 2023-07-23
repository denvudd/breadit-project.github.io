import type { User } from "next-auth";
import React from "react";

interface UserAccountNavProps {
  // user: Pick<User, "name" | "image" | "email">
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({}) => {
  return <div>UserAccountNav</div>;
};

export default UserAccountNav;
