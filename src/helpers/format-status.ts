// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserStatus = (user: any) => {
    if(user.suspensionReason){
        return "suspended"
    }
    if (user) {
      if (user.isVerified && !user.isActive) {
        return "deleted";
      }
      if (!user.isVerified && !user.isActive ) {
        return "rejected";
      }
      if (!user.isVerified && user.isActive) {
        return "pending";
      }
      if (
        user.isVerified &&
        user.isActive
      ) {
        return "active";
      }
    }
    return "";
  };