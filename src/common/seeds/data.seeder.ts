import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "@app/common/entities/user.entity";
import { Role } from "@app/common/entities/role.entity";
import { Role as RoleEnum } from "@app/common/enums/role";
import { Post } from "@app/common/entities/post.entity";
import { faker } from "@faker-js/faker";

export default class DataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const postRepository = dataSource.getRepository(Post);

    if ((await roleRepository.find()).length > 0) return;

    const role = await roleRepository.save({
      name: RoleEnum.USER,
    });

    const password = await bcrypt.hash("password", 12);
    await userRepository.save([
      {
        username: "john",
        email: "john@codeofmario.com",
        password,
        roles: [role],
      },
      {
        username: "jane",
        email: "jane@codeofmario.com",
        password,
        roles: [role],
      },
    ]);

    const createdBy = (await userRepository.find())[0];
    await postRepository.save(
      [...Array(3).keys()].map(() => ({
        title: faker.lorem.words(3),
        body: faker.lorem.paragraph(),
        createdBy: createdBy,
        comments: [...Array(3).keys()].map(() => ({
          body: faker.lorem.paragraph(),
          createdBy: createdBy,
        })),
      }))
    );
  }
}
