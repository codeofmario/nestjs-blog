import { Role } from "@app/common/enums/role";

export type JwtPayload = {
  iss: string;
  sub: string;
  tokenId: string;
  roles: Role[];
};
