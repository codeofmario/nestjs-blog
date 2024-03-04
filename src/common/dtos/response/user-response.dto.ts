import { RoleResponseDto } from "./role-response.dto";
export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  avatarUrl: string;
  roles: RoleResponseDto[];
}
