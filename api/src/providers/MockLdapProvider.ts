import bcrypt from 'bcrypt';
import sequelize from '../config/database';
import { initializeModels } from '../models';
import { IAuthProvider } from './IAuthProvider';

const models = initializeModels(sequelize);

export class MockLdapProvider implements IAuthProvider {
  async authenticate(
    email: string,
    password: string
  ): Promise<{ id: number; email: string; name: string; system_role: string }> {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      system_role: user.system_role,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    // JWT validation happens in middleware
    return true;
  }
}
