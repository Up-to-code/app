export interface User {
    id: string;
    name: string;
    profileImage: string;
    userName: string;
    bio: string;
    verification: boolean;
    verification_type: "gold" | "blue" ;
  }