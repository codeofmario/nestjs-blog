import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../entities/jwt-payload";

export const CurrentUserTokenId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.tokenId;
  }
);
