import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@app/common/enums/role";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.hasRoles(roles, user.roles);
  }

  private hasRoles(roles: Role[], userRoles: Role[]) {
    for (const role of roles) {
      if (!userRoles.includes(role)) {
        return false;
      }
    }

    return true;
  }
}
