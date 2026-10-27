import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.ts';
import { ProjectsController } from './projects.controller.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { AuthGuard } from '../common/auth.guard.ts';

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
