import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppError } from '../common/types.ts';
import { ProjectsService } from './projects.service.ts';
import { AuthGuard } from '../common/auth.guard.ts';
import { CurrentUser } from '../common/current-user.decorator.ts';
import type { AuthUser } from '../common/types.ts';

@Controller('api/projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  private readonly projectsService: ProjectsService;

  constructor(projectsService: ProjectsService) {
    this.projectsService = projectsService;
  }

  @Get()
  async listProjects(@CurrentUser() user: AuthUser) {
    return this.projectsService.listProjects(user.id);
  }

  @Get(':id')
  async getProject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.projectsService.getProject(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@CurrentUser() user: AuthUser, @Body() body: any, @Req() req: Request) {
    this.checkOrigin(req);
    return this.projectsService.createProject(user.id, body);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: any,
    @Req() req: Request
  ) {
    this.checkOrigin(req);
    return this.projectsService.updateProject(id, user.id, body);
  }

  private checkOrigin(req: Request) {
    const origin = req.headers.origin;
    if (origin !== (process.env.APP_ORIGIN ?? 'http://localhost:3000')) {
      throw new AppError(403, 'FORBIDDEN', 'Origem da requisição não permitida');
    }
  }
}
