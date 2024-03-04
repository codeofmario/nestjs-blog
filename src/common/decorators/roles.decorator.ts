import { SetMetadata } from "@nestjs/common";
import { Role } from "@app/common/enums/role";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
